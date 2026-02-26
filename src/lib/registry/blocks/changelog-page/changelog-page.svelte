<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";
	import {
		getAllVersions,
		getLatestVersion,
		showVersionHighlights,
	} from "$lib/versions/version-manager";
	import { SparklesIcon, TrendingUpIcon, BugIcon } from "@lucide/svelte";

	const versions = $derived([...getAllVersions()].reverse());
</script>

<div class="space-y-8">
	{#each versions as version (version.version)}
		<article class="bg-card max-w-2xl rounded-lg border p-6 shadow-sm">
			<div class="mb-4 flex flex-wrap items-baseline justify-between gap-2">
				<div class="flex flex-wrap items-baseline gap-2">
					<h2 class="text-foreground text-xl font-semibold">{version.title}</h2>
					<span class="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-sm font-medium">
						{version.version}
					</span>
					<span class="text-muted-foreground text-sm">{version.date}</span>
				</div>
				<Button
					variant={getLatestVersion().version === version.version ? "default" : "outline"}
					size="sm"
					onclick={() => showVersionHighlights(version)}
				>
					Highlights anzeigen
				</Button>
			</div>

			<div class="space-y-4">
				{#if version.detailedChanges.newFeatures.length > 0}
					<section>
						<h3 class="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
							<SparklesIcon class="text-primary size-4" />
							Neue Funktionen
						</h3>
						<ul class="text-muted-foreground ml-1.5 list-inside list-disc space-y-1 text-sm">
							{#each version.detailedChanges.newFeatures as item}
								<li>{item}</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if version.detailedChanges.improvements.length > 0}
					<section>
						<h3 class="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
							<TrendingUpIcon class="text-primary size-4" />
							Verbesserungen
						</h3>
						<ul class="text-muted-foreground ml-1.5 list-inside list-disc space-y-1 text-sm">
							{#each version.detailedChanges.improvements as item}
								<li>{item}</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if version.detailedChanges.bugFixes.length > 0}
					<section>
						<h3 class="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
							<BugIcon class="text-primary size-4" />
							Bugfixes
						</h3>
						<ul class="text-muted-foreground ml-1.5 list-inside list-disc space-y-1 text-sm">
							{#each version.detailedChanges.bugFixes as item}
								<li>{item}</li>
							{/each}
						</ul>
					</section>
				{/if}
			</div>
		</article>
	{/each}
</div>
