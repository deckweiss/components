<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import { PosthogFeedbackButton } from "$lib/registry/blocks/posthog-feedback";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<div class="relative min-h-[400px] rounded-lg border border-dashed p-8">
							<p class="text-muted-foreground mb-4 text-sm">
								Click the button in the bottom-right corner to open the feedback modal.
							</p>
							<PosthogFeedbackButton appName="component-showcase" position="bottom-right" />
						</div>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>
