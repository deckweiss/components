<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		links?: Array<{ label: string; href?: string }>;
		children?: Snippet;
		appName?: string;
		right?: Snippet;
		logo?: Snippet;
	}

	let {
		links = [],
		class: className,
		logo,
		right,
		children,
		appName,
		...restProps
	}: Props = $props();
</script>

<div
	class={cn(
		"flex h-[64px] w-full items-center justify-center gap-4 border-b border-[#e8e8e8] bg-white",
		className
	)}
	{...restProps}
>
	<div class="flex min-h-0 min-w-0 flex-1 items-center justify-between px-8 py-0">
		<!-- Left Section: Logo and Navigation Links -->
		<div class="flex items-center gap-4">
			<!-- Logo and Title -->
			<div class="flex items-center gap-1.5">
				<div class="relative size-6 shrink-0">
					{@render logo?.()}
				</div>
				<p class="shrink-0 text-xs leading-[1.2] font-bold tracking-normal text-black">
					{appName ?? ""}
				</p>
			</div>

			<!-- Navigation Links -->
			<div class="flex cursor-pointer items-center gap-2">
				{@render children?.()}
			</div>
		</div>

		<!-- Right Section: Notifications -->
		<div class="flex items-center gap-3">
			<div class="relative flex items-center gap-2">
				{@render right?.()}
			</div>
		</div>
	</div>
</div>
