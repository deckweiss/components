<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { components, getSourceIcon } from "$lib/registry";
	import { Sparkles, Boxes, Repeat } from "@lucide/svelte";
</script>

<svelte:head>
	<title>Components - Deckweiss</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-12">
	<!-- Header -->
	<div class="mb-12">
		<Badge variant="secondary" class="mb-4">
			<Boxes class="mr-1 size-3" />
			Components
		</Badge>
		<h1 class="text-foreground mb-4 text-4xl font-bold tracking-tight">Component Library</h1>
		<p class="text-muted-foreground max-w-2xl text-lg">
			Here you can find all the components available in the library.
		</p>
	</div>

	<!-- Components Grid (3 columns) -->
	<div class="grid gap-x-8 gap-y-6 md:grid-cols-3">
		{#each components as component}
			{@const isNew = component.isNew}
			{@const isSoon = component.isWip}
			{@const isUpdated = component.isUpdated}
			{#if component.isOutsourced}
				<a
					href={component.link}
					target="_blank"
					rel="noopener noreferrer"
					class={`group text-foreground hover:border-primary inline-flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors`}
				>
					<img
						src={getSourceIcon(component.source)}
						alt={component.source}
						class="size-4 flex-shrink-0 rounded"
					/>
					<span class="text-sm font-medium">{component.name}</span>
				</a>
			{:else}
				<a
					href={`/components/${component.slug}`}
					class={`group text-foreground hover:border-primary inline-flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors`}
				>
					<img
						src={getSourceIcon(component.source)}
						alt={component.source}
						class="size-4 flex-shrink-0 rounded"
					/>
					<span class="text-sm font-medium">{component.name}</span>
					{#if isNew}
						<span class="rounded-sm bg-emerald-500/10 p-1">
							<Sparkles class="size-2.5 text-emerald-500" />
						</span>
					{:else if isSoon}
						<span class="rounded-sm bg-gray-500/10 p-1 text-[7px] text-gray-500">WIP</span>
					{:else if isUpdated}
						<Repeat class="mr-0.5 size-3 text-blue-500" />
					{/if}
				</a>
			{/if}
		{/each}
	</div>
</div>
