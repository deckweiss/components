<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import { Button } from "$lib/components/ui/button";
	import { openAddOn } from "$lib/registry/blocks/add-on/routing";
	import { NoPreviewBanner } from "$lib/components/ui/no-preview-banner";
	import AddOn from "$lib/assets/add-on.jpg";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<NoPreviewBanner />

			<img src={AddOn} alt="Add On" class="h-auto w-2/3" />

			<div>
				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>
