<script lang="ts">
	import { browser } from "$app/environment";
	import { withPosthog } from "./analytics";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import * as Select from "$lib/components/ui/select";
	import MessageCircle from "@lucide/svelte/icons/message-circle";
	import CheckCircle2 from "@lucide/svelte/icons/check-circle-2";

	interface Props {
		/** The name of the app using this component (e.g., 'montageplaner', 'hr-manager') */
		appName?: string;
		/** Optional custom feedback types */
		feedbackTypes?: Array<{ value: string; label: string; emoji: string }>;
		/** Optional custom button position */
		position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	}

	let {
		appName = "montageplaner",
		feedbackTypes: customFeedbackTypes,
		position = "bottom-right",
	}: Props = $props();

	let dialogOpen = $state(false);
	let feedbackType = $state<string>("comment");
	let feedbackText = $state("");
	let isSubmitting = $state(false);
	let showSuccess = $state(false);

	const defaultFeedbackTypes = [
		{ value: "bug", label: "Fehler melden", emoji: "🐛" },
		{ value: "feature", label: "Feature-Anfrage", emoji: "✨" },
		{ value: "comment", label: "Kommentar", emoji: "💬" },
	];

	const feedbackTypes = customFeedbackTypes || defaultFeedbackTypes;

	const positionClasses = {
		"bottom-right": "bottom-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"top-right": "top-4 right-4",
		"top-left": "top-4 left-4",
	};

	function handleOpen() {
		dialogOpen = true;
		feedbackText = "";
		feedbackType = "comment";
		showSuccess = false;
	}

	async function handleSubmit() {
		if (!feedbackText.trim()) {
			return;
		}

		isSubmitting = true;

		// Capture the feedback values before clearing them
		const feedbackToSend = feedbackText.trim();
		const typeToSend = feedbackType;

		try {
			// Send feedback to PostHog
			await withPosthog((posthog) => {
				const eventProperties = {
					type: typeToSend,
					feedback: feedbackToSend,
					source: "feedback_button",
					app: appName,
				};
				posthog.capture("feedback_submitted", eventProperties);
			});

			// Show success message
			showSuccess = true;
			feedbackText = "";

			// Close dialog after 1.5 seconds
			setTimeout(() => {
				dialogOpen = false;
				showSuccess = false;
			}, 1500);
		} catch (error) {
			console.error("Failed to submit feedback:", error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleClose() {
		dialogOpen = false;
		feedbackText = "";
		feedbackType = "comment";
		showSuccess = false;
	}

	// Reset form when dialog closes
	$effect(() => {
		if (!dialogOpen) {
			feedbackText = "";
			feedbackType = "comment";
			showSuccess = false;
			isSubmitting = false;
		}
	});
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Button
		type="button"
		onclick={handleOpen}
		class="group fixed {positionClasses[
			position
		]} z-50 flex h-12 min-w-12 items-center justify-center gap-0 overflow-hidden rounded-full bg-blue-600 p-0 text-white shadow-lg transition-[width,gap,padding] duration-300 ease-in-out hover:min-w-[120px] hover:justify-start hover:gap-2 hover:px-4"
		aria-label="Feedback senden"
	>
		<MessageCircle class="size-5 shrink-0" />
		<span
			class="max-w-0 overflow-hidden font-medium whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-300 ease-in-out group-hover:max-w-[200px] group-hover:opacity-100"
			>Feedback</span
		>
	</Button>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Feedback senden</Dialog.Title>
			<Dialog.Description>Teile uns deine Meinung mit</Dialog.Description>
		</Dialog.Header>

		{#if showSuccess}
			<div class="flex flex-col items-center justify-center gap-4 py-8">
				<CheckCircle2 class="size-12 text-green-600" />
				<div class="space-y-1 text-center">
					<p class="text-lg font-medium">Vielen Dank!</p>
					<p class="text-muted-foreground text-sm">Dein Feedback wurde erfolgreich übermittelt.</p>
				</div>
			</div>
		{:else}
			<div class="space-y-4 py-4">
				<div class="space-y-2">
					<Label for="feedback-type">Art des Feedbacks</Label>
					<Select.Root type="single" bind:value={feedbackType}>
						<Select.Trigger id="feedback-type">
							{#if feedbackType}
								{@const selectedType = feedbackTypes.find((t) => t.value === feedbackType)}
								{#if selectedType}
									<span class="flex items-center gap-2">
										<span>{selectedType.emoji}</span>
										<span>{selectedType.label}</span>
									</span>
								{:else}
									Art auswählen
								{/if}
							{:else}
								<span class="text-muted-foreground">Art auswählen</span>
							{/if}
						</Select.Trigger>
						<Select.Content>
							{#each feedbackTypes as type}
								<Select.Item value={type.value} label={type.label}>
									<span class="flex items-center gap-2">
										<span>{type.emoji}</span>
										<span>{type.label}</span>
									</span>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="space-y-2">
					<Label for="feedback-text">Dein Feedback</Label>
					<textarea
						id="feedback-text"
						bind:value={feedbackText}
						placeholder="Beschreibe dein Feedback..."
						class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isSubmitting}
					></textarea>
				</div>
			</div>

			<Dialog.Footer>
				<Button variant="outline" onclick={handleClose} disabled={isSubmitting}>Abbrechen</Button>
				<Button onclick={handleSubmit} disabled={isSubmitting || !feedbackText.trim()}>
					{isSubmitting ? "Wird gesendet..." : "Senden"}
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
