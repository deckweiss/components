<script lang="ts">
	interface Props {
		repo: string;
	}

	let { repo: fullRepo }: Props = $props();

	let user = fullRepo.split("/")[0];
	let repo = fullRepo.split("/")[1];

	$inspect(user, repo);
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/gh/lepture/github-cards@latest/jsdelivr/widget.js"></script>
</svelte:head>

<div class="github-card" data-user={user} data-repo={repo}></div>
