<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { ArrowUp, ArrowDown, X } from "@lucide/svelte";
	import { closeAddOn, openAddOn } from "./routing";
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import type { Snippet } from "svelte";

	type Props = {
		pageTitle?: string;
		actions?: Snippet;
	};

	let { actions, pageTitle }: Props = $props();

	let searchParams = $derived(page.url.searchParams);
	let t = $derived(searchParams.get("t"));
	let tid = $derived(searchParams.get("tid"));
	let addOnParams = $derived(t && tid ? { t, tid } : null);

	const previousItemInTable = $derived.by(() => {
		if (browser && addOnParams.tid) {
			const currentId = addOnParams.tid;
			const previousItem = document
				.getElementById(`table-link-${currentId}`)
				?.closest("tr")
				?.previousElementSibling?.querySelector(".table-link") as HTMLButtonElement | null;
			return previousItem?.id.replace("table-link-", "");
		}
		return null;
	});

	const nextItemInTable = $derived.by(() => {
		if (browser && addOnParams.tid) {
			const currentId = addOnParams.tid;
			const nextItem = document
				.getElementById(`table-link-${currentId}`)
				?.closest("tr")
				?.nextElementSibling?.querySelector(".table-link") as HTMLButtonElement | null;
			return nextItem?.id.replace("table-link-", "");
		}
		return null;
	});

	async function navigateToAdjacentItem(id: string) {
		openAddOn(addOnParams.t, id);
	}
</script>

<div class="flex h-16 flex-shrink-0 items-center justify-start gap-3 border-b px-4">
	<div class="flex flex-row items-center gap-1">
		<Button
			class="h-[24px] w-[24px]"
			variant="outline"
			size="icon"
			onclick={() => {
				closeAddOn();
			}}
		>
			<X />
		</Button>
		<Button
			disabled={!previousItemInTable}
			size="icon"
			variant="outline"
			class="h-[24px] w-[24px]"
			onclick={() => navigateToAdjacentItem(previousItemInTable)}
		>
			<ArrowUp />
		</Button>
		<Button
			disabled={!nextItemInTable}
			size="icon"
			variant="outline"
			class="h-[24px] w-[24px]"
			onclick={() => navigateToAdjacentItem(nextItemInTable)}
		>
			<ArrowDown />
		</Button>
	</div>
	{#if pageTitle}
		<p class="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
			{pageTitle}
		</p>
	{/if}
	{#if actions}
		<div class="flex flex-grow flex-row items-center justify-end gap-2">
			{@render actions()}
		</div>
	{/if}
</div>
