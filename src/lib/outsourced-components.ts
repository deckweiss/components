/**
 * Outsourced components registry
 * Components from external sources with title, link, and source identification
 */

export type ComponentSource = "deckweiss" | "shadcn" | "shadcn-svelte-extras" | "more-shadcn";

export interface OutsourcedComponent {
	title: string;
	link: string;
	source: ComponentSource;
	description?: string;
}

export const outsourcedComponents: OutsourcedComponent[] = [
	{
	 	title: "Button",
		link: "https://shadcn-svelte.com/docs/components/button",
		source: "shadcn",
	},
	{
		title: "Badge",
	   	link: "https://shadcn-svelte.com/docs/components/badge",
		source: "shadcn",
	},
	{
		title: "Card",
		link: "https://shadcn-svelte.com/docs/components/card",
		source: "shadcn",
	},
	{
		title: "Dialog",
		link: "https://shadcn-svelte.com/docs/components/dialog",
		source: "shadcn",
	},
	{
		title: "Dropdown Menu",
		link: "https://shadcn-svelte.com/docs/components/dropdown-menu",
		source: "shadcn",
	},
	{
		title: "Walkthrough",
		link: "https://more-shadcn.noair.fun/components/walkthrough",
		source: "more-shadcn",
	},
	{
		title: "Stepper",
		link: "https://shadcn-svelte-extras.com/components/stepper",
		source: "shadcn-svelte-extras",
	}
];
