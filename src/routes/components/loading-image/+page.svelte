<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import LoadingImage from "$lib/registry/blocks/loading-image/loading-image.svelte";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<div class="flex flex-col items-center justify-center gap-4">
							<LoadingImage src="https://picsum.photos/id/237/200/300" alt="dog" />

							<LoadingImage
								src="https://deckweiss.at/non-existing-image.jpg"
								class="w-30"
								containerClass="h-50 bg-[#00ff00] text-center w-50"
							>
								{#snippet loading()}
									...
								{/snippet}

								{#snippet error()}
									:(
								{/snippet}
							</LoadingImage>
						</div>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>
