<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import example1Code from "./example1-code.txt?raw";
	import { UpdatePopup } from "$lib/registry/blocks/update-popup";
	import { getLatestVersion, showVersionHighlights } from "$lib/versions/version-manager";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="space-y-6 px-4 py-2">
						<h3 class="text-foreground text-lg font-semibold">
							Auto-installs a version-manager system: add your changelog content and the system does
							the rest. Here is how it works:
						</h3>
						<div class="space-y-3">
							<p class="text-muted-foreground text-sm">
								The Update Popup auto-opens when the user visits your app and hasn't seen the latest
								version yet. The last seen version is stored in <code
									class="bg-muted rounded px-1.5 py-0.5 text-xs">localStorage</code
								>
								under the key
								<code class="bg-muted rounded px-1.5 py-0.5 text-xs">hasSeenVersion</code>.
							</p>
							<p class="text-muted-foreground text-sm">
								You can also manually trigger the popup (e.g. from a "What's New" link) using
								<code class="bg-muted rounded px-1.5 py-0.5 text-xs"
									>showVersionHighlights(version)</code
								>. Try the button below:
							</p>

							<Button onclick={() => showVersionHighlights(getLatestVersion())}>
								Open Update Popup
							</Button>

							<div class="border-border rounded-lg border p-3">
								<h4 class="text-foreground mb-2 text-sm font-semibold">
									$lib/versions folder structure
								</h4>
								<pre class="text-muted-foreground overflow-x-auto text-xs leading-relaxed"><code
										>versions/
├── content/
│   ├── v1.0.0.ts      ← version data (changes, icons, detailedChanges)
│   ├── v1.1.0.ts
│   └── ...            ← add new file per release
├── types.ts           ← VersionData, ChangeEntry interfaces
└── version-manager.ts ← registers content, API (showVersionHighlights, etc.)</code
									></pre>
								<p class="text-muted-foreground mt-2 text-xs">
									Add a <code class="bg-muted rounded px-1 py-0.5 text-[11px]"
										>content/vX.Y.Z.ts</code
									>
									for each release, import it in
									<code class="bg-muted rounded px-1 py-0.5 text-[11px]">version-manager.ts</code>,
									and include it in the
									<code class="bg-muted rounded px-1 py-0.5 text-[11px]">versions</code> array.
								</p>
							</div>
						</div>

						<div class="border-border space-y-4 rounded-lg border p-4">
							<h3 class="text-foreground text-sm font-semibold">Version Manager API</h3>
							<dl class="text-muted-foreground space-y-3 text-sm">
								<div>
									<dt class="text-foreground font-medium">getStoredVersion()</dt>
									<dd>
										Returns the version string stored in localStorage (or null if never seen).
									</dd>
								</div>
								<div>
									<dt class="text-foreground font-medium">setStoredVersion(version)</dt>
									<dd>
										Stores the version when the user dismisses the popup. Called by UpdatePopup.
									</dd>
								</div>
								<div>
									<dt class="text-foreground font-medium">getVersionsToShow()</dt>
									<dd>
										Returns versions the user hasn't seen. If no stored version: all versions.
										Otherwise: versions released after the stored one.
									</dd>
								</div>
								<div>
									<dt class="text-foreground font-medium">hasNewVersions()</dt>
									<dd>
										Whether there are unseen versions (for showing a badge or "What's New"
										indicator).
									</dd>
								</div>
								<div>
									<dt class="text-foreground font-medium">showVersionHighlights(version)</dt>
									<dd>
										Opens the popup for a specific version. Use for manual triggers like "Highlights
										anzeigen".
									</dd>
								</div>
								<div>
									<dt class="text-foreground font-medium">getLatestVersion()</dt>
									<dd>
										Returns the latest VersionData. Use with showVersionHighlights to open the
										latest release.
									</dd>
								</div>
							</dl>
						</div>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>

<UpdatePopup />
