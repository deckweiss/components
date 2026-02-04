<script lang="ts" generics="TData">
	import GripVerticalIcon from "@lucide/svelte/icons/grip-vertical";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import XIcon from "@lucide/svelte/icons/x";
	import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import type { Column, Table } from "@tanstack/table-core";
	import * as Popover from "$lib/components/ui/popover";
	import * as Select from "$lib/components/ui/select";
	import { Button } from "$lib/components/ui/button";
	import { Switch } from "$lib/components/ui/switch";
	import { cn } from "$lib/utils.js";
	import { getColumnHeaderValue } from "./utils.js";
	import { dndzone } from "svelte-dnd-action";
	import { tick } from "svelte";

	type SortRule = {
		id: string;
		columnId: string;
		desc: boolean;
	};

	let {
		table,
		sortableCols,
	}: {
		table: Table<TData>;
		sortableCols: Column<TData, unknown>[];
	} = $props();

	// Draft sort rules that are edited locally before applying
	let draftSortRules = $state<SortRule[]>([]);
	let popoverOpen = $state(false);

	// Count of applied sort rules
	const appliedSortCount = $derived(table.getState().sorting.length);

	// Check if draft sort rules differ from applied sorting
	const hasChanges = $derived.by(() => {
		const appliedSorting = table.getState().sorting;

		// If counts differ, there are changes
		if (draftSortRules.length !== appliedSorting.length) {
			return true;
		}

		// Compare order and values - order matters for sorting priority
		for (let i = 0; i < draftSortRules.length; i++) {
			const draftRule = draftSortRules[i];
			const appliedRule = appliedSorting[i];

			if (!appliedRule) return true;
			if (draftRule.columnId !== appliedRule.id) return true;
			if ((draftRule.desc ?? false) !== (appliedRule.desc ?? false)) return true;
		}

		return false;
	});

	// Initialize draft sort rules from table state when popover opens
	function syncFromTable() {
		const sorting = table.getState().sorting;
		draftSortRules = sorting.map((sort) => ({
			id: crypto.randomUUID(),
			columnId: sort.id,
			desc: sort.desc ?? false,
		}));
	}

	function addSortRule() {
		const firstCol = sortableCols[0];
		if (!firstCol) return;

		// Find a column that's not already in the sort rules
		const usedColumnIds = new Set(draftSortRules.map((r) => r.columnId));
		const availableCol = sortableCols.find((col) => !usedColumnIds.has(col.id)) || firstCol;

		draftSortRules = [
			...draftSortRules,
			{
				id: crypto.randomUUID(),
				columnId: availableCol.id,
				desc: false,
			},
		];
	}

	function removeSortRule(id: string) {
		draftSortRules = draftSortRules.filter((r) => r.id !== id);
	}

	function removeAllSortRules() {
		draftSortRules = [];
		applySorting();
	}

	async function applySorting() {
		// Convert to TanStack Table format
		const sorting = draftSortRules.map((rule) => ({
			id: rule.columnId,
			desc: rule.desc,
		}));

		table.setSorting(sorting);
		// Wait for state to update before closing popover
		await tick();
		popoverOpen = false;
	}

	function updateSortColumn(ruleId: string, columnId: string) {
		draftSortRules = draftSortRules.map((r) => (r.id === ruleId ? { ...r, columnId } : r));
	}

	function handleDndEvent(e: CustomEvent) {
		const { items } = e.detail;
		draftSortRules = items;
	}

	function getSortLabel(index: number): string {
		if (index === 0) return "Sortieren nach";
		return "dann nach";
	}
</script>

<Popover.Root
	bind:open={popoverOpen}
	onOpenChange={(open) => {
		if (open) {
			syncFromTable();
		}
	}}
>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				size="sm"
				class="h-8 border {appliedSortCount > 0
					? 'text-primary border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.07)]'
					: ''}"
			>
				{#if appliedSortCount > 0}
					<ArrowUpDownIcon class="size-4 fill-current" />
				{:else}
					<ChevronsUpDownIcon class="size-4" />
				{/if}
				<span class="hidden md:inline">
					{#if appliedSortCount > 0}
						Sortiert nach {appliedSortCount} {appliedSortCount === 1 ? "Regel" : "Regeln"}
					{:else}
						Sortieren
					{/if}
				</span>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto min-w-[400px] p-0" align="start">
		<div class="space-y-4 p-4">
			{#if draftSortRules.length === 0}
				<div class="space-y-1">
					<p class="text-sm font-medium">Keine Sortierung auf diese Ansicht angewendet</p>
					<p class="text-muted-foreground text-sm">
						Spalte unten hinzufügen, um die Ansicht zu sortieren
					</p>
				</div>
			{:else}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="dnd-sort-zone space-y-2 rounded-md p-2"
					use:dndzone={{
						items: draftSortRules,
						flipDurationMs: 150,
						dropTargetStyle: {},
					}}
					onconsider={handleDndEvent}
					onfinalize={handleDndEvent}
				>
					{#each draftSortRules as sortRule, index (sortRule.id)}
						{@const column = sortableCols.find((c) => c.id === sortRule.columnId)}
						{@const ascending = !sortRule.desc}
						{@const switchId = `sort-switch-${sortRule.id}`}
						<div class="flex items-center gap-2" data-id={sortRule.id}>
							<!-- Drag Handle -->
							<button
								type="button"
								class="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
								aria-label="Zum Neuordnen ziehen"
							>
								<GripVerticalIcon class="size-4" />
							</button>

							<!-- Bordered Content Container -->
							<div
								class="bg-background hover:bg-accent flex flex-1 items-center gap-2 rounded-md border p-2 transition-colors"
							>
								<!-- Sort Label -->
								<span class="text-muted-foreground min-w-[60px] text-sm">
									{getSortLabel(index)}
								</span>

								<!-- Column Select -->
								<Select.Root
									type="single"
									value={sortRule.columnId}
									onValueChange={(value) => updateSortColumn(sortRule.id, value)}
								>
									<Select.Trigger class="h-8 flex-1" size="sm">
										<code class="text-xs">
											{column ? getColumnHeaderValue(column, table) : "Spalte auswählen"}
										</code>
									</Select.Trigger>
									<Select.Content>
										{#each sortableCols as col (col.id)}
											{@const isUsed = draftSortRules.some(
												(r) => r.columnId === col.id && r.id !== sortRule.id
											)}
											<Select.Item value={col.id} disabled={isUsed}>
												{getColumnHeaderValue(col, table)}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>

								<!-- Ascending Toggle -->
								<div class="flex items-center gap-2">
									<label for={switchId} class="text-muted-foreground text-sm whitespace-nowrap">
										Aufsteigend:
									</label>
									<Switch
										id={switchId}
										checked={ascending}
										onCheckedChange={(checked) => {
											draftSortRules = draftSortRules.map((r) =>
												r.id === sortRule.id ? { ...r, desc: !checked } : r
											);
										}}
										aria-label={sortRule.desc ? "Auf aufsteigend setzen" : "Auf absteigend setzen"}
									/>
								</div>
							</div>

							<!-- Remove Button -->
							<Button
								variant="ghost"
								size="sm"
								class="h-8 w-8 p-0"
								onclick={() => removeSortRule(sortRule.id)}
							>
								<XIcon class="size-4" />
								<span class="sr-only">Sortierregel entfernen</span>
							</Button>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Add Sort Rule Button -->
			{#if draftSortRules.length < sortableCols.length}
				<Button variant="outline" size="sm" class="h-8 w-full border-dashed" onclick={addSortRule}>
					<PlusIcon class="mr-1 size-4" />
					Weitere Spalte zum Sortieren auswählen
				</Button>
			{/if}

			<!-- Actions -->
			<div class="flex items-center justify-between border-t pt-2">
				{#if draftSortRules.length > 0}
					<Button
						variant="ghost"
						size="sm"
						class="text-destructive hover:text-destructive h-8"
						onclick={removeAllSortRules}
					>
						Sortierung entfernen
					</Button>
				{:else}
					<div></div>
				{/if}
				<Button size="sm" class="h-8" onclick={applySorting} disabled={!hasChanges}>
					Sortierung anwenden
				</Button>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>

<style>
	:global([data-id].dnd-sortable-drag-over) {
		opacity: 0.5;
	}
</style>
