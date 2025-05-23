<script lang="ts">
	import LoadingImage from "$lib/registry/blocks/loading-image/loading-image.svelte";
	import ComponentShowcase from "$lib/components/component-showcase.svelte";
	import { pageLoading, PageProgress } from "$lib/registry/blocks/page-progress";
	import { Button } from "$lib/components/ui/button";
	import { toaster } from "$lib/registry/blocks/toaster";
	import { Toaster } from "$lib/registry/ui/sonner";

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
		"page-progress": `<div class="fixed top-0 z-[99] w-full">
\t<PageProgress />
</div>`,
		"toaster": `toaster.pushToast({message: 'Test', type: 'success'});`,
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

		<ComponentShowcase
			name="Page Progress"
			componentKey="page-progress"
			description="A page loading progress bar."
			code={code["page-progress"]}>
			<div class="flex flex-col gap-2">
				<PageProgress />

				<Button
					onclick={() => {
							pageLoading.invocers = ["test"];

							setTimeout(() => {
								pageLoading.invocers = [];
							}, 1000);
					}}>
					Test
				</Button>
			</div>
		</ComponentShowcase>

		<ComponentShowcase
			name="Custom Toast"
			componentKey="toaster"
			description="A toast component with customized look."
			code={code["toaster"]}
			codeLang="typescript">
			<div class="flex flex-col gap-2">
				<Toaster position="bottom-left" offset="20px" />

				<Button
					onclick={() => {
							toaster.pushToast({message: 'Test', type: 'success'});
					}}>
					Test
				</Button>
			</div>
		</ComponentShowcase>
	</main>
</div>
