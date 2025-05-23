<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { XIcon } from "@lucide/svelte";
	import { Button } from "$lib/registry/ui/button";
	import type { Toast as ToastType } from "./toaster.ts";

	let { type, message, action }: ToastType = $props();

	const dispatch = createEventDispatcher();

	let typeClasses = {
		default: "bg-primary",
		success: "bg-[#275E2E]",
		error: "bg-[#841106]",
	};

	let typeOverline = {
		default: "Info",
		success: "Erfolg",
		error: "Fehler",
	};
</script>

<div
	class={['flex min-w-[250px] flex-col gap-4 rounded-lg p-5 md:max-w-[350px]', typeClasses[type]]}
>
	<span class="text-micro-md font-bold uppercase text-cool-grey-600">
		{typeOverline[type]}
	</span>
	<p class="max-w-[250px] text-sm">
		{message}
	</p>
	<div class="flex gap-2">
		{#if action}
			<Button onclick={action.callback}>{action.text}</Button>
		{/if}
		<Button onclick={() => dispatch('closeToast')}>Discard</Button>
	</div>
	<button
		onclick={() => dispatch('closeToast')}
		class="absolute right-4 top-4 h-6 w-6 rounded-lg bg-white/10 p-1 text-white"
	>
		<XIcon size="16" />
	</button>
</div>
