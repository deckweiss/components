<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { getResources } from "$lib/resources";
	import { File, Repeat, Sparkles, SquareArrowOutUpRight } from "@lucide/svelte";

	const resources = getResources();
</script>

<svelte:head>
	<title>Resources - Deckweiss Components</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-6 py-12">
	<!-- Header -->
	<div class="mb-12">
		<Badge variant="secondary" class="mb-4">
			<File class="mr-1 size-3" />
			Resources
		</Badge>
		<h1 class="text-foreground mb-4 text-4xl font-bold tracking-tight">Resource Library</h1>
		<p class="text-muted-foreground max-w-2xl text-lg">
			Copy-paste code snippets and reference content for your project.
		</p>
	</div>

	<!-- Resources Grid (3 columns) -->
	<div class="grid gap-x-8 gap-y-6 md:grid-cols-3">
		{#each resources as resource}
			<a
				href={resource.link ?? `/resources/${resource.slug}`}
				target={resource.link ? "_blank" : undefined}
				rel={resource.link ? "noopener noreferrer" : undefined}
				class="group text-foreground hover:border-primary inline-flex items-center justify-between gap-2 border-b-2 border-transparent pb-1 transition-colors"
			>
				<span class="text-sm font-medium">{resource.name}</span>
				<span class="flex shrink-0 items-center gap-1">
					{#if resource.isNew}
						<span class="rounded-sm bg-emerald-500/10 p-1">
							<Sparkles class="size-2.5 text-emerald-500" />
						</span>
					{/if}
					{#if resource.isUpdated}
						<Repeat class="size-3 text-blue-500" />
					{/if}
					{#if resource.link}
						<SquareArrowOutUpRight class="size-3 opacity-40" />
					{/if}
				</span>
			</a>
		{/each}
	</div>
</div>
