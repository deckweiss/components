<script lang="ts" generics="TData">
	import type { Table as TableType } from "@tanstack/table-core";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Button } from "$lib/components/ui/button";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ChevronsLeftIcon from "@lucide/svelte/icons/chevrons-left";
	import ChevronsRightIcon from "@lucide/svelte/icons/chevrons-right";
	import CheckIcon from "@lucide/svelte/icons/check";

	let {
		table,
		includePageSizeSelector = false,
		buttonClass = "h-8 px-3 text-sm",
		align = "end",
	}: {
		table: TableType<TData>;
		includePageSizeSelector?: boolean;
		buttonClass?: string;
		align?: "start" | "end" | "center";
	} = $props();
</script>

<div class="flex items-center gap-1">
	<Button
		variant="outline"
		class="size-8 p-0"
		onclick={() => table.previousPage()}
		disabled={!table.getCanPreviousPage()}
	>
		<span class="sr-only">Go to previous page</span>
		<ChevronLeftIcon />
	</Button>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button variant="outline" class={buttonClass}>Seiten</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content {align}>
			<DropdownMenu.Item
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<ChevronsLeftIcon class="mr-2 size-4" />
				Erste Seite
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onclick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				<ChevronsRightIcon class="mr-2 size-4" />
				Letzte Seite
			</DropdownMenu.Item>
			{#if includePageSizeSelector}
				<DropdownMenu.Separator />
				<DropdownMenu.Label>Zeilen pro Seite</DropdownMenu.Label>
				{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
					{@const isSelected = table.getState().pagination.pageSize === pageSize}
					<DropdownMenu.Item onclick={() => table.setPageSize(pageSize)} inset={true}>
						<span
							class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
						>
							{#if isSelected}
								<CheckIcon class="size-4" />
							{:else}
								<CheckIcon class="size-4 text-transparent" />
							{/if}
						</span>
						{pageSize}
					</DropdownMenu.Item>
				{/each}
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Button
		variant="outline"
		class="size-8 p-0"
		onclick={() => table.nextPage()}
		disabled={!table.getCanNextPage()}
	>
		<span class="sr-only">Go to next page</span>
		<ChevronRightIcon />
	</Button>
</div>
