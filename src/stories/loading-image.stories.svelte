<script module>
	import LoadingImage from "$lib/registry/blocks/loading-image/loading-image.svelte";
	import { defineMeta } from "@storybook/addon-svelte-csf";

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: "Example/Loading Image",
		component: LoadingImage,
		tags: ["autodocs"],
		argTypes: {
			// backgroundColor: { control: 'color' },
			// size: {
			//   control: { type: 'select' },
			//   options: ['small', 'medium', 'large'],
			// },
		},
		// args: {
		//   onclick: fn(),
		// }
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Logged In" args={{ src: "https://picsum.photos/id/237/200/300", alt: "dog" }} />

<Story
	name="Logged Out"
	args={{
		src: "https://deckweiss.at/non-existing-image.jpg",
		class: "w-30",
		containerClass: "h-50 bg-[#00ff00] text-center w-50",
	}}
>
	{#snippet loading()}
		...
	{/snippet}

	{#snippet error()}
		:(
	{/snippet}
</Story>
