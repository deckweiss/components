<script lang="ts">
	import type { Snippet } from "svelte";
	import * as Tabs from "$lib/components/ui/tabs";
	import { Code } from "$lib/components/ui/code";
	import { PMCommand } from "$lib/components/ui/pm-command";
	import { Card } from "$lib/components/ui/card";

	interface Props {
		children?: Snippet;
		code?: string;
		codeLang?: "svelte" | "bash" | "diff" | "javascript" | "json" | "typescript" | undefined;
		componentKey: string;
		name: string;
		description?: string;
		hideInstallation?: boolean;
	}

	let {
		children: previewChildren,
		code,
		componentKey,
		name,
		description,
		codeLang: lang = "svelte",
		hideInstallation = false,
	}: Props = $props();
</script>

<div class="relative flex min-h-[450px] flex-col gap-4 rounded-lg border p-4">
	<div class="flex flex-col sm:pl-3">
		<h2 class="text-2xl font-semibold" id={componentKey}>{name}</h2>
		{#if description}
			<p class="text-muted-foreground text-sm">{description}</p>
		{/if}
	</div>
	<Tabs.Root value={previewChildren ? "preview" : "code"}>
		<Tabs.List class="grid w-full {previewChildren ? 'grid-cols-2' : 'grid-cols-1'}">
			{#if previewChildren}
				<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
			{/if}
			<Tabs.Trigger value="code" disabled={code === undefined}>Code</Tabs.Trigger>
		</Tabs.List>
		<Card>
			{#if previewChildren}
				<Tabs.Content value="preview" class="px-4">
					{@render previewChildren()}
				</Tabs.Content>
			{/if}
			<Tabs.Content value="code">
				{#if code}
					<Code {lang} class="w-full" variant="inline" {code} />
				{/if}
			</Tabs.Content>
		</Card>
	</Tabs.Root>

	{#if !hideInstallation}
		<div class="flex flex-col gap-2">
			<h3 class="text-xl">Installation</h3>
			<PMCommand
				command="execute"
				args={[
					"shadcn-svelte@next",
					"add",
					`https://components.deckweiss.at/r/${componentKey}.json`,
				]}
			/>
		</div>
	{/if}
</div>
