<script lang="ts">
	import UtilityPageWrapper from "$lib/components/page-layout/utility-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import example1Code from "./example1-code.txt?raw";

	let { data } = $props();
</script>

<UtilityPageWrapper util={data.util}>
	{#snippet code()}
		<Code code={example1Code} lang="svelte" />
	{/snippet}
</UtilityPageWrapper>
