<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { components, utils } from "$lib/registry";
	import { getLatestVersion } from "$lib/version-manager";
	import {
		Boxes,
		ArrowRight,
		Sparkles,
		Code2,
		Wrench,
		Zap,
		Palette,
		Github,
		Construction,
	} from "@lucide/svelte";
	import { goto } from "$app/navigation";
	import DeckweissLogo from "$lib/assets/deckweiss-logo.svg";
	import { Separator } from "$lib/components/ui/separator";

	const previewComponents = components.filter((c) => c.isWip);
	const previewUtils = utils.filter((u) => u.isWip);
	const totalPreview = previewComponents.length + previewUtils.length;
</script>

<svelte:head>
	<title>Deckweiss Components</title>
</svelte:head>

<div class="relative flex min-h-screen flex-col">
	<!-- Hero Section -->
	<main class="relative flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-12">
		<div class="flex flex-col items-center justify-center gap-1">
			<img src={DeckweissLogo} alt="Deckweiss" class="w-48 lg:w-76" />
			<h1
				class="mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text p-2 text-center text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl"
			>
				Components Registry
			</h1>
		</div>

		<!-- Subtext -->
		<p class="text-muted-foreground mb-10 max-w-2xl text-center text-lg sm:text-xl">
			A curated collection of beautifully crafted, production-ready components built with
			<span class="text-foreground font-medium">SvelteKit</span>
			and
			<span class="text-foreground font-medium">Tailwind CSS</span>. Powered by shadcn-svelte.
		</p>

		<!-- CTA Buttons -->
		<div class="flex flex-col gap-3 sm:flex-row">
			<Button
				size="lg"
				onclick={() => goto("/get-started")}
				class="group gap-2 px-8 hover:cursor-pointer">Get Started</Button
			>
			<Button
				size="lg"
				variant="outline"
				onclick={() => goto("/components")}
				class="gap-2 px-8 hover:cursor-pointer"
			>
				View Components
			</Button>
		</div>

		<!-- Stats -->
		<div class="mt-20 w-full max-w-3xl">
			<div class="grid gap-6 sm:grid-cols-3">
				<!-- Version Stat -->
				<button
					onclick={() => goto("/changelog")}
					class="group border-border/50 relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border bg-gradient-to-br from-orange-500/5 to-orange-500/0 p-6 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:shadow-lg"
				>
					<div
						class="mb-3 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10 text-orange-500 transition-transform group-hover:scale-110"
					>
						<Sparkles class="size-6" />
					</div>
					<span
						class="mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent"
					>
						v{getLatestVersion()}
					</span>
					<span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
						Latest Version
					</span>
				</button>

				<!-- Components Stat -->
				<button
					onclick={() => goto("/components")}
					class="group border-border/50 relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border bg-gradient-to-br from-orange-500/5 to-orange-500/0 p-6 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:shadow-lg"
				>
					<div
						class="mb-3 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10 text-orange-500 transition-transform group-hover:scale-110"
					>
						<Boxes class="size-6" />
					</div>
					<span
						class="mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent"
					>
						{components.filter((c) => !c.isOutsourced).length}
					</span>
					<span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
						Components
					</span>
				</button>

				<!-- Utils Stat -->
				<button
					onclick={() => goto("/utils")}
					class="group border-border/50 relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border bg-gradient-to-br from-orange-500/5 to-orange-500/0 p-6 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:shadow-lg"
				>
					<div
						class="mb-3 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10 text-orange-500 transition-transform group-hover:scale-110"
					>
						<Wrench class="size-6" />
					</div>
					<span
						class="mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent"
					>
						{utils.length}
					</span>
					<span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
						Utilities
					</span>
				</button>
			</div>
		</div>
	</main>

	<div class="px-18">
		<Separator />
	</div>

	<!-- Coming Soon Preview -->
	{#if totalPreview > 0}
		<section class="relative px-6 py-12">
			<div class="mx-auto max-w-5xl">
				<div class="mb-12 text-center">
					<Badge variant="outline" class="mb-4 gap-1.5">
						<Construction class="size-3" />
						Coming Soon
					</Badge>
					<h2 class="text-foreground mb-4 text-3xl font-bold tracking-tight">What's Next</h2>
					<p class="text-muted-foreground mx-auto max-w-2xl">
						We're constantly working on new components and utilities. Here's a preview of what's
						coming.
					</p>
				</div>

				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each previewComponents as component}
						<div
							class="group bg-muted/30 hover:bg-muted/50 relative overflow-hidden rounded-xl border border-dashed border-gray-300 p-6 transition-all hover:border-gray-500"
						>
							<div
								class="from-primary/5 group-hover:from-primary/10 absolute -top-4 -right-4 size-24 rounded-full bg-gradient-to-br to-transparent blur-2xl transition-all"
							></div>
							<Badge variant="outline" class="mb-3 bg-white text-[10px]"
								><Boxes class="mr-0.5 size-3" /> Component</Badge
							>
							<h3 class="text-foreground mb-1 font-semibold">{component.name}</h3>
							<p class="text-muted-foreground text-sm">{component.description}</p>
						</div>
					{/each}
					{#each previewUtils as util}
						<div
							class="group bg-muted/30 hover:bg-muted/50 relative overflow-hidden rounded-xl border border-dashed border-gray-300 p-6 transition-all hover:border-gray-500"
						>
							<div
								class="absolute -top-4 -right-4 size-24 rounded-full bg-gradient-to-br from-cyan-500/5 to-transparent blur-2xl transition-all group-hover:from-cyan-500/10"
							></div>
							<Badge variant="outline" class="mb-3 bg-white text-[10px]"
								><Wrench class="mr-0.5 size-3" /> Utility</Badge
							>
							<h3 class="text-foreground mb-1 font-semibold">{util.name}</h3>
							<p class="text-muted-foreground text-sm">{util.description}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- Footer CTA -->
	<section class="relative px-6 py-20">
		<div
			class="border-border/50 from-card to-card/50 mx-auto max-w-3xl rounded-3xl border bg-gradient-to-br p-12 text-center shadow-xl"
		>
			<h2 class="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
				Ready to build something amazing?
			</h2>
			<p class="text-muted-foreground mb-8">Build, contribute, innovate. Together.</p>
			<div class="flex flex-col justify-center gap-3 sm:flex-row">
				<Button size="lg" onclick={() => goto("/get-started")} class="gap-2 hover:cursor-pointer"
					>Get Started</Button
				>
				<a
					href="https://github.com/deckweiss"
					target="_blank"
					rel="noopener noreferrer"
					class="gap-2"
				>
					<Button size="lg" variant="outline" class="gap-2 hover:cursor-pointer">
						<Github class="size-4" />
						GitHub
					</Button>
				</a>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-border/40 border-t px-6 py-8">
		<div
			class="text-muted-foreground mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm sm:flex-row"
		>
			<a
				href="https://deckweiss.at"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:text-foreground transition-colors"
			>
				<img src={DeckweissLogo} alt="Deckweiss" class="w-32" /></a
			>
			<div class="flex items-center gap-6">
				<a href="/changelog" class="hover:text-foreground transition-colors">Changelog</a>
				<a href="/contributing" class="hover:text-foreground transition-colors">Contributing</a>
				<a
					href="https://github.com/deckweiss"
					class="hover:text-foreground transition-colors"
					target="_blank"
					rel="noopener noreferrer"
				>
					GitHub
				</a>
			</div>
		</div>
	</footer>
</div>
