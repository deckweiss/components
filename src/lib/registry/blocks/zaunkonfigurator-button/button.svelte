<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "relative overflow-hidden ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
		variants: {
			variant: {
				default: "bg-red-500 text-primary-foreground hover:bg-primary/90",
				dark: "bg-primary/80 text-primary-foreground hover:bg-primary border border-primary",
				destructive:
					"bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 hover:border-red-500/50 border",
				outline:
					"border-gray-300 bg-white hover:border-muted-foreground/70 hover:bg-secondary text-black border",
				secondary: "bg-white text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				animated:
					'bg-red-500 hover:bg-primary text-primary-foreground after:absolute after:bg-white after:content-[""] after:h-[200%] after:left-[-50%] after:rotate-[35deg] after:opacity-60 after:w-[30px] after:z-10 after:animate-flash animate-pulseGlow',
				grey: "bg-gray-100 text-black hover:bg-gray-300 border-gray-200 hover:border-gray-300 border",
				soft: "text-gray-400 rounded-xl hover:text-black hover:bg-gray-200 focus:outline-none border-0",
				dropDown:
					"rounded-sm bg-transparent hover:text-black hover:bg-gray-100 border border-transparent hover:border-gray-400",
				softOutlined:
					"border border-gray-200 bg-white hover:bg-gray-100 hover:border-gray-300 text-gray-600 hover:text-black",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
				mini: "h-6 w-fit rounded-md p-1",
				macro: "h-3 w-fit rounded-md p-2",
				dropDown: "h-6 w-fit rounded-md p-2 py-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});
</script>

<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";

	let {
		ref = $bindable(null),
		variant,
		size,
		child,
		children,
		class: className,
		...restProps
	}: HTMLButtonAttributes &
		VariantProps<typeof buttonVariants> & {
			child?: Snippet<[{ props: Record<string, unknown> }]>;
			ref?: HTMLElement | null;
		} = $props();

	const mergedProps = $derived({
		...restProps,
		class: cn(buttonVariants({ variant, size }), className),
		"data-slot": "button",
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else if children}
	<button {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</button>
{/if}
