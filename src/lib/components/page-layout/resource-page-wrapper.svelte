<script lang="ts">
	import { ResourcePageLayout } from "./index";
	import type { Snippet } from "svelte";

	interface Props {
		resource: {
			title: string;
			description: string;
			slug: string;
			isNew?: boolean;
			isUpdated?: boolean;
		};
		children: Snippet;
	}

	let { resource, children }: Props = $props();
</script>

<svelte:head>
	<title>{resource.title} - Deckweiss Components</title>
</svelte:head>

<ResourcePageLayout
	backHref="/resources"
	title={resource.title}
	description={resource.description}
	isNew={resource.isNew}
	isUpdated={resource.isUpdated}
>
	{#snippet children()}
		{@render children()}
	{/snippet}
</ResourcePageLayout>
