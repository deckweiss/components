<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { changelog } from "$lib/version-manager";
	import { History, Repeat, Bug, Trash2, Sparkles } from "@lucide/svelte";

	const typeIcons = {
		added: Sparkles,
		updated: Repeat,
		fixed: Bug,
		removed: Trash2,
	};

	const typeColors = {
		added: "text-emerald-500 bg-emerald-500/10",
		updated: "text-blue-500 bg-blue-500/10",
		fixed: "text-amber-500 bg-amber-500/10",
		removed: "text-red-500 bg-red-500/10",
	};
</script>

<svelte:head>
	<title>Changelog - Deckweiss Components</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-12">
	<!-- Header -->
	<div class="mb-12">
		<Badge variant="secondary" class="mb-4">
			<History class="mr-1 size-3" />
			Changelog
		</Badge>
		<h1 class="text-foreground mb-4 text-4xl font-bold tracking-tight">What's New</h1>
		<p class="text-muted-foreground max-w-2xl text-lg">
			All notable changes to the Deckweiss Components Registry are documented here.
		</p>
	</div>

	<!-- Changelog Entries -->
	<div class="relative">
		<!-- Timeline line -->
		<div class="bg-border absolute top-0 bottom-0 left-[15.75px] hidden w-px sm:block"></div>

		<div class="space-y-12">
			{#each changelog as entry, index}
				<div class="relative">
					<!-- Timeline dot -->
					<div
						class="bg-primary absolute top-1 left-4 hidden size-3 -translate-x-1/2 rounded-full sm:block"
					></div>

					<div class="sm:pl-12">
						<!-- Version Header -->
						<div class="mb-4 flex flex-wrap items-center gap-3">
							<h2 class="text-foreground text-2xl font-bold">v{entry.version}</h2>
							<Badge variant="outline" class="text-muted-foreground">
								{new Date(entry.date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</Badge>
							{#if index === 0}
								<Badge class="bg-primary/10 text-primary">Latest</Badge>
							{/if}
						</div>

						<!-- Changes -->
						<div class="space-y-3">
							{#each entry.changes as change}
								{@const Icon = typeIcons[change.type]}
								<div class="flex items-start gap-3">
									<div
										class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded {typeColors[
											change.type
										]}"
									>
										<Icon class="size-3.5" />
									</div>
									<p class="text-foreground">
										{change.description}
										{#if change.ref}
											<a
												href={change.category === "util"
													? `/utils/${change.ref}`
													: `/components/${change.ref}`}
												class="text-primary/60 ml-1 text-xs hover:underline"
											>
												→ View
											</a>
										{/if}
									</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
