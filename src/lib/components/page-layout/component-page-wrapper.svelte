<script lang="ts">
	import { ComponentPageLayout } from "$lib/components/page-layout";
	import { PMCommand } from "$lib/components/ui/pm-command";
	import type { Snippet } from "svelte";

	interface Props {
		component: {
			title: string;
			description: string;
			slug: string;
			isWip?: boolean;
			isNew?: boolean;
			isUpdated?: boolean;
		};
		firstExample?: Snippet;
		remainingExamples?: Snippet;
	}

	let { component, firstExample, remainingExamples }: Props = $props();

	const installationUrl = `https://components.deckweiss.at/r/${component.slug}.json`;
</script>

<svelte:head>
	<title>{component.title} - Deckweiss Components</title>
</svelte:head>

<ComponentPageLayout
	backHref="/components"
	title={component.title}
	description={component.description}
	isWip={component.isWip}
	isUpdated={component.isUpdated}
	isNew={component.isNew}
	{firstExample}
	{remainingExamples}
>
	{#snippet installation()}
		<PMCommand command="execute" args={["shadcn-svelte@next", "add", installationUrl]} />
	{/snippet}
</ComponentPageLayout>
