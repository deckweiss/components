<script lang="ts">
	import { page } from "$app/state";
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLAnchorElement> {
		href: string;
		badge?: number | string;
		children: Snippet;
	}

	let { href, class: className, children, badge, ...restProps }: Props = $props();

	let isActive = $derived(page.url.pathname.startsWith(href));
</script>

<a
	{href}
	class={cn(
		[
			"flex h-[48px] items-center gap-1.5 border-b-2 border-b-transparent px-3 py-2.5 text-sm",
			isActive ? "border-b-[#000000]  text-[#000000]" : "text-[#545353] hover:border-b-[#bebebe]",
		].join(" "),
		className
	)}
	{...restProps}
>
	<span>
		{@render children?.()}
	</span>

	{#if badge}
		<span class="rounded-full bg-black/5 px-1 py-0.5 text-xs font-semibold text-black">
			{badge}
		</span>
	{/if}
</a>
