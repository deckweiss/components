<script lang="ts">
	import "../app.css";
	import { page } from "$app/state";
	import { Sidebar } from "$lib/components/sidebar";
	import { Menu, X } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import { setRegistryData } from "$lib/registry";

	let { data, children } = $props();

	// Initialize registry data from server load
	setRegistryData(data.registryData);

	// Check if we're on the home page (no sidebar)
	const isHomePage = $derived(page.url.pathname === "/");

	// Mobile sidebar state
	let mobileMenuOpen = $state(false);
</script>

{#if isHomePage}
	<!-- Home page has its own full-width layout -->
	{@render children()}
{:else}
	<!-- Pages with sidebar -->
	<div class="bg-background min-h-screen">
		<!-- Desktop Sidebar -->
		<div class="hidden lg:block">
			<Sidebar />
		</div>

		<!-- Mobile Header -->
		<header
			class="bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm lg:hidden"
		>
			<div class="flex h-14 items-center justify-between px-4">
				<a href="/" class="text-foreground text-sm font-semibold">Deckweiss Components Registry</a>
				<Button
					variant="ghost"
					size="icon"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<X class="size-5" />
					{:else}
						<Menu class="size-5" />
					{/if}
				</Button>
			</div>
		</header>

		<!-- Mobile Sidebar Overlay -->
		{#if mobileMenuOpen}
			<div class="fixed inset-0 z-40 lg:hidden">
				<!-- Backdrop -->
				<button
					class="absolute inset-0 bg-black/50"
					onclick={() => (mobileMenuOpen = false)}
					aria-label="Close menu"
				></button>
				<!-- Sidebar -->
				<div class="relative">
					<Sidebar class="shadow-xl" />
				</div>
			</div>
		{/if}

		<!-- Main Content -->
		<main class="pt-14 lg:ml-64 lg:pt-0">
			{@render children()}
		</main>
	</div>
{/if}
