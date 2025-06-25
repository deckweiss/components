<script lang="ts" generics="TData">
	import Settings2Icon from "@lucide/svelte/icons/settings-2";
	import type { Table } from "@tanstack/table-core";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import FlexRender from "$lib/components/ui/data-table/flex-render.svelte";

	let { table }: { table: Table<TData> } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({
			variant: "outline",
			size: "sm",
			class: "ml-auto hidden h-8 lg:flex",
		})}
	>
		<Settings2Icon />
		Darstellung
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Eingeblendete Spalten</DropdownMenu.Label>
			<DropdownMenu.Separator />
			{#each table
				.getAllColumns()
				.filter((col) => col.columnDef.enableHiding && col.getCanHide()) as column (column.id)}
				<DropdownMenu.CheckboxItem
					bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
					class="capitalize"
				>
					<FlexRender content={column.columnDef.header ?? column.id} />
				</DropdownMenu.CheckboxItem>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
