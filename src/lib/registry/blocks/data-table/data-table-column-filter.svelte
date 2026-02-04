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
		column,
	}: {
		table: Table<TData>;
		column: Column<TData, unknown>;
	} = $props();

	// Draft filters that are edited locally before applying
	let draftFilters = $state<FilterRule[]>([]);
	let popoverOpen = $state(false);
	let valuePopoverOpen = $state<Record<string, boolean>>({});

	// Get available operators for this column
	const operators = $derived(getOperatorsForColumn(column, table));

	// Check if this column has any active filters
	const hasActiveFilter = $derived.by(() => {
		const columnFilters = table.getState().columnFilters;
		return columnFilters.some((f) => f.id === column.id);
	});

	// Count of filters for this column
	const filterCount = $derived.by(() => {
		const columnFilters = table.getState().columnFilters;
		return columnFilters.filter((f) => f.id === column.id).length;
	});

	// Check if draft filters differ from applied filters for this column
	const hasChanges = $derived.by(() => {
		const columnFilters = table.getState().columnFilters;
		const thisColumnFilters = columnFilters.filter((cf) => cf.id === column.id);

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
			if (f.operator === "~~*" && isDateColumn(column, table)) {
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
		if (validDraftFilters.length !== thisColumnFilters.length) {
			return true;
		}

		// If both are empty, no changes
		if (validDraftFilters.length === 0 && thisColumnFilters.length === 0) {
			return false;
		}

		// Convert applied filters to a comparable format
		const appliedFiltersNormalized = thisColumnFilters.map((cf) => {
			const filterValue = cf.value as
				| { operator: FilterOperator; value: string | string[] | null; value2?: string | null }
				| string[];
			if (Array.isArray(filterValue)) {
				return {
					operator: "in" as FilterOperator,
					value: filterValue,
				};
			}
			return filterValue;
		});

		// Compare each draft filter with applied filters
		for (const draftFilter of validDraftFilters) {
			const matchingApplied = appliedFiltersNormalized.find((af) => {
				if (af.operator !== draftFilter.operator) return false;

				// Operators that don't require values - just check operator match
				if (draftFilter.operator === "is_null" || draftFilter.operator === "is_not_null") {
					// No value comparison needed for these operators
					return true;
				}

				// Compare values
				if (Array.isArray(draftFilter.value) && Array.isArray(af.value)) {
					const draftSet = new Set(draftFilter.value);
					const appliedSet = new Set(af.value);
					if (draftSet.size !== appliedSet.size) return false;
					for (const val of draftSet) {
						if (!appliedSet.has(val)) return false;
					}
					return true;
				}
				if (draftFilter.value !== af.value) return false;

				// Compare value2 for between operator
				if (draftFilter.operator === "between" && draftFilter.value2 !== af.value2) {
					return false;
				}

				// Compare datePart and datePartValue for "enthält" on dates
				if (draftFilter.operator === "~~*" && isDateColumn(column, table)) {
					const appliedValue = af.value as string;
					if (typeof appliedValue === "string" && appliedValue.includes(":")) {
						const [appliedDatePart, appliedDatePartValue] = appliedValue.split(":");
						if (
							draftFilter.datePart !== appliedDatePart ||
							draftFilter.datePartValue !== appliedDatePartValue
						) {
							return false;
						}
					} else {
						return false; // Format mismatch
					}
				}

				return true;
			});

			if (!matchingApplied) return true;
		}

		// Also check if there are applied filters that don't match any draft filter
		for (const appliedFilter of appliedFiltersNormalized) {
			const matchingDraft = validDraftFilters.find((df) => {
				if (df.operator !== appliedFilter.operator) return false;

				// Operators that don't require values - just check operator match
				if (df.operator === "is_null" || df.operator === "is_not_null") {
					// No value comparison needed for these operators
					return true;
				}

				// Compare values
				if (Array.isArray(df.value) && Array.isArray(appliedFilter.value)) {
					const draftSet = new Set(df.value);
					const appliedSet = new Set(appliedFilter.value);
					if (draftSet.size !== appliedSet.size) return false;
					for (const val of draftSet) {
						if (!appliedSet.has(val)) return false;
					}
					return true;
				}
				if (df.value !== appliedFilter.value) return false;

				// Compare value2 for between operator
				if (df.operator === "between" && df.value2 !== appliedFilter.value2) {
					return false;
				}

				// Compare datePart and datePartValue for "enthält" on dates
				if (df.operator === "~~*" && isDateColumn(column, table)) {
					const appliedValue = appliedFilter.value as string;
					if (typeof appliedValue === "string" && appliedValue.includes(":")) {
						const [appliedDatePart, appliedDatePartValue] = appliedValue.split(":");
						if (df.datePart !== appliedDatePart || df.datePartValue !== appliedDatePartValue) {
							return false;
						}
					} else {
						return false; // Format mismatch
					}
				}

				return true;
			});

			if (!matchingDraft) return true;
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
		const thisColumnFilters = columnFilters.filter((cf) => cf.id === column.id);

		draftFilters = thisColumnFilters.map((cf) => {
			const filterValue = cf.value as
				| { operator: FilterOperator; value: string | string[] | null; value2?: string | null }
				| string[];
			const filterId = crypto.randomUUID();

			// Initialize popover state for this filter
			valuePopoverOpen[filterId] = false;

			// Handle contains operator on dates - parse the value format "day:15" or "month:3" or "year:2024"
			if (
				filterValue.operator === "~~*" &&
				typeof filterValue.value === "string" &&
				isDateColumn(column, table)
			) {
				const parts = filterValue.value.split(":");
				if (parts.length === 2) {
					const [datePart, datePartValue] = parts;
					if (datePart === "day" || datePart === "month" || datePart === "year") {
						return {
							id: filterId,
							operator: filterValue.operator,
							value: null,
							datePart: datePart as "day" | "month" | "year",
							datePartValue,
						};
					}
				}
			}

			return {
				id: filterId,
				operator: filterValue.operator,
				value: filterValue.value,
				value2: filterValue.value2,
			};
		});

		// If no filters exist, add an empty one
		if (draftFilters.length === 0) {
			addFilter();
		}
	}

	function addFilter() {
		const newFilterId = crypto.randomUUID();
		draftFilters = [
			...draftFilters,
			{
				id: newFilterId,
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
			if (f.operator === "~~*" && isDateColumn(column, table)) {
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

		// Get existing filters for other columns
		const existingFilters = table.getState().columnFilters.filter((cf) => cf.id !== column.id);

		// Convert our filters to TanStack Table format and add to existing
		const newFilters = validFilters.map((f) => {
			// For "enthält" on dates, store datePart and datePartValue in the value
			if (f.operator === "~~*" && isDateColumn(column, table) && f.datePart && f.datePartValue) {
				return {
					id: column.id,
					value: {
						operator: f.operator,
						value: `${f.datePart}:${f.datePartValue}`, // Format: "day:15" or "month:3" or "year:2024"
					},
				};
			}
			return {
				id: column.id,
				value: {
					operator: f.operator,
					value: f.value,
					...(f.operator === "between" && f.value2 !== undefined ? { value2: f.value2 } : {}),
				},
			};
		});

		table.setColumnFilters([...existingFilters, ...newFilters]);
		popoverOpen = false;
	}

	function handleValueKeydown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			applyFilters();
		}
	}

	function getColumnOptions() {
		const uniqueValues = column.getFacetedUniqueValues();
		return Array.from(uniqueValues.keys()).map((v) => ({
			label: String(v),
			value: String(v),
		}));
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

	const options = $derived(getColumnOptions());
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
			<button
				{...props}
				type="button"
				class={cn(
					"inline-flex size-6 items-center justify-center rounded hover:bg-[#00000010]",
					hasActiveFilter ? "text-primary" : "text-muted-foreground"
				)}
				onmousedown={(e) => e.stopPropagation()}
			>
				{#if hasActiveFilter}
					<FilterIcon class="size-3.5 fill-current" />
				{:else}
					<FilterIcon class="size-3.5" />
				{/if}
				<span class="sr-only">Spalte filtern</span>
			</button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto min-w-[320px] p-0" align="start">
		<div class="space-y-4 p-4">
			<div class="space-y-2">
				{#each draftFilters as filter (filter.id)}
					{@const operatorConfig = operators.find((op) => op.value === filter.operator)}
					<div class="flex items-center gap-2">
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
							<div class="text-muted-foreground flex h-8 flex-1 items-center text-sm">
								<!-- No input needed for these operators -->
							</div>
						{:else if filter.operator === "between"}
							<!-- von...bis - two date inputs for date columns, text inputs otherwise -->
							{@const isDate = isDateColumn(column, table)}
							<div class="flex flex-1 items-center gap-1">
								{#if isDate}
									<!-- Date picker for date columns -->
									<Popover.Root>
										<Popover.Trigger>
											{#snippet child({ props: innerProps })}
												<Button
													{...innerProps}
													variant="outline"
													size="sm"
													class="h-8 flex-1 justify-start font-normal"
												>
													{filter.value || "Von"}
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
									<span class="text-muted-foreground text-xs">bis</span>
									<Popover.Root>
										<Popover.Trigger>
											{#snippet child({ props: innerProps })}
												<Button
													{...innerProps}
													variant="outline"
													size="sm"
													class="h-8 flex-1 justify-start font-normal"
												>
													{filter.value2 || "Bis"}
												</Button>
											{/snippet}
										</Popover.Trigger>
										<Popover.Content class="w-auto p-3" align="start">
											<Input
												type="date"
												value={filter.value2 || ""}
												oninput={(e) => updateFilterValue2(filter.id, e.currentTarget.value)}
												class="h-8 w-full text-sm"
												autofocus
											/>
										</Popover.Content>
									</Popover.Root>
								{:else}
									<!-- Text inputs for non-date columns -->
									<Input
										type="text"
										placeholder="Von"
										value={filter.value || ""}
										oninput={(e) => updateFilterValue(filter.id, e.currentTarget.value)}
										onkeydown={handleValueKeydown}
										class="h-8 flex-1 text-sm"
									/>
									<span class="text-muted-foreground text-xs">bis</span>
									<Input
										type="text"
										placeholder="Bis"
										value={filter.value2 || ""}
										oninput={(e) => updateFilterValue2(filter.id, e.currentTarget.value)}
										onkeydown={handleValueKeydown}
										class="h-8 flex-1 text-sm"
									/>
								{/if}
							</div>
						{:else if filter.operator === "~~*" && isDateColumn(column, table)}
							<!-- enthält operator for dates - special UI with Tag/Monat/Jahr selection -->
							<div class="flex flex-1 items-center gap-1">
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
										<Select.Trigger class="h-8 flex-1" size="sm">
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
										class="h-8 flex-1 text-sm"
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
									{#snippet child({ props: innerProps })}
										<Button
											{...innerProps}
											variant="outline"
											size="sm"
											class="h-8 flex-1 justify-start font-normal"
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
						{:else if (filter.operator === "=" || filter.operator === "<>") && isDateColumn(column, table)}
							<!-- gleich and ungleich for date columns - use date picker -->
							<Popover.Root>
								<Popover.Trigger>
									{#snippet child({ props: innerProps })}
										<Button
											{...innerProps}
											variant="outline"
											size="sm"
											class="h-8 flex-1 justify-start font-normal"
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
							{#if isDateColumn(column, table)}
								<!-- Date picker for date columns -->
								<Popover.Root>
									<Popover.Trigger>
										{#snippet child({ props: innerProps })}
											<Button
												{...innerProps}
												variant="outline"
												size="sm"
												class="h-8 flex-1 justify-start font-normal"
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
									class="h-8 flex-1 text-sm"
								/>
							{/if}
						{:else}
							<!-- Single-select value using Command -->
							<Popover.Root
								open={valuePopoverOpen[filter.id] ?? false}
								onOpenChange={(open) => (valuePopoverOpen[filter.id] = open)}
							>
								<Popover.Trigger>
									{#snippet child({ props: innerProps })}
										<Button
											{...innerProps}
											variant="outline"
											size="sm"
											class="h-8 flex-1 justify-start font-normal"
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
							class="h-8 w-8 shrink-0 p-0"
							onclick={() => removeFilter(filter.id)}
						>
							<XIcon class="size-4" />
							<span class="sr-only">Filter entfernen</span>
						</Button>
					</div>
				{/each}
			</div>

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
						Filter löschen
					</Button>
				{:else}
					<div></div>
				{/if}
				<Button size="sm" class="h-8" onclick={applyFilters} disabled={!hasChanges}>
					Anwenden
				</Button>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
