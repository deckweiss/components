<script lang="ts">
	import type { Snippet } from "svelte";
	import { GenericPageLayout } from "./index";
	import { File } from "@lucide/svelte";

	interface Props {
		backHref: string;
		title: string;
		description: string;
		isNew?: boolean;
		isUpdated?: boolean;
		children: Snippet;
	}

	let { backHref, title, description, isNew, isUpdated, children }: Props = $props();
</script>

<GenericPageLayout
	{backHref}
	badgeIcon={File}
	badgeText="Resource"
	{isNew}
	{isUpdated}
	{title}
	{description}
>
	{#snippet children()}
		{@render children()}
	{/snippet}
</GenericPageLayout>
