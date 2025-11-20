import type { Snippet } from "svelte";

export const NAVBAR_CONTEXT_KEY = Symbol("navbar-context");

export type LinkInfo = {
	id: symbol;
	label: Snippet;
	href?: string;
	onclick?: () => void;
	visible: boolean;
};

export type NavbarContext = {
	registerLink: (info: { label: Snippet; href?: string; onclick?: () => void }) => {
		id: symbol;
		linkInfo: LinkInfo; // Reference to linkInfo for tracking visibility
		unregister: () => void;
	};
};
