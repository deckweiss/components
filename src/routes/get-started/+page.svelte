<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import Code from "$lib/components/ui/code/code.svelte";
	import {
		Copy,
		Check,
		Terminal,
		Package,
		BookOpen,
		Sparkles,
		Boxes,
		Wrench,
	} from "@lucide/svelte";
	import { UseClipboard } from "$lib/hooks/use-clipboard.svelte";

	const clipboard = new UseClipboard({ delay: 2000 });

	const installCommand = `npx shadcn-svelte@next add "https://components.deckweiss.at/r"`;
</script>

<svelte:head>
	<title>Get Started - Deckweiss Components</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-12">
	<!-- Header -->
	<div class="mb-12">
		<Badge variant="secondary" class="mb-4">
			<BookOpen class="mr-1 size-3" />
			Getting Started
		</Badge>
		<h1 class="text-foreground mb-4 text-4xl font-bold tracking-tight">Get Started Guide</h1>
		<p class="text-muted-foreground max-w-2xl text-lg">
			Get up and running with Deckweiss Components in your SvelteKit project.
		</p>
	</div>

	<section>
		<div class="grid gap-4 sm:grid-cols-2">
			<a
				href="/components"
				class="group hover:border-primary/50 rounded-lg border p-6 transition-all hover:shadow-md"
			>
				<Boxes class="text-primary mb-3 size-8" />
				<h3 class="text-foreground mb-1 font-semibold">Browse Components</h3>
				<p class="text-muted-foreground text-sm">
					Explore all available components with live demos and code examples.
				</p>
			</a>
			<a
				href="/utils"
				class="group hover:border-primary/50 rounded-lg border p-6 transition-all hover:shadow-md"
			>
				<Wrench class="text-primary mb-3 size-8" />
				<h3 class="text-foreground mb-1 font-semibold">Explore Utils</h3>
				<p class="text-muted-foreground text-sm">
					Check out our utilities for common patterns and functionality.
				</p>
			</a>
		</div>
	</section>

	<!-- Prerequisites -->
	<section class="my-12">
		<h2 class="text-foreground mb-4 text-2xl font-semibold">Prerequisites</h2>
		<div class="bg-muted/30 rounded-lg border p-6">
			<ul class="space-y-3">
				<li class="flex items-start gap-3">
					<div
						class="bg-primary/10 text-primary mt-0.5 flex size-6 items-center justify-center rounded-full text-xs font-medium"
					>
						1
					</div>
					<div>
						<p class="text-foreground font-medium">SvelteKit Project</p>
						<p class="text-muted-foreground text-sm">
							You need an existing SvelteKit project. If you don't have one,
							<a
								href="https://svelte.dev/docs/kit/creating-a-project"
								class="text-primary hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								create one first
							</a>.
						</p>
					</div>
				</li>
				<li class="flex items-start gap-3">
					<div
						class="bg-primary/10 text-primary mt-0.5 flex size-6 items-center justify-center rounded-full text-xs font-medium"
					>
						2
					</div>
					<div>
						<p class="text-foreground font-medium">shadcn-svelte</p>
						<p class="text-muted-foreground text-sm">
							Set up
							<a
								href="https://next.shadcn-svelte.com/docs/installation"
								class="text-primary hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								shadcn-svelte
							</a>
							in your project first.
						</p>
					</div>
				</li>
			</ul>
		</div>
	</section>

	<!-- Installation -->
	<section class="mb-12">
		<h2 class="text-foreground mb-4 text-2xl font-semibold">Installation</h2>
		<p class="text-muted-foreground mb-6">
			Use the shadcn-svelte CLI to add components from our registry:
		</p>

		<div class="group relative">
			<div class="bg-card overflow-hidden rounded-lg border">
				<div class="border-border flex items-center justify-between border-b px-4 py-2">
					<div class="flex items-center gap-2">
						<Terminal class="text-muted-foreground size-4" />
						<span class="text-muted-foreground text-sm">Terminal</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						class="h-8 gap-1.5"
						onclick={() => clipboard.copy(installCommand)}
					>
						{#if clipboard.copied}
							<Check class="size-3.5" />
							<span class="text-xs">Copied!</span>
						{:else}
							<Copy class="size-3.5" />
							<span class="text-xs">Copy</span>
						{/if}
					</Button>
				</div>
				<div class="p-4">
					<code class="text-foreground text-sm">{installCommand}</code>
				</div>
			</div>
		</div>
	</section>

	<!-- Example -->
	<section class="mb-12">
		<h2 class="text-foreground mb-4 text-2xl font-semibold">Adding a Component</h2>
		<p class="text-muted-foreground mb-6">For example, to add the Loading Image component:</p>

		<div class="space-y-4">
			<div class="bg-card overflow-hidden rounded-lg border">
				<div class="border-border flex items-center gap-2 border-b px-4 py-2">
					<Terminal class="text-muted-foreground size-4" />
					<span class="text-muted-foreground text-sm">Terminal</span>
				</div>
				<div class="p-4">
					<code class="text-foreground text-sm"
						>npx shadcn-svelte@next add "https://components.deckweiss.at/r/loading-image.json"</code
					>
				</div>
			</div>

			<p class="text-muted-foreground text-sm">
				This will add the component to your project along with any required dependencies.
			</p>
		</div>
	</section>

	<!-- Usage -->
	<section class="mb-12">
		<h2 class="text-foreground mb-4 text-2xl font-semibold">Usage</h2>
		<p class="text-muted-foreground mb-6">
			After installation, import and use the component in your Svelte files:
		</p>

		<Code
			code={`<script lang="ts">
  import LoadingImage from "$lib/components/blocks/loading-image/loading-image.svelte";
</script>

<LoadingImage 
  src="https://example.com/image.jpg" 
  alt="Description" 
/>`}
			lang="svelte"
		/>
	</section>
</div>
