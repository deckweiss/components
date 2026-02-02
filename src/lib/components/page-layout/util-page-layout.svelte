<script lang="ts">
	import type { Snippet } from "svelte";
	import { GenericPageLayout } from "./index";
	import { Wrench } from "@lucide/svelte";
	import { WipBanner } from "$lib/components/ui/wip-banner";

	interface Props {
		backHref: string;
		title: string;
		description: string;
		code: Snippet;
		installation: Snippet;
		isWip?: boolean;
		isNew?: boolean;
		isUpdated?: boolean;
	}

	let {
		backHref,
		title,
		description,
		code,
		installation,
		isWip = false,
		isNew = false,
		isUpdated = false,
	}: Props = $props();
</script>

<GenericPageLayout
	{backHref}
	badgeIcon={Wrench}
	badgeText="Utility"
	{title}
	{description}
	{isWip}
	{isNew}
	{isUpdated}
>
	{#snippet children()}
		{#if isWip}
			<WipBanner />
		{:else}
			<section class="mb-12">
				<h2 class="text-foreground mb-4 text-2xl font-semibold">Code</h2>
				{@render code()}
			</section>

			<section class="mt-8">
				<h2 class="text-foreground mb-4 text-2xl font-semibold">Installation</h2>
				{@render installation()}
			</section>
		{/if}
	{/snippet}
</GenericPageLayout>
