<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { utils } from "$lib/registry";
	import { Wrench, Sparkles, Repeat } from "@lucide/svelte";
</script>

<svelte:head>
	<title>Utils - Deckweiss Components</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-12">
	<!-- Header -->
	<div class="mb-12">
		<Badge variant="secondary" class="mb-4">
			<Wrench class="mr-1 size-3" />
			Utilities
		</Badge>
		<h1 class="text-foreground mb-4 text-4xl font-bold tracking-tight">Utility Library</h1>
		<p class="text-muted-foreground max-w-2xl text-lg">
			A collection of utilities to enhance your SvelteKit applications.
		</p>
	</div>

	<!-- Utils Grid (3 columns) -->
	<div class="grid gap-x-8 gap-y-6 md:grid-cols-3">
		{#each utils as util}
			{@const isNew = util.isNew}
			{@const isSoon = util.isWip}
			{@const isUpdated = util.isUpdated}
			<a
				href={`/utils/${util.slug}`}
				class={`group text-foreground hover:border-primary inline-flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors`}
			>
				<span class="text-sm font-medium">{util.name}</span>
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
		{/each}
	</div>
</div>
