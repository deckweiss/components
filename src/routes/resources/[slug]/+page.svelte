<script lang="ts">
	import ResourcePageWrapper from "$lib/components/page-layout/resource-page-wrapper.svelte";
	import { outsourcedComponents } from "$lib/outsourced-components";

	let { data } = $props();
</script>

<ResourcePageWrapper resource={data.resource}>
	{#snippet children()}
		{#if data.resource.slug === "outsourced-components"}
			<section class="mb-12">
				<h2 class="text-foreground mb-4 text-2xl font-semibold">Reference</h2>
				<p class="text-muted-foreground mb-6">
					This project uses components from external sources. Copy the documentation URLs below for reference.
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
		{:else}
			<section class="mb-12">
				<p class="text-muted-foreground">Resource content goes here.</p>
			</section>
		{/if}
	{/snippet}
</ResourcePageWrapper>
