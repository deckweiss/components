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
	}

	let { util, code }: Props = $props();

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
>
	{#snippet installation()}
		<PMCommand command="execute" args={["shadcn-svelte@next", "add", installationUrl]} />
	{/snippet}
</UtilPageLayout>
