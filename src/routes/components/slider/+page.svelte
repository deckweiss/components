<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import Slider from "$lib/registry/blocks/slider/slider.svelte";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<div class="flex items-center justify-center">
							<div class="w-full max-w-xs">
								<Slider value={[5]} min={0} max={10} step={1} class="w-full" />
							</div>
						</div>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>
