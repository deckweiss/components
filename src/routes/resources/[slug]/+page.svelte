<script lang="ts">
	import ResourcePageWrapper from "$lib/components/page-layout/resource-page-wrapper.svelte";
	import { Button } from "$lib/components/ui/button";
	import { SquareArrowOutUpRight } from "@lucide/svelte";

	let { data } = $props();
</script>

<ResourcePageWrapper resource={data.resource}>
	{#snippet children()}
		{#if data.resource.link}
			<section class="mb-12">
				<p class="text-muted-foreground mb-6">
					This resource links to an external page. Click below to open it in a new tab.
				</p>
				<a href={data.resource.link} target="_blank" rel="noopener noreferrer">
					<Button class="gap-2">
						<SquareArrowOutUpRight class="size-4" />
						Open external resource
					</Button>
				</a>
			</section>
		{:else}
			<section class="mb-12">
				<p class="text-muted-foreground">Resource content goes here.</p>
			</section>
		{/if}
	{/snippet}
</ResourcePageWrapper>
