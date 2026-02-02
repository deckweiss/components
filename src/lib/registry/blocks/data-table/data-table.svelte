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
	} from "@tanstack/table-core";
	import DataTableToolbar from "./data-table-toolbar.svelte";
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
	import * as Select from "$lib/components/ui/select";
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
	} = $props();

	let columnVisibility = new PersistedState<VisibilityState>(
		`${storagePrefix}.columnVisibility`,
		{}
	);
	let columnFilters = $state<ColumnFiltersState>([]);
	let sorting = $state<SortingState>(initialState?.sorting ?? []);
	let globalFilter = $state<any>(null);
	let columnSizing = new PersistedState<ColumnSizingState>(`${storagePrefix}.columnSizing`, {});
	let columnSizingInfo = $state<ColumnSizingInfoState>({});
	let tableContainerRef = $state<HTMLDivElement | null>(null);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		state: {
			get globalFilter() {
				return globalFilter;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility.current;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
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
		globalFilterFn: "includesString",
		defaultColumn: {
			filterFn: "arrIncludesSome",
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
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === "function") {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === "function") {
				columnVisibility.current = updater(columnVisibility.current);
			} else {
				columnVisibility.current = updater;
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
		enableMultiSort: false,
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
		const currentFilterState = JSON.stringify({ globalFilter, columnFilters });
		if (previousFilterState && previousFilterState !== currentFilterState) {
			pagination = { ...pagination, pageIndex: 0 };
		}
		previousFilterState = currentFilterState;
	});

	const rows = $derived(table.getRowModel().rows);
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

	onMount(() => {
		// if enableResizing, set the last column size to the remaining width of the container
		if (enableResizing && table.getAllColumns().length > 0) {
			const containerRect = tableContainerRef?.getBoundingClientRect();
			if (containerRect && containerRect.width > table.getCenterTotalSize()) {
				const lastColumnId = table.getAllColumns()[table.getAllColumns().length - 1].id;
				table.setColumnSizing({
					...columnSizing,
					[lastColumnId]:
						containerRect.width -
						table.getCenterTotalSize() +
						table.getColumn(lastColumnId).getSize(),
				});
			}
		}
	});
</script>

{#snippet Pagination({ table }: { table: TableType<TData> })}
	<div class="flex items-center justify-between px-2">
		<div class="text-muted-foreground flex-1 text-sm">
			{#if table.options.enableRowSelection}
				{table.getFilteredSelectedRowModel().rows.length} von
				{table.getFilteredRowModel().rows.length} Zeile(n) ausgewählt
			{/if}
		</div>
		<div class="flex items-center space-x-6 lg:space-x-8">
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
			<div class="flex w-[100px] items-center justify-center text-sm font-medium whitespace-nowrap">
				Seite {table.getState().pagination.pageIndex + 1} von
				{table.getPageCount()}
			</div>
			<div class="flex items-center space-x-2">
				<Button
					variant="outline"
					class="hidden size-8 p-0 lg:flex"
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
					class="hidden size-8 p-0 lg:flex"
					onclick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Go to last page</span>
					<ChevronsRightIcon />
				</Button>
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
	{@const currentSort = column.getIsSorted()}
	{#if !canSort}
		<div class={cn("truncate", className)} {...restProps}>
			<span class="truncate">{title}</span>
		</div>
	{:else}
		<div class={cn("relative left-[-4px] flex min-w-0 items-center", className)} {...restProps}>
			<button
				type="button"
				class={cn(
					buttonVariants({ size: "sm", variant: "ghost" }),
					"h-7 max-w-full min-w-0 rounded-md px-2 text-xs font-[600] tracking-wider text-[rgba(0,0,0,0.6)] uppercase hover:bg-[#00000010] has-[>svg]:px-2",
					currentSort ? "text-primary bg-[rgba(0,0,0,0.05)]" : ""
				)}
				onclick={() => {
					// Cycle through: no sort -> ASC -> DESC -> no sort
					if (!currentSort) {
						column.toggleSorting(false); // ASC
					} else if (currentSort === "asc") {
						column.toggleSorting(true); // DESC
					} else {
						column.clearSorting(); // Clear sorting
					}
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
		</div>
	{/if}
{/snippet}

<div
	class={cn("space-y-4", embeddedInParent ? "flex h-full flex-col" : "")}
	bind:this={tableContainerRef}
>
	<DataTableToolbar {table} {getColumnIconSnippet}>
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
				<div class="w-full max-w-sm">
					<Input
						placeholder="Suche..."
						oninput={(e) => table.setGlobalFilter(e.currentTarget.value)}
						onchange={(e) => {
							table.setGlobalFilter(e.currentTarget.value);
						}}
						class="h-[32px]"
					/>
				</div>
			{/if}
		{/snippet}
	</DataTableToolbar>

	<div
		class={cn(
			"overflow-hidden rounded-md border",
			embeddedInParent ? "relative flex-1 overflow-hidden" : ""
		)}
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
									}`}
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
									class={cn("overflow-hidden", cellClasses)}
									style={`${
										enableResizing ? ` width: calc(var(--col-${cell.column.id}-size) * 1px);` : ""
									}`}
								>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
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
										}`}
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
</style>
