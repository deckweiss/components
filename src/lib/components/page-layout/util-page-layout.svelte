<script lang="ts">
	import type { Snippet } from "svelte";
	import { GenericPageLayout } from "./index";
	import { Wrench } from "@lucide/svelte";

	interface Props {
		backHref: string;
		title: string;
		description: string;
		code: Snippet;
		installation?: Snippet;
		apiReference?: Snippet;
		isWip?: boolean;
		isNew?: boolean;
		isUpdated?: boolean;
		wipContent?: Snippet;
	}

	let {
		backHref,
		title,
		description,
		code,
		installation,
		apiReference,
		isWip = false,
		isNew = false,
		isUpdated = false,
		wipContent,
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
		{#if isWip && wipContent}
			{@render wipContent()}
		{:else}
			<!-- Code Section -->
			<section class="mb-12">
				<h2 class="text-foreground mb-4 text-2xl font-semibold">Code</h2>
				{@render code()}
			</section>

			<!-- Additional Sections -->
			<div class="flex flex-col gap-8">
				{#if installation}
					<section>
						<h2 class="text-foreground mb-4 text-2xl font-semibold">Installation</h2>
						{@render installation()}
					</section>
				{/if}

				{#if apiReference}
					<section>
						<h2 class="text-foreground mb-4 text-2xl font-semibold">API Reference</h2>
						{@render apiReference()}
					</section>
				{/if}
			</div>
		{/if}
	{/snippet}
</GenericPageLayout>
