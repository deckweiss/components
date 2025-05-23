<script lang="ts">
	import { Progress } from "$lib/registry/ui/progress";
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import type { BeforeNavigate, AfterNavigate } from "@sveltejs/kit";
	import { Tween } from "svelte/motion";
	import { cubicInOut } from "svelte/easing";
	import { pageLoading } from "./page-progress-state.svelte";

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();

	let progress = new Tween(0, {
		duration: 100,
		easing: cubicInOut,
	});
	let showProgress = $state(false);

	function shouldAnimate(nav: BeforeNavigate | AfterNavigate) {
		return (
			nav.from?.url.pathname !== nav.to?.url.pathname || nav.to?.url.search !== nav.from?.url.search
		);
	}

	$effect(() => {
		if (pageLoading.invocers.length > 0) {
			startProgressing();
		} else {
			stopProgressing();
		}
	});

	function startProgressing() {
		showProgress = true;

		progress.set(33).then(() => {
			if (progress.current === 33) {
				progress.target = 66;
			}
		});
	}

	function stopProgressing() {
		progress.set(100).then(() => {
			setTimeout(() => {
				showProgress = false;

				setTimeout(() => {
					progress.target = 0;
				}, 300);
			}, 500);
		});
	}

	beforeNavigate((nav) => {
		if (!shouldAnimate(nav)) {
			return;
		}

		startProgressing();
	});

	afterNavigate((nav) => {
		if (!shouldAnimate(nav)) {
			showProgress = false;
			progress.target = 0;
			return;
		}

		stopProgressing();

		pageLoading.invocers = [];
	});
</script>

<Progress
	value={progress.current}
	class={[
		'h-1 rounded-none transition-opacity duration-300 ease-in-out',
		className,
		showProgress ? 'opacity-100' : 'opacity-0'
	]}
/>
