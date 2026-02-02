<script lang="ts">
	import { EyeOff } from "@lucide/svelte";

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<div class="rounded-xl border border-gray-300 bg-gray-50 p-8 {className}">
	<div class="flex items-start gap-4">
		<div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-500/10">
			<EyeOff class="size-6  text-gray-500" />
		</div>
		<div class="flex-1">
			<h3 class="text-foreground text-lg font-semibold">No Preview Available</h3>
			<p class="text-muted-foreground text-sm">
				This component cannot be previewed here because this repository is statically deployed.
				Static deployment means the site is pre-built and served as static files, without a server
				that can run interactive components. For the best experience, we recommend installing this
				component in your own project and trying it out there.
			</p>
		</div>
	</div>
</div>
