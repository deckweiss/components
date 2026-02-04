<script lang="ts" generics="TData">
	import Settings2Icon from "@lucide/svelte/icons/settings-2";
	import XIcon from "@lucide/svelte/icons/x";
	import type { Table } from "@tanstack/table-core";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Popover from "$lib/components/ui/popover";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
	import { getColumnHeaderValue } from "./utils.js";
	import { cn } from "$lib/utils.js";

	let { table }: { table: Table<TData> } = $props();

	const hideableColumns = $derived(
		table.getAllColumns().filter((col) => col.columnDef.enableHiding && col.getCanHide())
	);

	// Visibility differs from defaults if any hideable column is currently hidden
	const hasVisibilityChanges = $derived.by(() => {
		return hideableColumns.some((col) => !col.getIsVisible());
	});
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				size="sm"
				class="h-8 border {hasVisibilityChanges
					? 'text-primary border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.07)]'
					: ''}"
			>
				<Settings2Icon class="size-4 {hasVisibilityChanges ? 'fill-current' : ''}" />
				<span class="hidden md:inline">Darstellung</span>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-56 p-0" align="end">
		<div class="relative p-4">
			<Popover.Close
				class={cn(
					buttonVariants({ variant: "ghost", size: "sm" }),
					"absolute top-2 right-2 size-6 p-0"
				)}
			>
				<XIcon class="size-4" />
			</Popover.Close>
			<div class="space-y-4">
				<div class="space-y-2">
					<h4 class="text-sm font-medium">Eingeblendete Spalten</h4>
					<div class="bg-border h-px" />
					<div class="mt-3 space-y-2">
						{#each table
							.getAllColumns()
							.filter((col) => col.columnDef.enableHiding && col.getCanHide()) as column (column)}
							<div class="flex items-center gap-2">
								<Checkbox
									checked={column.getIsVisible()}
									onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
								/>
								<label
									class="flex-1 cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									onclick={() => column.toggleVisibility(!column.getIsVisible())}
								>
									{getColumnHeaderValue(column, table)}
								</label>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
