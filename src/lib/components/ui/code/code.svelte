<script lang="ts">
	import { cn } from "$lib/utils";
	import { tv, type VariantProps } from "tailwind-variants";
	import { highlighter, type SupportedLanguage } from "./shiki";
	import DOMPurify from "isomorphic-dompurify";
	import { onMount } from "svelte";
	import type { HighlighterCore } from "shiki";
	import { CopyButton } from "$lib/components/ui/copy-button";

	const style = tv({
		base: "not-prose relative h-full max-h-[650px] overflow-auto shadow-md rounded-b-lg border",
		variants: {
			variant: {
				inline: "border-none",
				default: "border-border bg-gray-50",
				secondary: "bg-secondary/50 border-transparent",
			},
		},
	});

	type Variant = VariantProps<typeof style>["variant"];

	type Props = {
		variant?: Variant;
		lang?: SupportedLanguage;
		code: string;
		class?: string;
		copyButtonContainerClass?: string;
		hideLines?: boolean;
		hideCopy?: boolean;
		highlight?: (number | [number, number])[];
	};

	const within = (num: number, range: Props["highlight"]) => {
		if (!range) {
			return false;
		}

		let within = false;

		for (const r of range) {
			if (typeof r === "number") {
				if (num === r) {
					within = true;
					break;
				}
				continue;
			}

			if (r[0] <= num && num <= r[1]) {
				within = true;
				break;
			}
		}

		return within;
	};

	let {
		variant = "default",
		lang = "typescript",
		code,
		copyButtonContainerClass = undefined,
		class: className = undefined,
		hideLines = false,
		hideCopy = false,
		highlight = [],
	}: Props = $props();

	let hl = $state<HighlighterCore>();

	// Process code to handle "**" lines
	const processedCode = $derived(() => {
		const lines = code.split("\n");
		const processedLines: string[] = [];
		const highlightLines: number[] = [];

		lines.forEach((line, index) => {
			if (line.startsWith("**")) {
				// Remove "**" from the start of the line
				const cleanedLine = line.slice(2);
				processedLines.push(cleanedLine);
				highlightLines.push(index + 1); // Line numbers are 1-indexed
			} else {
				processedLines.push(line);
			}
		});

		return {
			code: processedLines.join("\n"),
			highlightLines,
		};
	});

	const highlighted = $derived(
		DOMPurify.sanitize(
			hl?.codeToHtml(processedCode().code, {
				lang: lang,
				themes: {
					light: "github-light-default",
					dark: "github-dark-default",
				},
				transformers: [
					{
						pre: (el) => {
							el.properties.style = "";

							if (!hideLines) {
								el.properties.class += " line-numbers";
							}

							return el;
						},
						line: (node, line) => {
							// Check if line should be highlighted from "**" marker
							if (processedCode().highlightLines.includes(line)) {
								node.properties.class =
									(node.properties.class || "") + " line--highlighted-asterisk";
							}

							// Check if line should be highlighted from highlight prop
							if (within(line, highlight)) {
								node.properties.class = (node.properties.class || "") + " line--highlighted";
							}

							return node;
						},
					},
				],
			}) ?? processedCode().code
		)
	);

	onMount(() => {
		highlighter.then((highlighter) => (hl = highlighter));
	});
</script>

<div class={cn(style({ variant }), className)}>
	{@html highlighted}
	{#if !hideCopy}
		<div
			class={cn(
				"absolute top-2 right-2 flex place-items-center justify-center",
				copyButtonContainerClass
			)}
		>
			<CopyButton text={processedCode().code} />
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference '../../../../app.css'

  :global(.dark) {
		:global(.shiki, .shiki span) {
			color: var(--shiki-dark) !important;
			font-style: var(--shiki-dark-font-style) !important;
			font-weight: var(--shiki-dark-font-weight) !important;
			text-decoration: var(--shiki-dark-text-decoration) !important;
		}
	}

	/* Shiki see: https://shiki.matsu.io/guide/dual-themes#class-based-dark-mode */
	:global(html.dark .shiki, html.dark .shiki span) {
		color: var(--shiki-dark) !important;
		font-style: var(--shiki-dark-font-style) !important;
		font-weight: var(--shiki-dark-font-weight) !important;
		text-decoration: var(--shiki-dark-text-decoration) !important;
	}

	:global(pre.shiki) {
		@apply overflow-auto rounded-lg bg-inherit py-4 text-sm;
		max-height: min(100%, 650px);
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	:global(pre.shiki::-webkit-scrollbar) {
		display: none;
	}

	:global(pre.shiki code) {
		@apply grid min-w-full rounded-none border-0 bg-transparent p-0 break-words;
		counter-reset: line;
		box-decoration-break: clone;
	}

	:global(pre.line-numbers) {
		counter-reset: step;
		counter-increment: step 0;
	}

	:global(pre.line-numbers .line::before) {
		content: counter(step);
		counter-increment: step;
		display: inline-block;
		width: 1.8rem;
		margin-right: 1.4rem;
		text-align: right;
	}

	:global(pre.line-numbers .line::before) {
		@apply text-muted-foreground;
	}

	:global(pre .line.line--highlighted) {
		@apply bg-secondary;
	}

	:global(pre .line.line--highlighted span) {
		@apply relative;
	}

	:global(pre .line.line--highlighted-asterisk) {
		@apply border-l-2 border-blue-500 bg-blue-50;
	}

	:global(pre .line) {
		@apply inline-block min-h-4 w-full px-4 py-0.5;
	}

	:global(pre.line-numbers .line) {
		@apply px-2;
	}
</style>
