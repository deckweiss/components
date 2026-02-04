<script lang="ts" generics="TData">
	import type { Table } from "@tanstack/table-core";
	import { DataTableViewOptions } from ".";
	import DataTableFilterPopover from "./data-table-filter-popover.svelte";
	import DataTableSortPopover from "./data-table-sort-popover.svelte";
	import type { Snippet } from "svelte";

	let {
		table,
		customElementsFirst,
		customElementsLast,
		customElementsMiddle,
		getColumnIconSnippet,
		insertButton,
	}: {
		table: Table<TData>;
		customElementsFirst?: Snippet<[Table<TData>]>;
		customElementsLast?: Snippet<[Table<TData>]>;
		customElementsMiddle?: Snippet<[Table<TData>]>;
		getColumnIconSnippet?: (column: any) => Snippet<[{ column: any }]> | undefined;
		insertButton?: Snippet<[Table<TData>]>;
	} = $props();

	const filterableCols = $derived(
		table
			.getHeaderGroups()[0]
			.headers.filter((h) => h.column.columnDef.enableColumnFilter && h.column.getCanFilter())
			.map((h) => h.column)
	);

	const sortableCols = $derived(
		table
			.getHeaderGroups()[0]
			.headers.filter((h) => h.column.columnDef.enableSorting && h.column.getCanSort())
			.map((h) => h.column)
	);
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		{#if filterableCols.length > 0}
			<DataTableFilterPopover {table} {filterableCols} />
		{/if}

		{#if sortableCols.length > 0}
			<DataTableSortPopover {table} {sortableCols} />
		{/if}

		{#if customElementsMiddle}
			{@render customElementsMiddle?.(table)}
		{/if}
	</div>
	<div class="ml-2 flex flex-1 items-center justify-end gap-2">
		{@render customElementsLast?.(table)}

		{#if table
			.getAllColumns()
			.filter((col) => col.columnDef.enableHiding && col.getCanHide()).length > 0}
			<DataTableViewOptions {table} />
		{/if}

		{#if insertButton}
			{@render insertButton(table)}
		{/if}
	</div>
</div>
