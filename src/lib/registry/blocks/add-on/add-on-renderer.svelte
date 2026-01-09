<script lang="ts">
	import * as Resizable from "$lib/components/ui/resizable";
	import { PersistedState } from "runed";
	import { page } from "$app/state";
	import { closeAddOn } from "./routing";
	import type { Component, Snippet } from "svelte";
	import { innerWidth } from "svelte/reactivity/window";
	import { resolveComponent } from "./component-resolver";
	import type { AddOnComponentProps, AddOnType } from "./types";

	let { children }: { children: Snippet } = $props();

	let paneSize = new PersistedState("pane-size", 60);
	let searchParams = $derived(page.url.searchParams);
	let t = $derived(searchParams.get("t"));
	let tid = $derived(searchParams.get("tid"));
	let addOnParams = $derived(t && tid ? { t, tid } : null);
	let showAddOn = $derived(Boolean(addOnParams).valueOf());
	let minSize = $derived((500 / (innerWidth.current ?? 1920)) * 100); // 500px is the min size for the add-on
	let maxSize = $derived((900 / (innerWidth.current ?? 1920)) * 100); // 900px is the max size for the add-on
	let DynamicAddOnComponent: Component<AddOnComponentProps> | null = $state(null);
	let error = $state<Error | null>(null);

	function handleAddOnEdited() {
		window.dispatchEvent(new CustomEvent("addonedited", { detail: { t, tid } }));
	}

	$effect(() => {
		if (addOnParams?.t && addOnParams?.tid) {
			loadComponent();
		}
	});

	function loadComponent() {
		if (addOnParams?.t && addOnParams?.tid) {
			resolveComponent(addOnParams.t as AddOnType)
				.then((c) => {
					DynamicAddOnComponent = c;
				})
				.catch((e) => {
					console.error("Failed to load add-on component", e);
					DynamicAddOnComponent = null;
					error = e;
				});
		}
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === "Escape" && showAddOn) {
			showAddOn = false;
			closeAddOn();
		}
	}}
/>
<Resizable.PaneGroup direction="horizontal">
	<Resizable.Pane
		defaultSize={paneSize.current}
		onResize={(size) => {
			// NOTE: only store size if the add-on is shown
			if (showAddOn) {
				paneSize.current = size;
			}
		}}
	>
		<div class="scrollbar relative h-screen overflow-y-auto">
			<div class="container h-full py-6">
				{@render children()}
			</div>
		</div>
	</Resizable.Pane>

	{#if showAddOn}
		<Resizable.Handle withHandle />
		<Resizable.Pane {minSize} {maxSize}>
			<div class="relative z-0 flex h-full flex-col bg-white">
				{#if DynamicAddOnComponent && tid}
					<DynamicAddOnComponent id={tid} events={{ addonedited: handleAddOnEdited }} />
				{:else if error}
					<div class="p-4">
						<p class="text-sm text-red-500">{error.message}</p>
					</div>
				{/if}
			</div>
		</Resizable.Pane>
	{/if}
</Resizable.PaneGroup>

<style>
	.scrollbar {
		scrollbar-color: var(--color-grey-400) transparent;
	}
</style>
