<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";

	interface Props extends HTMLAttributes<HTMLButtonElement> {
		badge?: number | string;
		children?: Snippet;
	}

	let { badge, class: className, children, ...restProps }: Props = $props();
</script>

<button
	type="button"
	class={cn(
		"flex size-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[#f4f4f5] px-4 py-2",
		className
	)}
	{...restProps}
>
	<div class="relative size-4 shrink-0 overflow-clip text-[#18181b]">
		{@render children?.()}
	</div>

	{#if badge}
		<div
			class="absolute top-0 right-0 flex w-5 items-center justify-center gap-2.5 rounded-full border border-transparent bg-[#18181b] p-0.5"
		>
			<p class="shrink-0 text-xs leading-4 font-semibold tracking-normal text-[#fafafa] not-italic">
				{badge}
			</p>
		</div>
	{/if}
</button>
