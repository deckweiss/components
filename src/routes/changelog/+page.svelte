<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { getChangelog } from "$lib/versions/version-manager";
	import { History, Repeat, Bug, Trash2, Sparkles } from "@lucide/svelte";
	import { ChangelogPage } from "$lib/registry/blocks/changelog-page";

	const changelog = getChangelog();

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

	<ChangelogPage />
</div>
