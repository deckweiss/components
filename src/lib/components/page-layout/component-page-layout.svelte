<script lang="ts">
	import type { Snippet } from "svelte";
	import { GenericPageLayout } from "./index";
	import { Boxes } from "@lucide/svelte";
	import { WipBanner } from "$lib/components/ui/wip-banner";

	interface Props {
		backHref: string;
		title: string;
		description: string;
		firstExample?: Snippet;
		remainingExamples?: Snippet;
		installation: Snippet;
		isWip?: boolean;
		isNew?: boolean;
		isUpdated?: boolean;
	}

	let {
		backHref,
		title,
		description,
		firstExample,
		remainingExamples,
		installation,
		isWip = false,
		isNew = false,
		isUpdated = false,
	}: Props = $props();
</script>

<GenericPageLayout
	{backHref}
	badgeIcon={Boxes}
	badgeText="Component"
	{isNew}
	{isWip}
	{isUpdated}
	{title}
	{description}
>
	{#snippet children()}
		{#if isWip}
			<WipBanner />
		{:else if firstExample}
			{@render firstExample()}

			<section class="mt-8">
				<h2 class="text-foreground mb-4 text-2xl font-semibold">Installation</h2>
				{@render installation()}
			</section>

			{#if remainingExamples}
				{@render remainingExamples()}
			{/if}
		{/if}
	{/snippet}
</GenericPageLayout>
