<script lang="ts" generics="TData">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type Row,
		type SortingState,
		type VisibilityState,
		type Table as TableType,
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type Column,
		type InitialTableState,
		type ExpandedState,
		getExpandedRowModel,
		type ColumnSizingState,
		type ColumnSizingInfoState,
		type RowData,
	} from "@tanstack/table-core";
	import DataTableToolbar from "./data-table-toolbar.svelte";
	import DataTableColumnFilter from "./data-table-column-filter.svelte";
	import DataTablePaginationMenu from "./data-table-pagination-menu.svelte";
	import { createSvelteTable } from "$lib/components/ui/data-table/data-table.svelte";
	import FlexRender from "$lib/components/ui/data-table/flex-render.svelte";
	import * as Table from "$lib/components/ui/table";
	import { renderComponent, renderSnippet } from "$lib/components/ui/data-table/render-helpers";
	import { getColumnHeaderValue } from "./utils.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronsLeftIcon from "@lucide/svelte/icons/chevrons-left";
	import ChevronsRightIcon from "@lucide/svelte/icons/chevrons-right";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import SearchIcon from "@lucide/svelte/icons/search";
	import * as Select from "$lib/components/ui/select";
	import * as Popover from "$lib/components/ui/popover";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
	import { onMount, untrack, type Snippet } from "svelte";
	import { Input } from "$lib/components/ui/input";
	import { PersistedState } from "runed";

	let {
		data,
		columns,
		onRowClick,
		initialState,
		rowSelection = $bindable({}),
		enableRowSelection = false,
		enableExpanding = false,
		expanded = $bindable({}),
		expandedRow,
		embeddedInParent = false,
		enableResizing = false,
		enablePagination,
		pagination = $bindable({ pageIndex: 0, pageSize: 10 }),
		enableSearch = true,
		cellClasses = "py-2",
		rowHighlight,
		customElementsFirst: customElementsFirstSnippet,
		customElementsMiddle: customElementsMiddleSnippet,
		customElementsLast: customElementsLastSnippet,
		getColumnIconSnippet,
		getRowId,
		storagePrefix = "data-table",
		insertButton: insertButtonSnippet,
	}: {
		data: TData[];
		columns: ColumnDef<TData>[];
		onRowClick?: (row: Row<TData>) => void;
		initialState?: InitialTableState;
		rowSelection?: Record<string, boolean>;
		enableRowSelection?: boolean;
		enableExpanding?: boolean;
		expanded?: ExpandedState;
		expandedRow?: Snippet<[Row<TData>]>;
		/**
		 * Fits the table into the parent provided space
		 */
		embeddedInParent?: boolean;
		enableResizing?: boolean;
		enablePagination?: boolean;
		pagination?: PaginationState;
		enableSearch?: boolean;
		cellClasses?: string;
		rowHighlight?: (row: Row<TData>) => string;
		customElementsFirst?: Snippet<[TableType<TData>]>;
		customElementsMiddle?: Snippet<[TableType<TData>]>;
		customElementsLast?: Snippet<[TableType<TData>]>;
		getColumnIconSnippet?: (column: any) => Snippet<[{ column: any }]> | undefined;
		getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
		storagePrefix?: string;
		insertButton?: Snippet<[TableType<TData>]>;
	} = $props();

	let columnVisibility = new PersistedState<VisibilityState>(
		`${storagePrefix}.columnVisibility`,
		{}
	);
	let columnFilters = new PersistedState<ColumnFiltersState>(`${storagePrefix}.columnFilters`, []);
	let sorting = new PersistedState<SortingState>(
		`${storagePrefix}.sorting`,
		initialState?.sorting ?? []
	);
	let globalFilter = $state<any>(null);
	let columnSizing = new PersistedState<ColumnSizingState>(`${storagePrefix}.columnSizing`, {});
	let columnSizingInfo = $state<ColumnSizingInfoState>({});
	let tableContainerRef = $state<HTMLDivElement | null>(null);
	let tableBorderContainerRef = $state<HTMLDivElement | null>(null);
	let searchPopoverOpen = $state(false);
	let mobileSearchValue = $state("");

	// Sync mobile search value with global filter when popover opens
	$effect(() => {
		if (searchPopoverOpen) {
			mobileSearchValue = typeof globalFilter === "string" ? globalFilter : "";
		}
	});

	/**
	 * Custom global filter function with prioritized matching:
	 * 1. Exact word matches (highest priority) - e.g., "Anne"
	 * 2. Matches at start of word (medium-high priority) - e.g., "Annemarie"
	 * 3. Matches at end of word (medium-low priority) - e.g., "Susanne"
	 * 4. Matches anywhere in a word (lowest priority) - e.g., "Hannes"
	 */
	function prioritizedIncludesString<TData extends RowData>(
		row: Row<TData>,
		columnId: string,
		filterValue: string
	): number {
		if (!filterValue) return 0;

		const searchValue = filterValue.toLowerCase();
		// Escape special regex characters in search value
		const escapedSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

		// Priority 3: Exact word match - "anne" as a complete word (bounded by word boundaries)
		const exactWordRegex = new RegExp(`\\b${escapedSearch}\\b`, "i");

		// Priority 2: Match at start of word (followed by a letter, so not exact word) - "anne" at start like "Annemarie"
		const startOfWordRegex = new RegExp(`\\b${escapedSearch}[a-z]`, "i");
		// Priority 1: Match at end of word (preceded by a letter, so not exact word) - "anne" at end like "Susanne"
		const endOfWordRegex = new RegExp(`[a-z]${escapedSearch}\\b`, "i");

		// Priority 0.5: Match anywhere (but not already matched above) - "anne" in middle like "Hannes"
		const includesRegex = new RegExp(escapedSearch, "i");

		// Check all searchable columns
		const allColumns = row.getAllCells();
		let maxPriority = 0;

		for (const cell of allColumns) {
			const cellValue = String(cell.getValue() ?? "").toLowerCase();

			// Priority 3: Exact word match
			if (exactWordRegex.test(cellValue)) {
				maxPriority = Math.max(maxPriority, 3);
			}
			// Priority 2: Match at start of word (but not exact word)
			else if (startOfWordRegex.test(cellValue)) {
				maxPriority = Math.max(maxPriority, 2);
			}
			// Priority 1: Match at end of word (but not exact word)
			else if (endOfWordRegex.test(cellValue)) {
				maxPriority = Math.max(maxPriority, 1);
			}
			// Priority 0.5: Match anywhere
			else if (includesRegex.test(cellValue)) {
				maxPriority = Math.max(maxPriority, 0.5);
			}
		}

		return maxPriority;
	}

	type FilterOperator =
		| "="
		| "<>"
		| ">="
		| "<="
		| "~~*"
		| "in"
		| "is_null"
		| "is_not_null"
		| "between";
	type FilterValue = {
		operator: FilterOperator;
		value: string | string[] | null;
		value2?: string | null; // For "between" operator
	};

	/**
	 * Custom column filter function that supports multiple operators:
	 * =, <>, >=, <=, ~~*, in, is, between
	 */
	function operatorFilterFn<TData extends RowData>(
		row: Row<TData>,
		columnId: string,
		filterValue: FilterValue
	): boolean {
		const { operator, value, value2 } = filterValue;

		const cellValue = row.getValue(columnId);
		const cellStr = String(cellValue ?? "");
		const cellNum = Number(cellValue);

		switch (operator) {
			case "=":
				if (value === null || value === undefined) return true;
				// Try date comparison first
				const eqDate = new Date(String(value));
				const cellEqDate = new Date(cellValue);
				if (!isNaN(eqDate.getTime()) && !isNaN(cellEqDate.getTime())) {
					return eqDate.getTime() === cellEqDate.getTime();
				}
				return cellStr === String(value);

			case "<>":
				if (value === null || value === undefined) return true;
				// Try date comparison first
				const neDate = new Date(String(value));
				const cellNeDate = new Date(cellValue);
				if (!isNaN(neDate.getTime()) && !isNaN(cellNeDate.getTime())) {
					return neDate.getTime() !== cellNeDate.getTime();
				}
				return cellStr !== String(value);

			case ">=": {
				if (value === null || value === undefined) return true;
				// Try date comparison first
				const gteDate = new Date(String(value));
				const cellGteDate = new Date(cellValue);
				if (!isNaN(gteDate.getTime()) && !isNaN(cellGteDate.getTime())) {
					return cellGteDate >= gteDate;
				}
				// Number comparison
				const compareNum = Number(value);
				if (!isNaN(cellNum) && !isNaN(compareNum)) {
					return cellNum >= compareNum;
				}
				return cellStr >= String(value);
			}

			case "<=": {
				if (value === null || value === undefined) return true;
				// Try date comparison first
				const lteDate = new Date(String(value));
				const cellLteDate = new Date(cellValue);
				if (!isNaN(lteDate.getTime()) && !isNaN(cellLteDate.getTime())) {
					return cellLteDate <= lteDate;
				}
				// Number comparison
				const compareNum = Number(value);
				if (!isNaN(cellNum) && !isNaN(compareNum)) {
					return cellNum <= compareNum;
				}
				return cellStr <= String(value);
			}

			case "~~*":
				// ilike operator - contains substring (case-insensitive)
				// For dates, can also filter by day/month/year
				if (value === null || value === undefined) return true;
				const valueStr = String(value);
				// Check if it's a date part filter (format: "day:15" or "month:3" or "year:2024")
				if (valueStr.includes(":")) {
					const [datePart, datePartValue] = valueStr.split(":");
					const cellDate = new Date(cellValue);
					if (isNaN(cellDate.getTime())) return false; // Invalid date
					if (datePart === "day") {
						return cellDate.getDate() === Number.parseInt(datePartValue, 10);
					} else if (datePart === "month") {
						return cellDate.getMonth() + 1 === Number.parseInt(datePartValue, 10); // getMonth() returns 0-11
					} else if (datePart === "year") {
						return cellDate.getFullYear() === Number.parseInt(datePartValue, 10);
					}
					return false;
				}
				// Regular string contains check
				return cellStr.toLowerCase().includes(valueStr.toLowerCase());

			case "in":
				// one of a list of values
				if (Array.isArray(value) && value.length > 0) {
					return value.includes(cellStr);
				}
				return false;

			case "between":
				// von...bis - value is min, value2 is max
				if (value === null || value === undefined || value2 === null || value2 === undefined) {
					return true;
				}
				// Try date comparison first
				const minDate = new Date(String(value));
				const maxDate = new Date(String(value2));
				const cellDate = new Date(cellValue);
				if (!isNaN(minDate.getTime()) && !isNaN(maxDate.getTime()) && !isNaN(cellDate.getTime())) {
					return cellDate >= minDate && cellDate <= maxDate;
				}
				// Number comparison
				const minNum = Number(value);
				const maxNum = Number(value2);
				if (!isNaN(cellNum) && !isNaN(minNum) && !isNaN(maxNum)) {
					return cellNum >= minNum && cellNum <= maxNum;
				}
				// String comparison fallback
				const minStr = String(value);
				const maxStr = String(value2);
				return cellStr >= minStr && cellStr <= maxStr;

			case "is_null":
				// checking for null/empty
				return cellValue === null || cellValue === undefined || cellStr === "";

			case "is_not_null":
				// checking for not null/not empty
				return cellValue !== null && cellValue !== undefined && cellStr !== "";

			default:
				return true;
		}
	}

	const table = createSvelteTable({
		get data() {
			return data;
		},
		state: {
			get globalFilter() {
				return globalFilter;
			},
			get sorting() {
				return sorting.current;
			},
			get columnVisibility() {
				return columnVisibility.current;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters.current;
			},
			get pagination() {
				return enablePagination ? pagination : { pageIndex: 0, pageSize: Infinity };
			},
			get expanded() {
				return expanded;
			},
			get columnSizing() {
				return columnSizing.current;
			},
			get columnSizingInfo() {
				return columnSizingInfo;
			},
		},
		getRowId,
		columnResizeMode: "onChange",
		initialState,
		enableExpanding,
		globalFilterFn: (row, columnId, filterValue) => {
			return prioritizedIncludesString(row, columnId, filterValue) > 0;
		},
		defaultColumn: {
			filterFn: operatorFilterFn,
			...(enableResizing && {
				minSize: 100,
			}),
		},
		onGlobalFilterChange: (updater) => {
			if (typeof updater === "function") {
				globalFilter = updater(globalFilter);
			} else {
				globalFilter = updater;
			}
		},
		columns: enableRowSelection
			? [
					{
						id: "select",
						header: ({ table }) =>
							renderComponent(Checkbox, {
								checked: table.getIsAllPageRowsSelected(),
								onCheckedChange: (value) => table.toggleAllPageRowsSelected(value),
								indeterminate:
									table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
								"aria-label": "Select all",
							}),
						cell: ({ row }) =>
							renderComponent(Checkbox, {
								checked: row.getIsSelected(),
								onclick: (event) => {
									event.stopPropagation();
								},
								onCheckedChange: (value) => row.toggleSelected(value),
								"aria-label": "Select row",
							}),
						enableSorting: false,
						enableHiding: false,
						...(enableResizing && {
							minSize: 35,
							size: 35,
							maxSize: 35,
						}),
					},
					...columns,
				]
			: columns,
		enableRowSelection,
		onExpandedChange: (updater) => {
			if (typeof updater === "function") {
				expanded = updater(expanded);
			} else {
				expanded = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === "function") {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === "function") {
				sorting.current = updater(sorting.current);
			} else {
				sorting.current = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === "function") {
				columnFilters.current = updater(columnFilters.current);
			} else {
				columnFilters.current = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === "function") {
				columnVisibility.current = updater(columnVisibility.current);
			} else {
				columnVisibility.current = updater;
			}

			// Trigger column resize after visibility change
			if (enableResizing && tableBorderContainerRef) {
				// Use double requestAnimationFrame to ensure DOM has updated
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						const containerRect = tableBorderContainerRef?.getBoundingClientRect();
						if (!containerRect) return;

						const visibleColumns = table.getAllColumns().filter((col) => col.getIsVisible());
						if (visibleColumns.length === 0) return;

						// Calculate total size of ONLY visible columns
						const currentSizes = visibleColumns.map((col) => col.getSize());
						const currentTotalSize = currentSizes.reduce((sum, size) => sum + size, 0);
						const availableWidth = containerRect.width;
						const spaceDifference = availableWidth - currentTotalSize;

						// Only resize if columns are narrower than container (no horizontal scroll needed)
						// If columns are wider, let them scroll horizontally
						if (spaceDifference > 10 && currentTotalSize > 0) {
							// Distribute extra space proportionally among visible columns
							const newSizing: ColumnSizingState = { ...columnSizing.current };

							visibleColumns.forEach((col, index) => {
								const currentSize = currentSizes[index]!;
								const proportion = currentSize / currentTotalSize;
								const sizeAdjustment = spaceDifference * proportion;
								const newSize = currentSize + sizeAdjustment;
								// Ensure we don't go below minSize
								const minSize = col.columnDef.minSize ?? 100;
								newSizing[col.id] = Math.max(minSize, newSize);
							});

							columnSizing.current = newSizing;
						}
					});
				});
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onColumnSizingChange: (updater) => {
			if (typeof updater === "function") {
				columnSizing.current = updater(columnSizing.current);
			} else {
				columnSizing.current = updater;
			}
		},
		onColumnSizingInfoChange: (updater) => {
			if (typeof updater === "function") {
				columnSizingInfo = updater(columnSizingInfo);
			} else {
				columnSizingInfo = updater;
			}
		},
		autoResetPageIndex: false,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getExpandedRowModel: getExpandedRowModel(),
		// Performance optimizations
		enableColumnResizing: enableResizing,
		enableMultiSort: true,
	});
	let columnSizeVars = $derived.by(() => {
		const headers = untrack(() => table.getFlatHeaders());
		const sizingInfo = columnSizingInfo;
		const sizing = columnSizing.current;
		const colSizes: { [key: string]: number } = {};
		for (let i = 0; i < headers.length; i++) {
			const header = headers[i]!;
			colSizes[`--header-${header.id}-size`] = header.getSize();
			colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
		}
		return Object.entries(colSizes)
			.map(([key, value]) => `${key}: ${value};`)
			.join(" ");
	});

	//reset page when filters change
	let previousFilterState = $state<string>("");
	$effect(() => {
		const currentFilterState = JSON.stringify({
			globalFilter,
			columnFilters: columnFilters.current,
		});
		if (previousFilterState && previousFilterState !== currentFilterState) {
			pagination = { ...pagination, pageIndex: 0 };
		}
		previousFilterState = currentFilterState;
	});

	// Track visible columns to detect visibility changes
	const visibleColumnIds = $derived.by(() => {
		return table
			.getAllColumns()
			.filter((col) => col.getIsVisible())
			.map((col) => col.id)
			.sort()
			.join(",");
	});

	// Auto-resize columns when visibility changes
	let previousVisibleColumnIds = $state<string>("");
	$effect(() => {
		if (!enableResizing || !tableBorderContainerRef) return;

		const currentVisibleIds = visibleColumnIds;

		// Only resize if visibility actually changed
		if (previousVisibleColumnIds && previousVisibleColumnIds !== currentVisibleIds) {
			// Use double requestAnimationFrame to ensure DOM has fully updated after visibility change
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					const containerRect = tableBorderContainerRef?.getBoundingClientRect();
					if (!containerRect) return;

					const visibleColumns = table.getAllColumns().filter((col) => col.getIsVisible());
					if (visibleColumns.length === 0) return;

					// Calculate total size of ONLY visible columns
					const currentSizes = visibleColumns.map((col) => col.getSize());
					const currentTotalSize = currentSizes.reduce((sum, size) => sum + size, 0);
					const availableWidth = containerRect.width;
					const spaceDifference = availableWidth - currentTotalSize;

					// Only resize if columns are narrower than container (no horizontal scroll needed)
					// If columns are wider, let them scroll horizontally
					if (spaceDifference > 10 && currentTotalSize > 0) {
						// Distribute extra space proportionally among visible columns
						const newSizing: ColumnSizingState = { ...columnSizing.current };

						visibleColumns.forEach((col, index) => {
							const currentSize = currentSizes[index]!;
							const proportion = currentSize / currentTotalSize;
							const sizeAdjustment = spaceDifference * proportion;
							const newSize = currentSize + sizeAdjustment;
							// Ensure we don't go below minSize
							const minSize = col.columnDef.minSize ?? 100;
							newSizing[col.id] = Math.max(minSize, newSize);
						});

						columnSizing.current = newSizing;
					}
				});
			});
		}

		previousVisibleColumnIds = currentVisibleIds;
	});

	// Sort filtered rows by priority when global filter is active
	// Note: globalFilterFn only filters (returns boolean), it doesn't sort.
	// We need to sort the filtered results to show higher-priority matches first.
	const rows = $derived.by(() => {
		const filteredRows = table.getRowModel().rows;

		// If there's a global filter, sort by match priority
		if (globalFilter && typeof globalFilter === "string" && globalFilter.trim()) {
			return [...filteredRows].sort((a, b) => {
				const priorityA = prioritizedIncludesString(a, "", globalFilter);
				const priorityB = prioritizedIncludesString(b, "", globalFilter);
				// Higher priority first (3 > 2 > 1)
				return priorityB - priorityA;
			});
		}

		return filteredRows;
	});
	const headerGroups = $derived(table.getHeaderGroups());

	//progressive rendering: render rows in batches
	let visibleRowsCount = $state(0);
	const BATCH_SIZE = 3;

	$effect(() => {
		visibleRowsCount = Math.min(BATCH_SIZE, rows.length);
	});

	$effect(() => {
		if (visibleRowsCount < rows.length) {
			const timer = setTimeout(() => {
				visibleRowsCount = Math.min(visibleRowsCount + BATCH_SIZE, rows.length);
			}, 0);
			return () => clearTimeout(timer);
		}
	});

	const visibleRows = $derived(rows.slice(0, visibleRowsCount));

	// Track if we're on mobile (disable sticky on mobile)
	let isMobile = $state(false);

	$effect(() => {
		if (typeof window === "undefined") return;

		const checkMobile = () => {
			isMobile = window.innerWidth < 768; // md breakpoint
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	});

	// Calculate sticky column positions and offsets
	const stickyColumnInfo = $derived.by(() => {
		const headers = untrack(() => table.getFlatHeaders());
		const visibleHeaders = headers.filter((header) => !header.column.columnDef.meta?.hidden);

		const stickyInfo: Map<string, { position: "left" | "right"; offset: number; zIndex: number }> =
			new Map();

		if (isMobile) {
			return stickyInfo; // No sticky on mobile
		}

		// Calculate left-sticky columns
		let leftOffset = 0;
		let leftZIndex = 10;
		for (let i = 0; i < visibleHeaders.length; i++) {
			const header = visibleHeaders[i]!;
			const sticky = header.column.columnDef.meta?.sticky;
			if (sticky === "left") {
				stickyInfo.set(header.id, {
					position: "left",
					offset: leftOffset,
					zIndex: leftZIndex++,
				});
				leftOffset += header.getSize();
			}
		}

		// Calculate right-sticky columns (from right to left)
		let rightOffset = 0;
		let rightZIndex = 10;
		for (let i = visibleHeaders.length - 1; i >= 0; i--) {
			const header = visibleHeaders[i]!;
			const sticky = header.column.columnDef.meta?.sticky;
			if (sticky === "right") {
				stickyInfo.set(header.id, {
					position: "right",
					offset: rightOffset,
					zIndex: rightZIndex++,
				});
				rightOffset += header.getSize();
			}
		}

		return stickyInfo;
	});

	// Helper function to get sticky styles for a column
	function getStickyStyles(columnId: string, isHeader: boolean = false): string {
		if (isMobile) return "";

		const info = stickyColumnInfo.get(columnId);
		if (!info) return "";

		const { position, offset, zIndex } = info;
		const bgColor = isHeader ? "rgb(243, 244, 246)" : "white"; // Match header bg-gray-100 or white for cells
		return `position: sticky; ${position}: ${offset}px; z-index: ${zIndex}; background-color: ${bgColor};`;
	}

	onMount(() => {
		// if enableResizing, resize visible columns to fit the container width
		if (enableResizing && table.getAllColumns().length > 0) {
			// Use requestAnimationFrame to ensure DOM is ready
			requestAnimationFrame(() => {
				const containerRect = tableBorderContainerRef?.getBoundingClientRect();
				if (!containerRect) return;

				const visibleColumns = table.getAllColumns().filter((col) => col.getIsVisible());
				if (visibleColumns.length === 0) return;

				// Calculate total size of ONLY visible columns
				const currentSizes = visibleColumns.map((col) => col.getSize());
				const currentTotalSize = currentSizes.reduce((sum, size) => sum + size, 0);
				const availableWidth = containerRect.width;
				const spaceDifference = availableWidth - currentTotalSize;

				// Only resize if columns are narrower than container (no horizontal scroll needed)
				// If columns are wider, let them scroll horizontally
				if (spaceDifference > 10 && currentTotalSize > 0) {
					// Distribute extra space proportionally among visible columns
					const newSizing: ColumnSizingState = { ...columnSizing.current };

					visibleColumns.forEach((col, index) => {
						const currentSize = currentSizes[index]!;
						const proportion = currentSize / currentTotalSize;
						const sizeAdjustment = spaceDifference * proportion;
						const newSize = currentSize + sizeAdjustment;
						// Ensure we don't go below minSize
						const minSize = col.columnDef.minSize ?? 100;
						newSizing[col.id] = Math.max(minSize, newSize);
					});

					columnSizing.current = newSizing;
				}
			});
		}
	});
</script>

{#snippet Pagination({ table }: { table: TableType<TData> })}
	<div class="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
		<!-- Mobile: Left side with selection text and page info stacked -->
		<div class="flex flex-col gap-1 sm:flex-1 sm:flex-row">
			<div class="text-muted-foreground text-xs sm:text-sm">
				{#if table.options.enableRowSelection}
					{table.getFilteredSelectedRowModel().rows.length} von
					{table.getFilteredRowModel().rows.length} Zeile(n) ausgewählt
				{/if}
			</div>
			<!-- Mobile: Page info below selection text -->
			<div class="text-foreground text-sm font-medium sm:hidden">
				Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}
			</div>
		</div>

		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-4 lg:space-x-6">
			<!-- Mobile: Seiten popover on the right -->
			<div class="flex items-center justify-between gap-2 sm:hidden">
				<DataTablePaginationMenu {table} includePageSizeSelector={true} align="end" />
			</div>

			<!-- Tablet: Seite X von Y on left, Seiten popover on right with page size selector inside -->
			<div class="hidden items-center justify-between gap-2 sm:flex lg:hidden">
				<div class="text-sm font-medium">
					Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}
				</div>
				<DataTablePaginationMenu {table} includePageSizeSelector={true} align="end" />
			</div>

			<!-- Desktop: Full button layout -->
			<div class="hidden items-center space-x-2 lg:flex">
				<div class="flex items-center space-x-2">
					<p class="text-sm font-medium">Zeilen pro Seite</p>
					<Select.Root
						allowDeselect={false}
						type="single"
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<Select.Trigger class="h-8 w-[70px]">
							{String(table.getState().pagination.pageSize)}
						</Select.Trigger>
						<Select.Content side="top">
							{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
								<Select.Item value={`${pageSize}`}>
									{pageSize}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div
					class="flex w-[100px] items-center justify-center text-sm font-medium whitespace-nowrap"
				>
					Seite {table.getState().pagination.pageIndex + 1} von
					{table.getPageCount()}
				</div>
				<div class="flex items-center space-x-2">
					<Button
						variant="outline"
						class="size-8 p-0"
						onclick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Go to first page</span>
						<ChevronsLeftIcon />
					</Button>
					<Button
						variant="outline"
						class="size-8 p-0"
						onclick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span class="sr-only">Go to previous page</span>
						<ChevronLeftIcon />
					</Button>
					<Button
						variant="outline"
						class="size-8 p-0"
						onclick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Go to next page</span>
						<ChevronRightIcon />
					</Button>
					<Button
						variant="outline"
						class="size-8 p-0"
						onclick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span class="sr-only">Go to last page</span>
						<ChevronsRightIcon />
					</Button>
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet ColumnHeader({
	column,
	title,
	class: className,
	...restProps
}: { column: Column<TData>; title: string } & HTMLAttributes<HTMLDivElement>)}
	{@const canSort = column.columnDef.enableSorting && column?.getCanSort()}
	{@const canFilter = column.columnDef.enableColumnFilter && column.getCanFilter()}
	{@const currentSort = column.getIsSorted()}
	{#if !canSort && !canFilter}
		<div class={cn("truncate", className)} {...restProps}>
			<span class="truncate">{title}</span>
		</div>
	{:else}
		<div
			class={cn("relative left-[-4px] flex min-w-0 items-center gap-1", className)}
			{...restProps}
		>
			{#if canSort}
				<button
					type="button"
					class={cn(
						buttonVariants({ size: "sm", variant: "ghost" }),
						"h-7 max-w-full min-w-0 rounded-md px-2 text-xs font-[600] tracking-wider text-[rgba(0,0,0,0.6)] uppercase hover:bg-[#00000010] has-[>svg]:px-2",
						currentSort ? "text-primary bg-[rgba(0,0,0,0.05)]" : ""
					)}
					onclick={() => {
						const currentSorting = table.getState().sorting;
						const columnId = column.id;

						// Find if this column is already sorted
						const existingSortIndex = currentSorting.findIndex((s) => s.id === columnId);

						let newSorting: SortingState;

						if (existingSortIndex === -1) {
							// Column not sorted: add it as ASC (last priority)
							newSorting = [...currentSorting, { id: columnId, desc: false }];
						} else {
							const existingSort = currentSorting[existingSortIndex]!;
							if (existingSort.desc === false) {
								// Currently ASC: change to DESC
								newSorting = [...currentSorting];
								newSorting[existingSortIndex] = { id: columnId, desc: true };
							} else {
								// Currently DESC: remove from sorting
								newSorting = currentSorting.filter((s) => s.id !== columnId);
							}
						}

						// Update sorting (this will trigger onSortingChange and persist to localStorage)
						table.setSorting(newSorting);
					}}
				>
					{#if currentSort === "desc"}
						<ArrowDownIcon class="shrink-0" />
					{:else if currentSort === "asc"}
						<ArrowUpIcon class="shrink-0" />
					{:else}
						<ChevronsUpDownIcon class="shrink-0" />
					{/if}
					<span class="truncate">{title}</span>
				</button>
			{:else}
				<span
					class="truncate px-2 text-xs font-[600] tracking-wider text-[rgba(0,0,0,0.6)] uppercase"
					>{title}</span
				>
			{/if}
			{#if canFilter}
				<DataTableColumnFilter {table} {column} />
			{/if}
		</div>
	{/if}
{/snippet}

<div
	class={cn("space-y-4", embeddedInParent ? "flex h-full flex-col" : "")}
	bind:this={tableContainerRef}
>
	<DataTableToolbar {table} {getColumnIconSnippet} insertButton={insertButtonSnippet}>
		{#snippet customElementsFirst(table)}
			{#if customElementsFirstSnippet}
				{@render customElementsFirstSnippet?.(table)}
			{/if}
		{/snippet}
		{#snippet customElementsMiddle(table)}
			{#if customElementsMiddleSnippet}
				{@render customElementsMiddleSnippet?.(table)}
			{/if}
		{/snippet}
		{#snippet customElementsLast(table)}
			{#if enableSearch}
				<!-- Desktop: Full search input -->
				<div class="hidden w-full max-w-sm sm:block">
					<Input
						placeholder="Suche..."
						oninput={(e) => table.setGlobalFilter(e.currentTarget.value)}
						onchange={(e) => {
							table.setGlobalFilter(e.currentTarget.value);
						}}
						class="h-[32px] text-sm"
					/>
				</div>
				<!-- Mobile: Search button with popover -->
				<Popover.Root bind:open={searchPopoverOpen}>
					<Popover.Trigger class="md:hidden">
						{#snippet child({ props })}
							<Button
								{...props}
								variant="outline"
								size="sm"
								class="h-8 {globalFilter
									? 'text-primary border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.07)]'
									: ''} sm:hidden"
							>
								<SearchIcon class="size-4 {globalFilter ? 'fill-current' : ''}" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-[300px] p-4" align="end">
						<div class="space-y-2">
							<Input
								placeholder="Suche..."
								bind:value={mobileSearchValue}
								oninput={(e) => {
									mobileSearchValue = e.currentTarget.value;
									table.setGlobalFilter(e.currentTarget.value);
								}}
								onchange={(e) => {
									mobileSearchValue = e.currentTarget.value;
									table.setGlobalFilter(e.currentTarget.value);
								}}
								class="h-[32px] text-sm"
								autofocus
							/>
						</div>
					</Popover.Content>
				</Popover.Root>
			{/if}
		{/snippet}
	</DataTableToolbar>

	<div
		class={cn(
			"overflow-hidden rounded-md border",
			embeddedInParent ? "relative flex-1 overflow-hidden" : ""
		)}
		bind:this={tableBorderContainerRef}
	>
		<div class={cn("overflow-x-auto", embeddedInParent ? "absolute inset-0 overflow-y-auto" : "")}>
			<Table.Root
				class={cn(enableResizing ? "table-fixed bg-white" : "")}
				style={enableResizing ? columnSizeVars + `width: ${table.getCenterTotalSize()}px;` : ""}
			>
				<Table.Header class={cn("bg-gray-100", embeddedInParent ? "sticky top-0 z-10" : "")}>
					{#each headerGroups as headerGroup (headerGroup.id)}
						{@const visibleHeaders = headerGroup.headers.filter(
							(header) => !header.column.columnDef.meta?.hidden
						)}
						<Table.Row>
							{#each visibleHeaders as header (header.id)}
								<Table.Head
									colspan={header.colSpan}
									class={cn(
										"text-xs font-[600] tracking-wider text-[rgba(0,0,0,0.6)] uppercase",
										enableResizing ? "relative border-l first:border-l-0" : ""
									)}
									style={`${
										enableResizing ? ` width: calc(var(--header-${header.id}-size) * 1px);` : ""
									}${getStickyStyles(header.id, true)}`}
								>
									{#if !header.isPlaceholder}
										{#if header.column.columnDef.header instanceof Function && header.column.id === "select"}
											<FlexRender
												content={header.column.columnDef.header}
												context={header.getContext()}
											/>
										{:else}
											<FlexRender
												content={() =>
													renderSnippet(ColumnHeader, {
														column: header.column,
														title: getColumnHeaderValue(header.column, table),
													})}
												context={header.getContext()}
											/>
										{/if}
										{#if enableResizing}
											<button
												ondblclick={() => header.column.resetSize()}
												onmousedown={header.getResizeHandler()}
												ontouchstart={header.getResizeHandler()}
												class={`resizer ${
													table.options.columnResizeDirection
												} ${header.column.getIsResizing() ? "isResizing" : ""}`}
											>
												<span class="sr-only">Resize column</span>
											</button>
										{/if}
									{/if}
								</Table.Head>
							{/each}
						</Table.Row>
					{/each}
				</Table.Header>
				<Table.Body>
					{#each visibleRows as row (row.id)}
						{@const visibleCells = row
							.getVisibleCells()
							.filter((cell) => !cell.column.columnDef.meta?.hidden)}
						<Table.Row
							class={cn(onRowClick ? "cursor-pointer" : "", rowHighlight?.(row) || "")}
							onclick={() => {
								onRowClick?.(row);
							}}
							data-state={row.getIsSelected() && "selected"}
						>
							{#each visibleCells as cell (cell.id)}
								<Table.Cell
									class={cn("min-w-0 overflow-hidden", cellClasses)}
									style={`${
										enableResizing ? ` width: calc(var(--col-${cell.column.id}-size) * 1px);` : ""
									}${getStickyStyles(cell.column.id, false)}`}
								>
									<div class="block max-w-full min-w-0 truncate">
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</div>
								</Table.Cell>
							{/each}
						</Table.Row>

						{#if row.getIsExpanded()}
							<Table.Row>
								<Table.Cell colspan={row.getAllCells().length}>
									{@render expandedRow?.(row)}
								</Table.Cell>
							</Table.Row>
						{/if}
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">
								Keine Daten gefunden
							</Table.Cell>
						</Table.Row>
					{/each}

					{#if visibleRowsCount < rows.length}
						{#each Array(rows.length - visibleRowsCount) as _, i (i + visibleRowsCount)}
							<Table.Row>
								{#each headerGroups[0]?.headers.filter((h) => !h.column.columnDef.meta?.hidden) || [] as header}
									<Table.Cell
										class={cellClasses}
										style={`${
											enableResizing ? ` width: calc(var(--col-${header.id}-size) * 1px);` : ""
										}${getStickyStyles(header.id, false)}`}
									>
										<div class="bg-muted h-4 w-3/4 rounded"></div>
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	</div>

	{#if enablePagination}
		{@render Pagination({ table })}
	{/if}
</div>

<style>
	.resizer {
		position: absolute;
		top: 0;
		height: 100%;
		width: 2px;
		background: rgba(0, 0, 0, 0.2);
		cursor: col-resize;
		user-select: none;
		touch-action: none;
	}

	.resizer.ltr {
		right: 0;
	}

	.resizer.rtl {
		left: 0;
	}

	.resizer.isResizing {
		background: blue;
		opacity: 1;
	}

	.resizer {
		opacity: 0;
	}

	:global(*:hover > .resizer) {
		opacity: 1;
	}

	:global([data-slot="table-cell"] > div.truncate > *) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		max-width: 100%;
	}
</style>
