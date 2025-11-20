<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}

	let { children, class: className, ...restProps }: Props = $props();
</script>

<div
	class={cn(
		"flex h-[48px] w-full items-center justify-start gap-2 border-b border-[#E8E8E8] bg-white px-8",
		className
	)}
	{...restProps}
>
	{@render children()}
</div>
