<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component} />
