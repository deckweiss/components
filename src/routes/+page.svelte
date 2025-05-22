<script lang="ts">
	import HelloWorld from "$lib/registry/blocks/hello-world/hello-world.svelte";
	import ExampleForm from "$lib/registry/blocks/example-form/example-form.svelte";
	import PokemonPage from "$lib/registry/blocks/complex-component/+page.svelte";
	import ExampleCard from "$lib/registry/blocks/example-with-css/example-card.svelte";
	import LoadingImage from "$lib/registry/blocks/loading-image/loading-image.svelte";

	// This page displays items from the custom registry.
	// You are free to implement this with your design as needed.
</script>

<div class="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
	<header class="flex flex-col gap-1">
		<h1 class="text-3xl font-bold tracking-tight">Custom Registry</h1>
		<p class="text-muted-foreground">
			A custom registry for distributing code using shadcn-svelte.
		</p>
	</header>
	<main class="flex flex-1 flex-col gap-8">
		<div class="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-muted-foreground text-sm sm:pl-3">A simple hello world component</h2>
			</div>
			<div class="relative flex min-h-[400px] items-center justify-center">
				<HelloWorld />
			</div>
		</div>

		<div class="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-muted-foreground text-sm sm:pl-3">A contact form with Zod validation.</h2>
			</div>
			<div class="relative flex min-h-[500px] items-center justify-center">
				<ExampleForm />
			</div>
		</div>

		<div class="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-muted-foreground text-sm sm:pl-3">
					A complex component showing hooks, libs and components.
				</h2>
			</div>
			<div class="relative flex min-h-[400px] items-center justify-center">
				<PokemonPage />
			</div>
		</div>

		<div class="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-muted-foreground text-sm sm:pl-3">A login form with a CSS file.</h2>
			</div>
			<div class="relative flex min-h-[400px] items-center justify-center">
				<ExampleCard />
			</div>
		</div>

		<div class="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
			<div class="flex items-center justify-between">
				<h2 class="text-muted-foreground text-sm sm:pl-3">Image loading placeholder.</h2>
			</div>
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
		</div>
	</main>
</div>
