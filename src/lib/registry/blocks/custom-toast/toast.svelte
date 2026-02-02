<script lang="ts">
	import { XIcon, LoaderCircle } from "@lucide/svelte";
	import { Button } from "$lib/registry/ui/button";
	import { toast } from "svelte-sonner";
	import { cn } from "$lib/utils.js";
	import type { Toast as ToastType } from "./custom-toast.js";
	import { tv, type VariantProps } from "tailwind-variants";

	interface Props extends ToastType {
		dismiss?: () => void;
		class?: string;
		border?: VariantProps<typeof toastVariants>["border"];
	}

	let { variant = "default", message, action, dismiss, class: className, border }: Props = $props();

	function dismissToast() {
		if (dismiss) {
			dismiss();
		} else {
			// Fallback: try to find and remove the toast wrapper
			const wrapper = document.querySelector("[data-sonner-toast]:last-child");
			if (wrapper) {
				wrapper.remove();
			} else {
				toast.dismiss();
			}
		}
	}

	export const toastVariants = tv({
		base: "relative flex min-w-[250px] flex-col gap-4 rounded-lg p-5 md:max-w-[350px]",
		variants: {
			variant: {
				default: "bg-primary text-white",
				success: "bg-green-700 text-white",
				error: "bg-red-700 text-white",
				loading: "bg-blue-700 text-white",
			},
			border: {
				none: "",
				sm: "border",
				md: "border-2",
				lg: "border-4",
			},
		},
		defaultVariants: {
			variant: "default",
			border: "none",
		},
	});

	export const closeButtonVariants = tv({
		base: "absolute top-4 right-4 h-6 w-6 rounded-lg bg-white/10 p-1 transition-colors hover:bg-white/20",
		variants: {
			variant: {
				default: "text-white",
				success: "text-white",
				error: "text-white",
				loading: "text-white",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export const overlineVariants = tv({
		base: "text-micro-md font-bold uppercase",
		variants: {
			variant: {
				default: "text-white/80",
				success: "text-white/80",
				error: "text-white/80",
				loading: "text-white/80",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export const messageVariants = tv({
		base: "max-w-[250px] text-sm",
		variants: {
			variant: {
				default: "text-white",
				success: "text-white",
				error: "text-white",
				loading: "text-white",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	const variantOverline = {
		default: "Info",
		success: "Erfolg",
		error: "Fehler",
		loading: "Lädt",
	};
</script>

<div class={cn(toastVariants({ variant, border }), className)}>
	<div class="flex items-start gap-3">
		<div class="flex-1">
			<span class={overlineVariants({ variant })}>
				{variantOverline[variant]}
			</span>
			<div class="flex items-center gap-2">
				{#if variant === "loading"}
					<LoaderCircle class="mt-0.5 h-4 w-4 animate-spin text-white" />
				{/if}
				<p class={messageVariants({ variant })}>
					{message}
				</p>
			</div>
		</div>
	</div>
	<div class="flex gap-2">
		{#if action}
			<Button onclick={action.callback}>{action.text}</Button>
		{/if}
	</div>
	<button onclick={dismissToast} class={closeButtonVariants({ variant })}>
		<XIcon size="16" />
	</button>
</div>
