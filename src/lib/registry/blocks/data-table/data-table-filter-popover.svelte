<script lang="ts" generics="TData">
	import FilterIcon from "@lucide/svelte/icons/filter";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import XIcon from "@lucide/svelte/icons/x";
	import CheckIcon from "@lucide/svelte/icons/check";
	import type { Column, Table } from "@tanstack/table-core";
	import * as Command from "$lib/components/ui/command";
	import * as Popover from "$lib/components/ui/popover";
	import * as Select from "$lib/components/ui/select";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { cn } from "$lib/utils.js";
	import { getColumnHeaderValue } from "./utils.js";
	import {
		type FilterOperator,
		type FilterRule,
		getOperatorsForColumn,
		isDateColumn,
		DATE_PARTS,
		MONTHS,
	} from "./filter-operators.js";

	let {
		table,
		filterableCols,
	}: {
		table: Table<TData>;
		filterableCols: Column<TData, unknown>[];
	} = $props();

	// Draft filters that are edited locally before applying
	let draftFilters = $state<FilterRule[]>([]);
	let popoverOpen = $state(false);
	let valuePopoverOpen = $state<Record<string, boolean>>({});

	// Count of applied filters
	const appliedFilterCount = $derived(table.getState().columnFilters.length);

	// Check if draft filters differ from applied filters
	const hasChanges = $derived.by(() => {
		const appliedFilters = table.getState().columnFilters;

		// Filter out incomplete rules from draft
		const validDraftFilters = draftFilters.filter((f) => {
			if (f.operator === "is_null" || f.operator === "is_not_null") {
				// These operators don't need a value
				return true;
			}
			if (f.operator === "in") {
				return Array.isArray(f.value) && f.value.length > 0;
			}
			if (f.operator === "between") {
				return f.value !== null && f.value !== "" && f.value2 !== null && f.value2 !== "";
			}
			if (f.operator === "~~*" && isDateFilter(f)) {
				// For "enthält" on dates, need datePart and datePartValue
				return (
					f.datePart !== null &&
					f.datePart !== undefined &&
					f.datePartValue !== null &&
					f.datePartValue !== ""
				);
			}
			return f.value !== null && f.value !== "";
		});

		// If counts differ, there are changes
		if (validDraftFilters.length !== appliedFilters.length) {
			return true;
		}

		// Compare each filter
		const appliedFiltersMap = new Map(
			appliedFilters.map((cf) => {
				const filterValue = cf.value as
					| { operator: FilterOperator; value: string | string[] | null; value2?: string | null }
					| string[];
				if (Array.isArray(filterValue)) {
					return [cf.id, { operator: "in" as FilterOperator, value: filterValue }];
				}
				return [cf.id, filterValue];
			})
		);

		for (const draftFilter of validDraftFilters) {
			const appliedFilter = appliedFiltersMap.get(draftFilter.columnId);
			if (!appliedFilter) return true;

			if (appliedFilter.operator !== draftFilter.operator) return true;

			// Operators that don't require values - just check operator match
			if (draftFilter.operator === "is_null" || draftFilter.operator === "is_not_null") {
				// No value comparison needed for these operators
				continue;
			}

			// Compare values
			if (Array.isArray(draftFilter.value) && Array.isArray(appliedFilter.value)) {
				const draftSet = new Set(draftFilter.value);
				const appliedSet = new Set(appliedFilter.value);
				if (draftSet.size !== appliedSet.size) return true;
				for (const val of draftSet) {
					if (!appliedSet.has(val)) return true;
				}
			} else if (draftFilter.value !== appliedFilter.value) {
				return true;
			}

			// Compare value2 for between operator
			if (draftFilter.operator === "between" && draftFilter.value2 !== appliedFilter.value2) {
				return true;
			}

			// Compare datePart and datePartValue for "enthält" on dates
			if (draftFilter.operator === "~~*" && isDateFilter(draftFilter)) {
				const appliedValue = appliedFilter.value as string;
				if (typeof appliedValue === "string" && appliedValue.includes(":")) {
					const [appliedDatePart, appliedDatePartValue] = appliedValue.split(":");
					if (
						draftFilter.datePart !== appliedDatePart ||
						draftFilter.datePartValue !== appliedDatePartValue
					) {
						return true;
					}
				} else {
					return true; // Format mismatch
				}
			}
		}

		return false;
	});

	// Ensure popover state exists for all filters
	$effect(() => {
		for (const filter of draftFilters) {
			if (!(filter.id in valuePopoverOpen)) {
				valuePopoverOpen[filter.id] = false;
			}
		}
	});

	// Initialize draft filters from table state when popover opens
	function syncFromTable() {
		const columnFilters = table.getState().columnFilters;
		draftFilters = columnFilters.map((cf) => {
			const filterValue = cf.value as
				| { operator: FilterOperator; value: string | string[] | null; value2?: string | null }
				| string[];
			const filterId = crypto.randomUUID();

			// Initialize popover state for this filter
			valuePopoverOpen[filterId] = false;

			// Handle contains operator on dates - parse the value format "day:15" or "month:3" or "year:2024"
			if (filterValue.operator === "~~*" && typeof filterValue.value === "string") {
				const column = filterableCols.find((c) => c.id === cf.id);
				if (column && isDateColumn(column, table)) {
					const parts = filterValue.value.split(":");
					if (parts.length === 2) {
						const [datePart, datePartValue] = parts;
						if (datePart === "day" || datePart === "month" || datePart === "year") {
							return {
								id: filterId,
								columnId: cf.id,
								operator: filterValue.operator,
								value: null,
								datePart: datePart as "day" | "month" | "year",
								datePartValue,
							};
						}
					}
				}
			}

			return {
				id: filterId,
				columnId: cf.id,
				operator: filterValue.operator,
				value: filterValue.value,
				value2: filterValue.value2,
			};
		});
	}

	function addFilter() {
		const firstCol = filterableCols[0];
		if (!firstCol) return;

		const newFilterId = crypto.randomUUID();
		draftFilters = [
			...draftFilters,
			{
				id: newFilterId,
				columnId: firstCol.id,
				operator: "=",
				value: null,
			},
		];
		// Initialize the popover state for the new filter
		valuePopoverOpen[newFilterId] = false;
	}

	function removeFilter(id: string) {
		draftFilters = draftFilters.filter((f) => f.id !== id);
		// Clean up popover state
		delete valuePopoverOpen[id];
	}

	function removeAllFilters() {
		draftFilters = [];
		applyFilters();
	}

	function applyFilters() {
		// Filter out incomplete rules
		const validFilters = draftFilters.filter((f) => {
			if (f.operator === "is_null" || f.operator === "is_not_null") {
				// These operators don't need a value
				return true;
			}
			if (f.operator === "in") {
				return Array.isArray(f.value) && f.value.length > 0;
			}
			if (f.operator === "between") {
				return f.value !== null && f.value !== "" && f.value2 !== null && f.value2 !== "";
			}
			if (f.operator === "~~*" && isDateFilter(f)) {
				// For "enthält" on dates, need datePart and datePartValue
				return (
					f.datePart !== null &&
					f.datePart !== undefined &&
					f.datePartValue !== null &&
					f.datePartValue !== ""
				);
			}
			return f.value !== null && f.value !== "";
		});

		// Convert to TanStack Table format
		const columnFilters = validFilters.map((f) => {
			// For "enthält" on dates, store datePart and datePartValue in the value
			if (f.operator === "~~*" && isDateFilter(f) && f.datePart && f.datePartValue) {
				return {
					id: f.columnId,
					value: {
						operator: f.operator,
						value: `${f.datePart}:${f.datePartValue}`, // Format: "day:15" or "month:3" or "year:2024"
					},
				};
			}
			return {
				id: f.columnId,
				value: {
					operator: f.operator,
					value: f.value,
					...(f.operator === "between" && f.value2 !== undefined ? { value2: f.value2 } : {}),
				},
			};
		});

		table.setColumnFilters(columnFilters);
		popoverOpen = false;
	}

	function handleValueKeydown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			applyFilters();
		}
	}

	function getColumnOptions(columnId: string) {
		const column = filterableCols.find((c) => c.id === columnId);
		if (!column) return [];

		const uniqueValues = column.getFacetedUniqueValues();
		return Array.from(uniqueValues.keys()).map((v) => ({
			label: String(v),
			value: String(v),
		}));
	}

	function updateFilterColumn(filterId: string, columnId: string) {
		draftFilters = draftFilters.map((f) =>
			f.id === filterId
				? { ...f, columnId, value: null, value2: null, datePart: null, datePartValue: null }
				: f
		);
	}

	function updateFilterOperator(filterId: string, operator: FilterOperator) {
		draftFilters = draftFilters.map((f) => {
			if (f.id !== filterId) return f;
			// Reset value when changing operator type
			let newValue: string | string[] | null = null;
			let newValue2: string | null = null;
			let datePart: "day" | "month" | "year" | null = null;
			let datePartValue: string | null = null;
			if (operator === "in") {
				newValue = [];
			}
			return { ...f, operator, value: newValue, value2: newValue2, datePart, datePartValue };
		});
	}

	function updateFilterValue(filterId: string, value: string | string[] | null) {
		draftFilters = draftFilters.map((f) => (f.id === filterId ? { ...f, value } : f));
	}

	function updateFilterValue2(filterId: string, value2: string | null) {
		draftFilters = draftFilters.map((f) => (f.id === filterId ? { ...f, value2 } : f));
	}

	function updateDatePart(filterId: string, datePart: "day" | "month" | "year" | null) {
		draftFilters = draftFilters.map((f) =>
			f.id === filterId ? { ...f, datePart, datePartValue: null } : f
		);
	}

	function updateDatePartValue(filterId: string, datePartValue: string | null) {
		draftFilters = draftFilters.map((f) => (f.id === filterId ? { ...f, datePartValue } : f));
	}

	function isDateFilter(filter: FilterRule): boolean {
		const column = filterableCols.find((c) => c.id === filter.columnId);
		return column ? isDateColumn(column, table) : false;
	}

	function toggleInValue(filterId: string, optionValue: string) {
		const filter = draftFilters.find((f) => f.id === filterId);
		if (!filter) return;

		const currentValues = Array.isArray(filter.value) ? filter.value : [];
		const newValues = currentValues.includes(optionValue)
			? currentValues.filter((v) => v !== optionValue)
			: [...currentValues, optionValue];

		updateFilterValue(filterId, newValues);
	}

	function getDisplayValue(filter: FilterRule): string {
		if (filter.value === null) return "";
		if (Array.isArray(filter.value)) {
			if (filter.value.length === 0) return "";
			if (filter.value.length === 1) return filter.value[0];
			return `${filter.value.length} ausgewählt`;
		}
		return String(filter.value);
	}

	function getOperatorsForFilter(filter: FilterRule) {
		const column = filterableCols.find((c) => c.id === filter.columnId);
		if (!column) return [];
		return getOperatorsForColumn(column, table);
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
				class="h-8 border {appliedFilterCount > 0
					? 'text-primary border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.07)]'
					: ''}"
			>
				<FilterIcon class="size-4 {appliedFilterCount > 0 ? 'fill-current' : ''}" />
				<span class="hidden md:inline">
					{#if appliedFilterCount > 0}
						Gefiltert nach {appliedFilterCount} {appliedFilterCount === 1 ? "Regel" : "Regeln"}
					{:else}
						Filtern
					{/if}
				</span>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto min-w-[400px] p-0" align="start">
		<div class="space-y-4 p-4">
			{#if draftFilters.length === 0}
				<div class="space-y-1">
					<p class="text-sm font-medium">Keine Filter auf diese Ansicht angewendet</p>
					<p class="text-muted-foreground text-sm">
						Spalte unten hinzufügen, um die Ansicht zu filtern
					</p>
				</div>
			{:else}
				<div class="space-y-2">
					{#each draftFilters as filter (filter.id)}
						{@const column = filterableCols.find((c) => c.id === filter.columnId)}
						{@const options = getColumnOptions(filter.columnId)}
						{@const operators = getOperatorsForFilter(filter)}
						{@const operatorConfig = operators.find((op) => op.value === filter.operator)}
						<div class="flex items-center gap-2">
							<!-- Column Select -->
							<Select.Root
								type="single"
								value={filter.columnId}
								onValueChange={(value) => updateFilterColumn(filter.id, value)}
							>
								<Select.Trigger class="h-8 w-[140px]" size="sm">
									{column ? getColumnHeaderValue(column, table) : "Spalte auswählen"}
								</Select.Trigger>
								<Select.Content>
									{#each filterableCols as col (col.id)}
										<Select.Item value={col.id}>
											{getColumnHeaderValue(col, table)}
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>

							<!-- Operator Select -->
							<Select.Root
								type="single"
								value={filter.operator}
								onValueChange={(value) => updateFilterOperator(filter.id, value as FilterOperator)}
							>
								<Select.Trigger class="h-8 w-[140px]" size="sm">
									{operatorConfig?.label || filter.operator}
								</Select.Trigger>
								<Select.Content>
									{#each operators as op (op.value)}
										<Select.Item value={op.value}>
											{op.label}
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>

							<!-- Value Input -->
							{#if filter.operator === "is_null" || filter.operator === "is_not_null"}
								<!-- Null check operators - no value input needed -->
								<div class="text-muted-foreground flex h-8 w-[140px] items-center text-sm">
									<!-- No input needed for these operators -->
								</div>
							{:else if filter.operator === "between"}
								<!-- von...bis - two date inputs for date columns, text inputs otherwise -->
								{@const isDate = isDateFilter(filter)}
								<div class="flex items-center gap-1">
									{#if isDate}
										<Input
											type="date"
											value={filter.value || ""}
											oninput={(e) => updateFilterValue(filter.id, e.currentTarget.value)}
											class="h-8 w-full max-w-xs text-sm"
										/>
										<span class="text-muted-foreground text-xs">bis</span>
										<Input
											type="date"
											value={filter.value2 || ""}
											oninput={(e) => updateFilterValue2(filter.id, e.currentTarget.value)}
											class="h-8 w-full max-w-xs text-sm"
										/>
									{:else}
										<!-- Text inputs for non-date columns -->
										<Input
											type="text"
											placeholder="Von"
											value={filter.value || ""}
											oninput={(e) => updateFilterValue(filter.id, e.currentTarget.value)}
											onkeydown={handleValueKeydown}
											class="h-8 w-[100px] text-sm"
										/>
										<span class="text-muted-foreground text-xs">bis</span>
										<Input
											type="text"
											placeholder="Bis"
											value={filter.value2 || ""}
											oninput={(e) => updateFilterValue2(filter.id, e.currentTarget.value)}
											onkeydown={handleValueKeydown}
											class="h-8 w-[100px] text-sm"
										/>
									{/if}
								</div>
							{:else if filter.operator === "~~*" && isDateFilter(filter)}
								<!-- enthält operator for dates - special UI with Tag/Monat/Jahr selection -->
								<div class="flex items-center gap-1">
									<Select.Root
										type="single"
										value={filter.datePart || null}
										onValueChange={(value) =>
											updateDatePart(filter.id, value as "day" | "month" | "year" | null)}
									>
										<Select.Trigger class="h-8 w-[100px]" size="sm">
											{filter.datePart
												? DATE_PARTS.find((p) => p.value === filter.datePart)?.label ||
													filter.datePart
												: "Wählen"}
										</Select.Trigger>
										<Select.Content>
											{#each DATE_PARTS as part (part.value)}
												<Select.Item value={part.value}>
													{part.label}
												</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
									{#if filter.datePart === "month"}
										<!-- Month dropdown -->
										<Select.Root
											type="single"
											value={filter.datePartValue || null}
											onValueChange={(value) => updateDatePartValue(filter.id, value)}
										>
											<Select.Trigger class="h-8 w-[120px]" size="sm">
												{filter.datePartValue
													? MONTHS.find((m) => m.value === filter.datePartValue)?.label ||
														filter.datePartValue
													: "Wählen"}
											</Select.Trigger>
											<Select.Content>
												{#each MONTHS as month (month.value)}
													<Select.Item value={month.value}>
														{month.label}
													</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>
									{:else if filter.datePart === "day" || filter.datePart === "year"}
										<!-- Day or Year number input -->
										<Input
											type="number"
											placeholder={filter.datePart === "day" ? "Tag (1-31)" : "Jahr"}
											value={filter.datePartValue || ""}
											oninput={(e) => updateDatePartValue(filter.id, e.currentTarget.value)}
											onkeydown={handleValueKeydown}
											class="h-8 w-[100px] text-sm"
											min={filter.datePart === "day" ? "1" : undefined}
											max={filter.datePart === "day" ? "31" : undefined}
										/>
									{/if}
								</div>
							{:else if filter.operator === "in"}
								<!-- Multi-select value using Command -->
								<Popover.Root
									open={valuePopoverOpen[filter.id] ?? false}
									onOpenChange={(open) => (valuePopoverOpen[filter.id] = open)}
								>
									<Popover.Trigger>
										{#snippet child({ props })}
											<Button
												{...props}
												variant="outline"
												size="sm"
												class="h-8 w-[140px] justify-start font-normal"
											>
												{#if Array.isArray(filter.value) && filter.value.length > 0}
													{getDisplayValue(filter)}
												{:else}
													<span class="text-muted-foreground">Werte auswählen</span>
												{/if}
											</Button>
										{/snippet}
									</Popover.Trigger>
									<Popover.Content class="w-[200px] p-0" align="start">
										<Command.Root>
											<Command.Input placeholder="Suchen..." onkeydown={handleValueKeydown} />
											<Command.List>
												<Command.Empty>Keine Ergebnisse</Command.Empty>
												<Command.Group>
													{#each options as option (option.value)}
														{@const isSelected =
															Array.isArray(filter.value) && filter.value.includes(option.value)}
														<Command.Item onSelect={() => toggleInValue(filter.id, option.value)}>
															<div
																class={cn(
																	"border-primary mr-2 flex size-4 items-center justify-center rounded-sm border",
																	isSelected
																		? "bg-primary text-primary-foreground"
																		: "opacity-50 [&_svg]:invisible"
																)}
															>
																<CheckIcon class="size-3 text-white" />
															</div>
															<span>{option.label}</span>
														</Command.Item>
													{/each}
												</Command.Group>
											</Command.List>
										</Command.Root>
									</Popover.Content>
								</Popover.Root>
							{:else if (filter.operator === "=" || filter.operator === "<>") && isDateFilter(filter)}
								<!-- gleich and ungleich for date columns - use date picker -->
								<Popover.Root>
									<Popover.Trigger>
										{#snippet child({ props })}
											<Button
												{...props}
												variant="outline"
												size="sm"
												class="h-8 w-[140px] justify-start font-normal"
											>
												{filter.value || "Datum auswählen"}
											</Button>
										{/snippet}
									</Popover.Trigger>
									<Popover.Content class="w-auto p-3" align="start">
										<Input
											type="date"
											value={filter.value || ""}
											oninput={(e) => updateFilterValue(filter.id, e.currentTarget.value)}
											class="h-8 w-full text-sm"
											autofocus
										/>
									</Popover.Content>
								</Popover.Root>
							{:else if operatorConfig?.isFreitext}
								<!-- Free text input or date input for date columns -->
								{@const isDate = isDateFilter(filter)}
								{#if isDate}
									<!-- Date picker for date columns -->
									<Popover.Root>
										<Popover.Trigger>
											{#snippet child({ props })}
												<Button
													{...props}
													variant="outline"
													size="sm"
													class="h-8 w-[140px] justify-start font-normal"
												>
													{filter.value || "Datum auswählen"}
												</Button>
											{/snippet}
										</Popover.Trigger>
										<Popover.Content class="w-auto p-3" align="start">
											<Input
												type="date"
												value={filter.value || ""}
												oninput={(e) => updateFilterValue(filter.id, e.currentTarget.value)}
												class="h-8 w-full text-sm"
												autofocus
											/>
										</Popover.Content>
									</Popover.Root>
								{:else}
									<!-- Text input for non-date columns -->
									<Input
										type="text"
										placeholder="Wert eingeben"
										value={filter.value || ""}
										oninput={(e) => updateFilterValue(filter.id, e.currentTarget.value)}
										onkeydown={handleValueKeydown}
										class="h-8 w-[140px] text-sm"
									/>
								{/if}
							{:else}
								<!-- Single-select value using Command -->
								<Popover.Root
									open={valuePopoverOpen[filter.id] ?? false}
									onOpenChange={(open) => (valuePopoverOpen[filter.id] = open)}
								>
									<Popover.Trigger>
										{#snippet child({ props })}
											<Button
												{...props}
												variant="outline"
												size="sm"
												class="h-8 w-[140px] justify-start font-normal"
											>
												{#if filter.value}
													{filter.value}
												{:else}
													<span class="text-muted-foreground">Wert eingeben</span>
												{/if}
											</Button>
										{/snippet}
									</Popover.Trigger>
									<Popover.Content class="w-[200px] p-0" align="start">
										<Command.Root>
											<Command.Input placeholder="Suchen..." onkeydown={handleValueKeydown} />
											<Command.List>
												<Command.Empty>Keine Ergebnisse</Command.Empty>
												<Command.Group>
													{#each options as option (option.value)}
														{@const isSelected = filter.value === option.value}
														<Command.Item
															onSelect={() => {
																updateFilterValue(filter.id, option.value);
																valuePopoverOpen[filter.id] = false;
															}}
														>
															<div
																class={cn(
																	"mr-2 flex size-4 items-center justify-center",
																	isSelected ? "opacity-100" : "opacity-0"
																)}
															>
																<CheckIcon class="size-4" />
															</div>
															<span>{option.label}</span>
														</Command.Item>
													{/each}
												</Command.Group>
											</Command.List>
										</Command.Root>
									</Popover.Content>
								</Popover.Root>
							{/if}

							<!-- Remove Button -->
							<Button
								variant="ghost"
								size="sm"
								class="h-8 w-8 p-0"
								onclick={() => removeFilter(filter.id)}
							>
								<XIcon class="size-4" />
								<span class="sr-only">Filter entfernen</span>
							</Button>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Add Filter Button -->
			<Button variant="outline" size="sm" class="h-8 w-full border-dashed" onclick={addFilter}>
				<PlusIcon class="mr-1 size-4" />
				Filter hinzufügen
			</Button>

			<!-- Actions -->
			<div class="flex items-center justify-between border-t pt-2">
				{#if draftFilters.length > 0}
					<Button
						variant="ghost"
						size="sm"
						class="text-destructive hover:text-destructive h-8"
						onclick={removeAllFilters}
					>
						Filter entfernen
					</Button>
				{:else}
					<div></div>
				{/if}
				<Button size="sm" class="h-8" onclick={applyFilters} disabled={!hasChanges}>
					Filter anwenden
				</Button>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
