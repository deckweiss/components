<script lang="ts">
	import { page } from "$app/state";
	import { Badge } from "$lib/components/ui/badge";
	import { components, utils, getSourceIcon } from "$lib/registry";
	import { changelog, getLatestVersion } from "$lib/version-manager";
	import {
		Boxes,
		BookOpen,
		GitBranch,
		History,
		Wrench,
		ChevronDown,
		Sparkles,
		Package,
		ArrowUp,
		ExternalLink,
		Heart,
		Repeat,
		Construction,
	} from "@lucide/svelte";
	import DeckweissIcon from "$lib/assets/deckweiss-icon.png";
	import * as Dialog from "$lib/components/ui/dialog";
	import { outsourcedComponents, type ComponentSource } from "$lib/outsourced-components";

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	let componentsExpanded = $state(true);
	let utilsExpanded = $state(true);
	let creditsOpen = $state(false);

	// Create a source credits map
	const sourceCredits: Record<ComponentSource, { name: string; url: string }> = {
		deckweiss: { name: "Deckweiss", url: "https://deckweiss.at" },
		shadcn: { name: "shadcn", url: "https://shadcn-svelte.com" },
		"shadcn-svelte-extras": {
			name: "shadcn-svelte-extras",
			url: "https://shadcn-svelte-extras.com",
		},
		"more-shadcn": { name: "more-shadcn", url: "https://more-shadcn.noair.fun" },
	};

	// Get unique sources from outsourced components
	function getUniqueSources() {
		const uniqueSources = new Set(outsourcedComponents.map((c) => c.source));
		return Array.from(uniqueSources)
			.map((source) => sourceCredits[source])
			.filter(Boolean);
	}
</script>

<aside
	class="bg-sidebar border-sidebar-border fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-r {className}"
>
	<!-- Logo/Brand -->
	<div class="border-sidebar-border flex items-center gap-3 border-b px-4 py-5">
		<a href="/" class="flex items-center gap-3">
			<img src={DeckweissIcon} alt="Deckweiss" class="size-9 rounded-md" />
			<div class="flex flex-col">
				<span class="text-sidebar-foreground text-sm font-semibold tracking-tight">Deckweiss</span>
				<span class="text-sidebar-foreground/60 text-xs">Components Registry</span>
			</div>
		</a>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 overflow-y-auto px-3 py-4">
		<!-- Sections -->
		<div class="mb-6">
			<h3
				class="text-sidebar-foreground/50 mb-2 px-3 text-[10px] font-semibold tracking-wider uppercase"
			>
				Sections
			</h3>
			<ul class="space-y-0.5">
				<li>
					<a
						href="/get-started"
						class="text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors {page
							.url.pathname === '/get-started'
							? 'bg-sidebar-accent text-sidebar-accent-foreground'
							: ''}"
					>
						<BookOpen class="size-4 opacity-60" />
						Get Started
					</a>
				</li>
				<li>
					<a
						href="/contributing"
						class="text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors {page
							.url.pathname === '/contributing'
							? 'bg-sidebar-accent text-sidebar-accent-foreground'
							: ''}"
					>
						<GitBranch class="size-4 opacity-60" />
						How to Contribute
					</a>
				</li>
				<li>
					<a
						href="/changelog"
						class="text-sidebar-foreground hover:bg-sidebar-accent flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors {page
							.url.pathname === '/changelog'
							? 'bg-sidebar-accent text-sidebar-accent-foreground'
							: ''}"
					>
						<History class="size-4 opacity-60" />
						Changelog
						<Badge variant="secondary" class="ml-auto text-[10px]">{getLatestVersion()}</Badge>
					</a>
				</li>
			</ul>
		</div>

		<!-- Components -->
		<div class="mb-6">
			<button
				onclick={() => (componentsExpanded = !componentsExpanded)}
				class="text-sidebar-foreground/50 hover:text-sidebar-foreground mb-2 flex w-full items-center justify-between px-3 text-[10px] font-semibold tracking-wider uppercase transition-colors"
			>
				<span>Components</span>
				<ChevronDown class="size-3 transition-transform {componentsExpanded ? '' : '-rotate-90'}" />
			</button>
			{#if componentsExpanded}
				<ul class="space-y-0.5">
					{#each components as component (component.slug)}
						<li>
							{#if component.isOutsourced}
								<a
									href={component.link}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sidebar-foreground hover:bg-sidebar-accent flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors"
								>
									<span class="flex min-w-0 items-center gap-2">
										<img
											src={getSourceIcon(component.source)}
											alt={component.source}
											class="size-4 flex-shrink-0 rounded"
										/>
										<span class="truncate">{component.name}</span>
									</span>
								</a>
							{:else}
								<a
									href="/components/{component.slug}"
									class="text-sidebar-foreground hover:bg-sidebar-accent flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors {page
										.url.pathname === `/components/${component.slug}`
										? 'bg-sidebar-accent text-sidebar-accent-foreground'
										: ''}"
								>
									<span class="flex min-w-0 items-center gap-2">
										<img
											src={getSourceIcon(component.source)}
											alt={component.source}
											class="size-4 flex-shrink-0 rounded"
										/>
										<span class="truncate">{component.name}</span>
									</span>
									{#if component.isWip}
										<span class="rounded-sm bg-gray-500/10 p-1 text-[7px] text-gray-500">
											WIP
										</span>
									{/if}
									{#if component.isNew}
										<span class="rounded-sm bg-emerald-500/10 p-1">
											<Sparkles class="size-2.5 text-emerald-500" />
										</span>
									{/if}
									{#if component.isUpdated}
										<Repeat class="mr-0.5 size-3 text-blue-500" />
									{/if}
								</a>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Utils -->
		<div class="mb-6">
			<button
				onclick={() => (utilsExpanded = !utilsExpanded)}
				class="text-sidebar-foreground/50 hover:text-sidebar-foreground mb-2 flex w-full items-center justify-between px-3 text-[10px] font-semibold tracking-wider uppercase transition-colors"
			>
				<span>Utils</span>
				<ChevronDown class="size-3 transition-transform {utilsExpanded ? '' : '-rotate-90'}" />
			</button>
			{#if utilsExpanded}
				<ul class="space-y-0.5">
					{#each utils as util (util.slug)}
						<li>
							<a
								href="/utils/{util.slug}"
								class="text-sidebar-foreground hover:bg-sidebar-accent flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors {page
									.url.pathname === `/utils/${util.slug}`
									? 'bg-sidebar-accent text-sidebar-accent-foreground'
									: ''}"
							>
								<span class="flex items-center gap-2">
									<span class="truncate">{util.name}</span>
									{#if util.isWip}
										<span class="rounded-sm bg-gray-500/10 p-1 text-[7px] text-gray-500">
											WIP
										</span>
									{/if}
									{#if util.isNew}
										<span class="rounded-sm bg-emerald-500/10 p-1">
											<Sparkles class="size-2.5 text-emerald-500" />
										</span>
									{/if}
									{#if util.isUpdated}
										<Repeat class="mr-0.5 size-3 text-blue-500" />
									{/if}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</nav>

	<!-- Footer -->
	<div class="border-sidebar-border border-t px-4 py-3">
		<div class="mb-3 space-y-2">
			<Dialog.Root bind:open={creditsOpen}>
				<Dialog.Trigger
					class="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs font-medium transition-colors hover:cursor-pointer"
				>
					<Heart class="size-3.5" />
					<span>Credits</span>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay />
					<Dialog.Content class="max-w-md">
						<Dialog.Header>
							<Dialog.Title>Credits</Dialog.Title>
							<Dialog.Description>
								This project includes components and inspiration from:
							</Dialog.Description>
						</Dialog.Header>
						<div class="space-y-3">
							{#each getUniqueSources() as source}
								<a
									href={source.url}
									target="_blank"
									rel="noopener noreferrer"
									class="border-border hover:bg-accent hover:text-accent-foreground block rounded-md border p-3 transition-colors"
								>
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2">
											<img
												src={getSourceIcon(source.name as ComponentSource)}
												alt={source.name}
												class="size-4 flex-shrink-0 rounded"
											/>
											<span class="text-sm font-medium">{source.name}</span>
										</div>
										<ExternalLink class="size-3.5 opacity-50" />
									</div></a
								>
							{/each}
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
		<a
			href="https://deckweiss.at"
			target="_blank"
			rel="noopener noreferrer"
			class="text-sidebar-foreground/60 hover:text-sidebar-foreground flex items-center gap-1 text-xs transition-colors"
		>
			<span>Built by</span>
			<span class="font-semibold">Deckweiss</span>
		</a>
	</div>
</aside>
