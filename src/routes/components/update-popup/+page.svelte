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
					<div class="px-4 py-8 space-y-6">
						<h3 class="text-foreground text-lg font-semibold">
							Auto-installs a version-manager system: add your changelog content and the system does the rest.
						</h3>
						<div class="space-y-3">
							<p class="text-muted-foreground text-sm">
								The Update Popup auto-opens when the user visits your app and hasn't seen the latest
								version yet. The last seen version is stored in <code
									class="rounded bg-muted px-1.5 py-0.5 text-xs">localStorage</code> under the key
								<code class="rounded bg-muted px-1.5 py-0.5 text-xs">hasSeenVersion</code>.
							</p>
							<p class="text-muted-foreground text-sm">
								You can also manually trigger the popup (e.g. from a "What's New" link) using
								<code class="rounded bg-muted px-1.5 py-0.5 text-xs">showVersionHighlights(version)</code
								>. Try the button below:
							</p>
							<Button onclick={() => showVersionHighlights(getLatestVersion())}>
								Open Update Popup
							</Button>
						</div>

						<div class="border-border rounded-lg border p-4 space-y-4">
							<h3 class="text-foreground text-sm font-semibold">Version Manager API</h3>
							<dl class="text-muted-foreground space-y-3 text-sm">
								<div>
									<dt class="font-medium text-foreground">getStoredVersion()</dt>
									<dd>Returns the version string stored in localStorage (or null if never seen).</dd>
								</div>
								<div>
									<dt class="font-medium text-foreground">setStoredVersion(version)</dt>
									<dd>Stores the version when the user dismisses the popup. Called by UpdatePopup.</dd>
								</div>
								<div>
									<dt class="font-medium text-foreground">getVersionsToShow()</dt>
									<dd>
										Returns versions the user hasn't seen. If no stored version: all versions. Otherwise:
										versions released after the stored one.
									</dd>
								</div>
								<div>
									<dt class="font-medium text-foreground">hasNewVersions()</dt>
									<dd>Whether there are unseen versions (for showing a badge or "What's New" indicator).</dd>
								</div>
								<div>
									<dt class="font-medium text-foreground">showVersionHighlights(version)</dt>
									<dd>Opens the popup for a specific version. Use for manual triggers like "Highlights anzeigen".</dd>
								</div>
								<div>
									<dt class="font-medium text-foreground">getLatestVersion()</dt>
									<dd>Returns the latest VersionData. Use with showVersionHighlights to open the latest release.</dd>
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
