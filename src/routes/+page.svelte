<script lang="ts">
	import LoadingImage from "$lib/registry/blocks/loading-image/loading-image.svelte";
	import ComponentShowcase from "$lib/components/component-showcase.svelte";

	const code = {
		"loading-image":
			`<LoadingImage
\tsrc="https://picsum.photos/id/237/200/300"
\talt="dog" />

<LoadingImage
\tsrc="https://deckweiss.at/non-existing-image.jpg"
\tclass="w-30"
\tcontainerClass="h-50 bg-[#00ff00] text-center w-50">
\t{#snippet loading()}
\t\t...
\t{/snippet}

\t{#snippet error()}
\t\t:(
\t{/snippet}
</LoadingImage>`,
	};
</script>

<div class="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
	<header class="flex flex-col gap-1">
		<h1 class="text-3xl font-bold tracking-tight">Deckweiss Component Registry</h1>
		<p class="text-muted-foreground">
			A custom registry for distributing code using shadcn-svelte.
		</p>
		<br />
		<p>
			Use these first:
		</p>
		<ul class="list-disc ml-5">
			<li>
				<a href="https://next.shadcn-svelte.com">ShadCn Svelte</a>
			</li>
			<li>
				<a href="https://www.shadcn-svelte-extras.com">ShadCn Svelte Extras</a>
			</li>
		</ul>
	</header>
	<main class="flex flex-1 flex-col gap-8">
		<ComponentShowcase
			name="Loading Image"
			componentKey="loading-image"
			description="A loading image component"
			code={code["loading-image"]}>
			<div class="relative flex flex-col min-h-[400px] items-center justify-center gap-4">
				<LoadingImage
					src="https://picsum.photos/id/237/200/300"
					alt="dog" />

				<LoadingImage
					src="https://deckweiss.at/non-existing-image.jpg"
					class="w-30"
					containerClass="h-50 bg-[#00ff00] text-center w-50">
					{#snippet loading()}
						...
					{/snippet}

					{#snippet error()}
						:(
					{/snippet}
				</LoadingImage>
			</div>
		</ComponentShowcase>
	</main>
</div>
