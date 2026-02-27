<script lang="ts">
	import PageTemplatePageWrapper from "$lib/components/page-layout/page-template-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import { ChangelogPage } from "$lib/registry/blocks/changelog-page";
	import { UpdatePopup } from "$lib/registry/blocks/update-popup";
	import exampleCode from "./example-code.txt?raw";
	import example2ComponentCode from "./example2-component-code.txt?raw";

	let { data } = $props();
</script>

<PageTemplatePageWrapper pageTemplate={data.pageTemplate}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<ChangelogPage />
					</div>
				</Card>

				<Code code={exampleCode} lang="svelte" />
			</div>
		</section>
	{/snippet}
	{#snippet remainingExamples()}
		<section class="mt-8">
			<h2 class="text-foreground mb-4 text-2xl font-semibold">Component Source</h2>
			<Code code={example2ComponentCode} lang="svelte" />
		</section>
	{/snippet}
</PageTemplatePageWrapper>

<UpdatePopup />
