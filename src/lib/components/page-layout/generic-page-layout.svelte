<script lang="ts">
	import type { Snippet } from "svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { ArrowLeft, Construction, Sparkles, Repeat } from "@lucide/svelte";

	interface Props {
		backHref: string;
		badgeIcon?: any;
		badgeText: string;
		isNew?: boolean;
		isWip?: boolean;
		isUpdated?: boolean;
		title: string;
		description: string;
		children: Snippet;
	}

	let {
		backHref,
		badgeIcon,
		badgeText,
		isNew,
		isWip,
		isUpdated,
		title,
		description,
		children,
	}: Props = $props();
</script>

<div class="mx-auto max-w-4xl px-6 py-12">
	<!-- Back link -->
	<a
		href={backHref}
		class="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
	>
		<ArrowLeft class="size-4" />
		Back
	</a>

	<!-- Header -->
	<div class="mb-6">
		<div class="mb-4 flex items-center gap-1">
			<Badge variant="secondary" class="flex items-center gap-1">
				{@const Icon = badgeIcon}
				<Icon />
				<span>{badgeText}</span>
			</Badge>
			{#if isWip}
				<Badge class="flex items-center gap-1 bg-gray-500/10 text-gray-500">
					<Construction />
					<span>Work in Progress</span>
				</Badge>
			{/if}
			{#if isNew}
				<Badge class="flex items-center gap-1 bg-emerald-500/10 text-emerald-500">
					<Sparkles />
					<span>New</span>
				</Badge>
			{/if}
			{#if isUpdated}
				<Badge class="flex items-center gap-1 bg-blue-500/10 text-blue-500">
					<Repeat />
					<span>Updated</span>
				</Badge>
			{/if}
		</div>
		<h1 class="text-foreground mb-2 text-4xl font-bold tracking-tight">
			{title}
		</h1>
		<p class="text-muted-foreground max-w-2xl text-lg">
			{description}
		</p>
	</div>

	<!-- Content -->
	{@render children()}
</div>
