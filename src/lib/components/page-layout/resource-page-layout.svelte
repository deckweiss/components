<script lang="ts">
	import type { Snippet } from "svelte";
	import { GenericPageLayout } from "./index";
	import { File } from "@lucide/svelte";

	interface Props {
		backHref: string;
		title: string;
		description: string;
		children: Snippet;
	}

	let { backHref, title, description, children }: Props = $props();
</script>

<GenericPageLayout {backHref} badgeIcon={File} badgeText="Resource" {title} {description}>
	{#snippet children()}
		{@render children()}
	{/snippet}
</GenericPageLayout>
