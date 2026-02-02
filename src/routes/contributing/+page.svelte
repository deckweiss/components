<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import Code from "$lib/components/ui/code/code.svelte";
	import { GitBranch, Github, FileCode, TestTube, Send, MessageSquare } from "@lucide/svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>How to Contribute - Deckweiss Components</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-12">
	<!-- Header -->
	<div class="mb-12">
		<Badge variant="secondary" class="mb-4">
			<GitBranch class="mr-1 size-3" />
			Contributing
		</Badge>
		<h1 class="text-foreground mb-4 text-4xl font-bold tracking-tight">How to Contribute</h1>
		<p class="text-muted-foreground max-w-2xl text-lg">
			Thank you for your interest in contributing to Deckweiss Components! Here's how you can help.
		</p>
	</div>

	<!-- Ways to Contribute -->
	<section class="mb-12">
		<h2 class="text-foreground mb-6 text-2xl font-semibold">Ways to Contribute</h2>
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="rounded-lg border p-6">
				<FileCode class="text-primary mb-3 size-8" />
				<h3 class="text-foreground mb-2 font-semibold">Add New Components</h3>
				<p class="text-muted-foreground text-sm">
					Create new reusable components following our patterns and conventions.
				</p>
			</div>
			<div class="rounded-lg border p-6">
				<TestTube class="text-primary mb-3 size-8" />
				<h3 class="text-foreground mb-2 font-semibold">Report Bugs</h3>
				<p class="text-muted-foreground text-sm">
					Found a bug? Open an issue with steps to reproduce.
				</p>
			</div>
			<div class="rounded-lg border p-6">
				<MessageSquare class="text-primary mb-3 size-8" />
				<h3 class="text-foreground mb-2 font-semibold">Suggest Features</h3>
				<p class="text-muted-foreground text-sm">
					Have an idea? Share it in the discussions or create a feature request.
				</p>
			</div>
			<div class="rounded-lg border p-6">
				<Send class="text-primary mb-3 size-8" />
				<h3 class="text-foreground mb-2 font-semibold">Improve Documentation</h3>
				<p class="text-muted-foreground text-sm">Help us improve our docs, examples, and guides.</p>
			</div>
		</div>
	</section>

	<!-- Component Guidelines -->
	<section class="mb-12">
		<h2 class="text-foreground mb-6 text-2xl font-semibold">README.md</h2>
		<div class="prose max-w-none">
			{@html data.readmeHtml}
		</div>
	</section>

	<!-- Registry Structure -->
	<section class="mb-12">
		<h2 class="text-foreground mb-6 text-2xl font-semibold">Registry Structure</h2>
		<Code
			code={`src/lib/registry/
├── blocks/           # Complex components
│   ├── data-table/
│   ├── navbar/
│   └── ...
├── ui/               # UI primitives
│   ├── button/
│   ├── progress/
│   └── ...
└── utils/            # Utility functions
    ├── format-measurement-value/
    └── ...`}
			lang="bash"
		/>
	</section>

	<!-- CTA -->
	<section class="border-border rounded-xl border p-8 text-center">
		<h2 class="text-foreground mb-3 text-xl font-semibold">Ready to contribute?</h2>
		<p class="text-muted-foreground mb-6">Check out our GitHub repository to get started.</p>

		<a href="https://github.com/deckweiss" target="_blank">
			<Button class="gap-2 hover:cursor-pointer">
				<Github class="size-4" />
				View on GitHub
			</Button>
		</a>
	</section>
</div>
