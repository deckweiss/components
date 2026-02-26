<script lang="ts">
	import { ResourcePageLayout } from "./index";
	import type { Snippet } from "svelte";

	interface Props {
		resource: {
			title: string;
			description: string;
			slug: string;
		};
		children: Snippet;
	}

	let { resource, children }: Props = $props();
</script>

<svelte:head>
	<title>{resource.title} - Deckweiss Components</title>
</svelte:head>

<ResourcePageLayout backHref="/resources" title={resource.title} description={resource.description}>
	{#snippet children()}
		{@render children()}
	{/snippet}
</ResourcePageLayout>
