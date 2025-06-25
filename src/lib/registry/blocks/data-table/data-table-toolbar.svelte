<script lang="ts" generics="TData">
	import XIcon from "@lucide/svelte/icons/x";
	import type { Table } from "@tanstack/table-core";
	import { DataTableFacetedFilter, DataTableViewOptions } from ".";
	import { Button } from "$lib/components/ui/button";
	import type { Snippet } from "svelte";

	let { table, custom }: { table: Table<TData>; custom?: Snippet<[Table<TData>]> } = $props();

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
	const filterableCols = $derived(
		table
			.getHeaderGroups()[0]
			.headers.filter((h) => h.column.columnDef.enableColumnFilter && h.column.getCanFilter())
	);
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		{#each filterableCols as colFilter}
			<DataTableFacetedFilter
				column={colFilter.column}
				title={colFilter.column.columnDef.header ?? colFilter.id}
				context={colFilter.getContext()}
				options={Array.from(colFilter.column.getFacetedUniqueValues().keys()).map((v) => ({
					label: v,
					value: v,
				}))}
			/>
		{/each}

		{#if custom}
			{@render custom(table)}
		{/if}

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
				Alle zurücksetzen
				<XIcon />
			</Button>
		{/if}
	</div>

	{#if table
		.getAllColumns()
		.filter((col) => col.columnDef.enableHiding && col.getCanHide()).length > 0}
		<DataTableViewOptions {table} />
	{/if}
</div>
