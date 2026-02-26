<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { getResources } from "$lib/resources";
	import { File } from "@lucide/svelte";

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
				href={`/resources/${resource.slug}`}
				class="group text-foreground hover:border-primary inline-flex items-center gap-2 border-b-2 border-transparent pb-1 transition-colors"
			>
				<span class="text-sm font-medium">{resource.name}</span>
			</a>
		{/each}
	</div>
</div>
