<script lang="ts">
	import AddOnHeader from "$lib/registry/blocks/add-on/add-on-header.svelte";
	import type { AddOnComponentProps } from "$lib/registry/blocks/add-on/types";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Button } from "./ui/button";
	import { MoreVertical } from "@lucide/svelte";

	let { id, events }: AddOnComponentProps = $props();
</script>

<AddOnHeader pageTitle={`Example Add On - ID: ${id}`} />

<div class="bg-layer-layer1 border-b px-5 py-3">
	<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
		<div class="flex min-w-0 flex-1 flex-col gap-[2px]">
			<h3 class="text-[11px] font-medium tracking-widest text-gray-400 uppercase">Mitarbeiter</h3>

			<div class="flex flex-col gap-1">
				<div class="flex items-center gap-2">
					<h2 class="text-xl font-semibold break-words text-gray-900">Max Mustermann</h2>
				</div>
			</div>
		</div>

		<div class="flex flex-col items-end gap-2">
			<div class="flex items-start gap-2">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class="flex-shrink-0">
						<Button variant="ghost" size="icon" type="button" aria-label="Aktionen">
							<MoreVertical size={16} />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item>Löschen</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</div>

<!-- TABS START -->
<Tabs.Root>
	<Tabs.List class="w-full border-b">
		<Tabs.Trigger value="details">Details</Tabs.Trigger>
		<Tabs.Trigger value="addresses">Adressen</Tabs.Trigger>
		<Tabs.Trigger value="employment">Anstellung</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="details">
		<div>
			<h1>Details</h1>
		</div>
	</Tabs.Content>
	<Tabs.Content value="addresses">
		<div>
			<h1>Adressen</h1>
		</div>
	</Tabs.Content>
	<Tabs.Content value="employment">
		<div>
			<h1>Anstellung</h1>
		</div>
	</Tabs.Content>
</Tabs.Root>
