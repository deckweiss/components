<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Slider from "$lib/registry/blocks/slider/slider.svelte";

	const { Story } = defineMeta({
		title: "Example/Slider",
		component: Slider,
		tags: ["autodocs"],
	});
</script>

<Story name="Slider" args={{ value: [5], min: 0, max: 10, step: 1 }}></Story>

<Story name="Multiple" args={{ value: [2, 8], min: 0, max: 10, step: 1 }}></Story>
