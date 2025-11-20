<script lang="ts">
	import { cn } from "$lib/utils";
	import { UserIcon } from "@lucide/svelte";
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		iconColorClass?: string;
	}

	const { children, iconColorClass: iconColorClassProp }: Props = $props();
	let iconColorClass = $derived(iconColorClassProp ?? "bg-[#898989]");
</script>

<div class="flex min-w-[150px] cursor-pointer items-center space-x-2 p-2 pr-0">
	<div class="flex-1 text-right text-xs text-[13px] font-semibold whitespace-nowrap text-[#545353]">
		{@render children?.()}
	</div>
	<div class={cn("flex size-6 shrink-0 items-center justify-center rounded-[4px]", iconColorClass)}>
		<UserIcon class="text-[#ffffff]" size={16} />
	</div>
</div>
