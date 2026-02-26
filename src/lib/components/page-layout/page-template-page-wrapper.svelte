<script lang="ts">
	import { ComponentPageLayout } from "$lib/components/page-layout";
	import { PMCommand } from "$lib/components/ui/pm-command";
	import type { Snippet } from "svelte";

	interface Props {
		pageTemplate: {
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

	let { pageTemplate, firstExample, remainingExamples }: Props = $props();

	const installationUrl = `https://components.deckweiss.at/r/${pageTemplate.slug}.json`;
</script>

<svelte:head>
	<title>{pageTemplate.title} - Deckweiss Components</title>
</svelte:head>

<ComponentPageLayout
	backHref="/page-templates"
	title={pageTemplate.title}
	description={pageTemplate.description}
	isWip={pageTemplate.isWip}
	isUpdated={pageTemplate.isUpdated}
	isNew={pageTemplate.isNew}
	{firstExample}
	{remainingExamples}
>
	{#snippet installation()}
		<PMCommand command="execute" args={["shadcn-svelte@next", "add", installationUrl]} />
	{/snippet}
</ComponentPageLayout>
