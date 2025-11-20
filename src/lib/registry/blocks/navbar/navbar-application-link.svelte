<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";
	import { getContext, onDestroy, tick } from "svelte";
	import { NAVBAR_CONTEXT_KEY, type NavbarContext, type LinkInfo } from "./navbar-context.js";
	import { page } from "$app/state";

	interface Props {
		href?: string;
		onclick?: () => void;
		children: Snippet;
		class?: string;
	}

	let { href, onclick, class: className, children }: Props = $props();

	// Get navbar context
	const navbarContext = getContext<NavbarContext>(NAVBAR_CONTEXT_KEY);

	let registration: { id: symbol; linkInfo: LinkInfo; unregister: () => void } | undefined =
		$state(undefined);

	// Reactive visibility state - tracks the visible flag on linkInfo
	const isVisible = $derived.by(() => {
		return registration?.linkInfo.visible ?? false;
	});

	const isActive = $derived.by(() => {
		return page.url.pathname.startsWith(href ?? "");
	});

	function registerLink() {
		if (!navbarContext) return;

		// Unregister previous registration if exists
		registration?.unregister();

		// Register this link with the navbar
		registration = navbarContext.registerLink({
			label: children,
			href,
			onclick,
		});
	}

	// Register when element is bound or props change
	$effect(() => {
		if (navbarContext) {
			// Track href and onclick to re-register when they change
			href;
			onclick;
			tick().then(() => {
				registerLink();
			});
		}
	});

	onDestroy(() => {
		registration?.unregister();
	});
</script>

{#if isVisible}
	{#if href}
		<a
			{href}
			class={cn(
				"px-1 text-xs text-[13px] hover:text-[#000000] hover:underline",
				isActive ? "font-bold text-[#000000]" : "font-medium text-[#545353] hover:text-[#000000]",
				className
			)}
		>
			{@render children?.()}
		</a>
	{:else if onclick}
		<button
			type="button"
			{onclick}
			class={cn(
				"px-1 text-xs text-[13px] hover:text-[#000000] hover:underline",
				isActive ? "font-bold text-[#000000]" : "font-medium text-[#545353] hover:text-[#000000]",
				className
			)}
		>
			{@render children?.()}
		</button>
	{:else}
		<div
			class={cn(
				"px-1 text-xs text-[13px] hover:underline",
				isActive ? "font-bold text-[#000000]" : "font-medium text-[#545353] hover:text-[#000000]",
				className
			)}
		>
			{@render children?.()}
		</div>
	{/if}
{/if}
