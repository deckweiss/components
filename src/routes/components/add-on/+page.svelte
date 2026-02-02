<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import { Button } from "$lib/components/ui/button";
	import { openAddOn } from "$lib/registry/blocks/add-on/routing";
	import AddOnRenderer from "$lib/registry/blocks/add-on/add-on-renderer.svelte";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<AddOnRenderer>
							<Button
								onclick={() => {
									openAddOn("example-add-on", "123");
								}}
							>
								Open Add On
							</Button>
						</AddOnRenderer>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>
