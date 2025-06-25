<script lang="ts" generics="TData">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type Row,
		type RowSelectionState,
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
		type HeaderContext,
	} from "@tanstack/table-core";
	import DataTableToolbar from "./data-table-toolbar.svelte";
	import { createSvelteTable } from "$lib/components/ui/data-table/data-table.svelte";
	import FlexRender from "$lib/components/ui/data-table/flex-render.svelte";
	import * as Table from "$lib/components/ui/table";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import {
		renderComponent,
		RenderComponentConfig,
		renderSnippet,
		RenderSnippetConfig,
	} from "$lib/components/ui/data-table/render-helpers";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronsLeftIcon from "@lucide/svelte/icons/chevrons-left";
	import ChevronsRightIcon from "@lucide/svelte/icons/chevrons-right";
	import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import EyeOffIcon from "@lucide/svelte/icons/eye-off";
	import * as Select from "$lib/components/ui/select";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
	import type { Snippet } from "svelte";

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
		enablePagination,
		cellClasses = "py-2",
		customFilters,
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
		enablePagination?: boolean;
		cellClasses?: string;
		customFilters?: Snippet<[TableType<TData>]>;
	} = $props();

	let columnVisibility = $state<VisibilityState>({});
	let columnFilters = $state<ColumnFiltersState>([]);
	let sorting = $state<SortingState>(initialState?.sorting ?? []);
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

	const table = createSvelteTable({
		get data() {
			return data;
		},
		state: {
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
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
		},
		initialState,
		enableExpanding,
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
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getExpandedRowModel: getExpandedRowModel(),
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
			<div class="flex w-[100px] items-center justify-center text-sm font-medium">
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
	context,
	class: className,
	...restProps
}: { column: Column<TData>; context: HeaderContext<TData, any> } & HTMLAttributes<HTMLDivElement>)}
	{#if !((column.columnDef.enableSorting && column?.getCanSort()) || (column.getCanHide() && column.columnDef.enableHiding))}
		<div class={className} {...restProps}>
			<FlexRender content={column.columnDef.header} {context} />
		</div>
	{:else}
		<div class={cn("flex items-center", className)} {...restProps}>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ size: "sm", variant: "ghost" })}
					>{#snippet children()}
						<span>
							<FlexRender content={column.columnDef.header} {context} />
						</span>
						{#if column.getIsSorted() === "desc"}
							<ArrowDownIcon />
						{:else if column.getIsSorted() === "asc"}
							<ArrowUpIcon />
						{:else}
							<ChevronsUpDownIcon />
						{/if}
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="start">
					{#if column.columnDef.enableSorting && column.getCanSort()}
						<DropdownMenu.Item onclick={() => column.toggleSorting(false)}>
							<ArrowUpIcon class="text-muted-foreground/70 mr-2 size-3.5" />
							Aufsteigend
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => column.toggleSorting(true)}>
							<ArrowDownIcon class="text-muted-foreground/70 mr-2 size-3.5" />
							Absteigend
						</DropdownMenu.Item>
					{/if}

					{#if column.columnDef.enableSorting && column.getCanSort() && column.columnDef.enableHiding && column.getCanHide()}
						<DropdownMenu.Separator />
					{/if}

					{#if column.columnDef.enableHiding && column.getCanHide()}
						<DropdownMenu.Item onclick={() => column.toggleVisibility(false)}>
							<EyeOffIcon class="text-muted-foreground/70 mr-2 size-3.5" />
							Ausblenden
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	{/if}
{/snippet}

<div class="flex flex-col space-y-4">
	<DataTableToolbar {table}>
		{#snippet custom(table)}
			{#if customFilters}
				{@render customFilters(table)}
			{/if}
		{/snippet}
	</DataTableToolbar>
	<div class="overflow-x-auto rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									{#if header.column.columnDef.header instanceof Function && header.column.columnDef.meta?.overrideDefaultHeaderUI}
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
									{:else}
										<FlexRender
											content={() =>
												renderSnippet(ColumnHeader, {
													column: header.column,
													context: header.getContext(),
												})}
											context={header.getContext()}
										/>
									{/if}
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row
						class={onRowClick ? "cursor-pointer" : ""}
						onclick={() => {
							onRowClick?.(row);
						}}
						data-state={row.getIsSelected() && "selected"}
					>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell class={cellClasses}>
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
			</Table.Body>
		</Table.Root>
	</div>

	{#if enablePagination}
		{@render Pagination({ table })}
	{/if}
</div>
