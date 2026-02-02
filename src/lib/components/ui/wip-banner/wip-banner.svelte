<script lang="ts">
	import { Construction } from "@lucide/svelte";

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<div class="rounded-xl border border-gray-300 bg-gray-50 p-8 {className}">
	<div class="flex items-start gap-4">
		<div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-500/10">
			<Construction class="size-6  text-gray-500" />
		</div>
		<div class="flex-1">
			<h3 class="text-foreground text-lg font-semibold">Work In Progress</h3>
			<p class="text-muted-foreground text-sm">
				This component is currently under development and will be available soon. Check back later
				for updates!
			</p>
		</div>
	</div>
</div>
