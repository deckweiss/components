<script lang="ts">
	import { type Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type Props = {
		containerClass?: string;
		loading?: Snippet;
		error?: Snippet;
	};

	let {
		containerClass: containerClassName,
		loading: loadingChildren,
		error: errorChildren,
		...props
	}: Props & HTMLImageElement = $props();

	let status = $state<'loading' | 'error' | 'loaded'>('loading');
</script>

<div class={containerClassName}>
	{#if status === 'loading'}
		{#if loadingChildren}
			{@render loadingChildren()}
		{:else}
			loading
		{/if}
	{:else if status === 'error'}
		{#if errorChildren}
			{@render errorChildren()}
		{:else}
			error
		{/if}
	{/if}

	{#if status !== 'error'}
		<img
			{...props}
			onload={() => (status = 'loaded')}
			onerror={() => (status = 'error')}
			class={cn(props['class'], status !== 'loaded' ? 'hidden' : '')} />
	{/if}
</div>
