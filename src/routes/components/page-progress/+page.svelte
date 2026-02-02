<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import { pageLoading, PageProgress } from "$lib/registry/blocks/page-progress";
	import { Button } from "$lib/components/ui/button";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<div class="flex flex-col gap-4">
							<PageProgress />
							<Button
								onclick={() => {
									pageLoading.invocers = ["test"];
									setTimeout(() => {
										pageLoading.invocers = [];
									}, 2000);
								}}
							>
								Trigger Loading
							</Button>
						</div>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>
