<script lang="ts">
	import { UtilPageLayout } from "$lib/components/page-layout";
	import { PMCommand } from "$lib/components/ui/pm-command";
	import type { Snippet } from "svelte";

	interface Props {
		util: {
			title: string;
			description: string;
			slug: string;
			isWip?: boolean;
			isNew?: boolean;
			isUpdated?: boolean;
		};
		code: Snippet;
		installation?: Snippet;
		apiReference?: Snippet;
		wipContent?: Snippet;
	}

	let { util, code, installation, apiReference, wipContent }: Props = $props();

	const installationUrl = `https://components.deckweiss.at/r/${util.slug}.json`;
</script>

<svelte:head>
	<title>{util.title} - Deckweiss Components</title>
</svelte:head>

<UtilPageLayout
	backHref="/utils"
	title={util.title}
	description={util.description}
	isWip={util.isWip}
	isNew={util.isNew}
	isUpdated={util.isUpdated}
	{code}
	{apiReference}
	{wipContent}
>
	{#snippet installation()}
		{#if installation}
			{@render installation()}
		{:else}
			<PMCommand command="execute" args={["shadcn-svelte@next", "add", installationUrl]} />
		{/if}
	{/snippet}
</UtilPageLayout>
