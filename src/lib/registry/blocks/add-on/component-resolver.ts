import type { Component } from "svelte";
import type { AddOnComponentProps, AddOnType } from "./types";

export async function resolveComponent(
	component: AddOnType
): Promise<Component<AddOnComponentProps>> {
	switch (component) {
		// TODO: replace with actual add-ons
		case "example-add-on":
			return (await import("$lib/components/example-add-on.svelte")).default;
		default:
			throw new Error(`Unknown add-on type: ${component}`);
	}
}
