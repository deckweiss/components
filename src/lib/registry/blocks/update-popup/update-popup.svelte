<script lang="ts">
	import { onMount } from "svelte";
	import {
		getVersionsToShow,
		setStoredVersion,
		versionPopupToShow,
	} from "$lib/versions/version-manager";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import { XIcon, ExternalLinkIcon } from "@lucide/svelte";

	let dismissed = $state(false);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	const latestUnseenVersion = $derived.by(() => {
		if (!mounted) return null;
		const versions = getVersionsToShow();
		return versions.length > 0 ? versions[versions.length - 1]! : null;
	});

	const manuallyRequestedVersion = $derived($versionPopupToShow);

	const displayedVersion = $derived(manuallyRequestedVersion ?? latestUnseenVersion);

	const isManualView = $derived(manuallyRequestedVersion !== null);

	const shouldShow = $derived(
		mounted &&
			displayedVersion !== null &&
			(manuallyRequestedVersion !== null || (!dismissed && latestUnseenVersion !== null))
	);
	const open = $derived(shouldShow);

	function handleDismiss() {
		if (manuallyRequestedVersion) {
			versionPopupToShow.set(null);
		} else if (latestUnseenVersion) {
			setStoredVersion(latestUnseenVersion.version);
			dismissed = true;
		}
	}

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) {
			handleDismiss();
		}
	}
</script>

{#if shouldShow && displayedVersion}
	<Dialog.Root {open} onOpenChange={handleOpenChange}>
		<Dialog.Portal>
			<Dialog.Overlay class="bg-black/20" />
			<Dialog.Content class="max-w-md border-0 p-0 shadow-xl" showCloseButton={false}>
				<div class="rounded-xl bg-white p-5 shadow-lg">
					<!-- Header -->
					<div class="relative">
						<p class="text-sm text-neutral-500">
							{isManualView ? "Version " + displayedVersion.version : "Jetzt verfügbar"}
						</p>
						<h2 class="mt-0.5 text-xl font-bold text-neutral-900">
							{displayedVersion.title}
						</h2>
						<button
							type="button"
							class="absolute end-0 top-0 flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
							onclick={handleDismiss}
						>
							<XIcon class="size-4" />
						</button>
					</div>

					<!-- Features -->
					<div class="mt-4 space-y-4">
						{#each displayedVersion.changes as change, i (change.title + "-" + i)}
							{@const IconComponent = change.icon}
							<div class="flex gap-3">
								{#if IconComponent}
									<div
										class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
									>
										<IconComponent class="size-5" />
									</div>
								{/if}
								<div class="min-w-0 flex-1">
									<p class="font-semibold text-neutral-900">{change.title}</p>
									<p class="mt-0.5 text-sm text-neutral-500">
										{change.description}
									</p>
								</div>
							</div>
						{/each}
					</div>

					<!-- Footer -->
					<Separator class="my-4 bg-neutral-200" />
					<div class="flex items-center justify-between">
						{#if !isManualView && displayedVersion.learnMoreUrl}
							<a
								href={displayedVersion.learnMoreUrl}
								class="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:underline"
								onclick={handleDismiss}
							>
								Mehr erfahren
								<ExternalLinkIcon class="size-4" />
							</a>
						{:else}
							<span></span>
						{/if}
						<Button onclick={handleDismiss} class="bg-primary hover:bg-primary/90 text-white">
							{isManualView ? "Schließen" : "Jetzt ausprobieren"}
						</Button>
					</div>
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
{/if}
