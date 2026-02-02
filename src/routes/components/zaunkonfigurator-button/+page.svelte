<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import { Button as ZaunkonfiguratorButton } from "$lib/registry/blocks/zaunkonfigurator-button";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<div class="flex flex-wrap gap-2 py-8">
							<ZaunkonfiguratorButton variant="default">Base</ZaunkonfiguratorButton>
							<ZaunkonfiguratorButton variant="secondary">Secondary</ZaunkonfiguratorButton>
							<ZaunkonfiguratorButton variant="outline">Outline</ZaunkonfiguratorButton>
							<ZaunkonfiguratorButton variant="ghost">Ghost</ZaunkonfiguratorButton>
							<ZaunkonfiguratorButton variant="link">Link</ZaunkonfiguratorButton>
							<ZaunkonfiguratorButton variant="destructive">Destructive</ZaunkonfiguratorButton>
							<ZaunkonfiguratorButton variant="animated">Animated</ZaunkonfiguratorButton>
						</div>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>
