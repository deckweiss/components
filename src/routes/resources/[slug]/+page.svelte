<script lang="ts">
	import ResourcePageWrapper from "$lib/components/page-layout/resource-page-wrapper.svelte";
	import { Button } from "$lib/components/ui/button";
	import { outsourcedComponents } from "$lib/outsourced-components";
	import { SquareArrowOutUpRight } from "@lucide/svelte";

	let { data } = $props();
</script>

<ResourcePageWrapper resource={data.resource}>
	{#snippet children()}
		{#if data.resource.slug === "outsourced-components"}
			<section class="mb-12">
				<h2 class="text-foreground mb-4 text-2xl font-semibold">Reference</h2>
				<p class="text-muted-foreground mb-6">
					This project uses components from external sources. Copy the documentation URLs below for
					reference.
				</p>
				<div class="border-border overflow-hidden rounded-lg border">
					<table class="w-full text-sm">
						<thead>
							<tr class="border-border bg-muted/50">
								<th class="border-border px-4 py-3 text-left font-medium">Component</th>
								<th class="border-border px-4 py-3 text-left font-medium">Source</th>
							</tr>
						</thead>
						<tbody>
							{#each outsourcedComponents as comp}
								<tr class="border-border border-t">
									<td class="px-4 py-3 font-medium">{comp.title}</td>
									<td class="text-muted-foreground px-4 py-3 font-mono text-xs">{comp.link}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{:else if data.resource.link}
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
