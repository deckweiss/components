<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import example2Code from "./example2-code.txt?raw";
	import { Button } from "$lib/components/ui/button";
	import { toaster } from "$lib/registry/blocks/custom-toast/index.js";
	import { Toaster } from "$lib/registry/ui/sonner";
	import { toast } from "svelte-sonner";

	let { data } = $props();

	// Single Toaster position - defaults to bottom-left
	let toasterPosition = $state<"bottom-left" | "top-right">("bottom-left");
</script>

<!-- Single Toaster instance at page level - position controlled by state -->
<Toaster position={toasterPosition} offset="20px" />

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<div class="flex flex-col gap-3">
							<Button
								onclick={() => {
									// Dismiss all toasts if position is changing
									if (toasterPosition !== "bottom-left") {
										toast.dismiss();
									}
									toasterPosition = "bottom-left";
									toaster.pushToast({ message: "Success!", variant: "success" });
								}}
							>
								Show Success
							</Button>
							<Button
								onclick={() => {
									if (toasterPosition !== "bottom-left") {
										toast.dismiss();
									}
									toasterPosition = "bottom-left";
									toaster.pushToast({ message: "Error occurred", variant: "error" });
								}}
								variant="destructive"
							>
								Show Error
							</Button>
							<Button
								onclick={() => {
									if (toasterPosition !== "bottom-left") {
										toast.dismiss();
									}
									toasterPosition = "bottom-left";
									toaster.pushToast({ message: "Loading...", variant: "loading" });
								}}
								variant="outline"
							>
								Show Loading
							</Button>
						</div>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}

	{#snippet remainingExamples()}
		<section class="mt-8 flex flex-col gap-4">
			<div>
				<h2 class="text-foreground my-4 text-2xl font-semibold">Positioning</h2>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<div class="flex flex-col gap-3">
							<Button
								onclick={() => {
									// Dismiss all toasts if position is changing
									if (toasterPosition !== "top-right") {
										toast.dismiss();
									}
									toasterPosition = "top-right";
									toaster.pushToast({ message: "Toast opened at top right", variant: "success" });
								}}
							>
								Open top right
							</Button>
						</div>
					</div>
				</Card>

				<Code code={example2Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>
