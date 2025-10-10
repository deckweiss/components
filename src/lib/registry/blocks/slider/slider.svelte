<script lang="ts">
	import { Slider } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let { class: className, value = [0], min = 0, max = 10, step = 1, ...restProps } = $props();

	// Convert to state variables
	let stateValue = $state(value);
	let stateMin = $state(min);
	let stateMax = $state(max);
	let stateStep = $state(step);

	// Update state when props change
	$effect(() => {
		stateValue = value;
		stateMin = min;
		stateMax = max;
		stateStep = step;
	});

	// Generate ticks array
	let ticks = $derived(() => {
		const tickArray: number[] = [];
		for (let i = stateMin; i <= stateMax; i += stateStep) {
			tickArray.push(i);
		}
		return tickArray;
	});

	// Generate tick classes
	let tickClasses = $derived(() => {
		return ticks().map((tick) => {
			return tick === stateMin || tick === stateMax ? "bg-primary" : "bg-gray-400";
		});
	});
</script>

<Slider.Root
	bind:value={stateValue}
	min={stateMin}
	max={stateMax}
	step={stateStep}
	type="multiple"
	trackPadding={0}
	class={cn("relative flex w-full touch-none items-center select-none", className)}
	{...restProps}
>
	<span class="relative z-[2] h-[2px] w-full grow overflow-hidden rounded-full bg-gray-400">
		<Slider.Range class="bg-primary absolute h-full" />
	</span>
	{#each ticks() as tick, i}
		<Slider.Tick index={i} class={`absolute z-[1] h-2 w-0.5 ${tickClasses()[i]}`} />
	{/each}

	{#each stateValue as thumb, i}
		<Slider.Thumb
			index={i}
			class="border-primary z-[3] block h-4 w-4 rounded-full border-1 border-2 bg-white transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
		/>
	{/each}
</Slider.Root>
