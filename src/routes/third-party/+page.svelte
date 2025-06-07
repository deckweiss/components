<script lang="ts">
	import GithubCard from "$lib/components/github-card.svelte";
</script>

<div class="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
	<header class="flex flex-col gap-1">
		<h1 class="text-3xl font-bold tracking-tight">Deckweiss Component Registry</h1>
		<p class="text-muted-foreground">
			A custom registry for distributing code using shadcn-svelte.
		</p>
		<br />
		<p>Use these first:</p>
		<ul class="ml-5 list-disc">
			<li>
				<a href="https://next.shadcn-svelte.com">ShadCn Svelte</a>
			</li>
			<li>
				<a href="https://www.shadcn-svelte-extras.com">ShadCn Svelte Extras</a>
			</li>
		</ul>
	</header>
	<main class="flex flex-1 flex-col gap-8">
		<GithubCard repo="ndom91/svelte-infinite" />
	</main>
</div>
