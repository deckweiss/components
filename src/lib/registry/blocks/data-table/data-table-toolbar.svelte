<script lang="ts" generics="TData">
	import XIcon from "@lucide/svelte/icons/x";
	import type { Table } from "@tanstack/table-core";
	import { DataTableFacetedFilter, DataTableViewOptions } from ".";
	import { Button } from "$lib/components/ui/button";
	import type { Snippet } from "svelte";

	let {
		table,
		customElementsFirst,
		customElementsLast,
		customElementsMiddle,
		getColumnIconSnippet,
	}: {
		table: Table<TData>;
		customElementsFirst?: Snippet<[Table<TData>]>;
		customElementsLast?: Snippet<[Table<TData>]>;
		customElementsMiddle?: Snippet<[Table<TData>]>;
		getColumnIconSnippet?: (column: any) => Snippet<[{ column: any }]> | undefined;
	} = $props();

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
	const filterableCols = $derived(
		table
			.getHeaderGroups()[0]
			.headers.filter((h) => h.column.columnDef.enableColumnFilter && h.column.getCanFilter())
			.map((h) => h.column)
	);
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		{#each filterableCols as colFilter}
			<DataTableFacetedFilter
				column={colFilter}
				title={colFilter.columnDef.header ?? colFilter.id}
				options={Array.from(colFilter.getFacetedUniqueValues().keys()).map((v) => ({
					label: v,
					value: v,
				}))}
				iconSnippet={getColumnIconSnippet?.(colFilter)}
			/>
		{/each}

		{#if customElementsMiddle}
			{@render customElementsMiddle?.(table)}
		{/if}

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
				Alle zurücksetzen
				<XIcon />
			</Button>
		{/if}
	</div>
	<div class="ml-2 flex flex-1 items-center justify-end gap-2">
		{@render customElementsLast?.(table)}

		{#if table
			.getAllColumns()
			.filter((col) => col.columnDef.enableHiding && col.getCanHide()).length > 0}
			<DataTableViewOptions {table} />
		{/if}
	</div>
</div>
