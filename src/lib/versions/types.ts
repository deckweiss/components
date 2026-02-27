import type { Component } from "svelte";

export interface VersionData {
	version: string;
	date: string;
	title: string;
	changes: ChangeEntry[];
	detailedChanges: DetailedChanges;
	/** Optional URL for "Learn More" link. When omitted, the link is hidden. */
	learnMoreUrl?: string;
}

export interface ChangeEntry {
	title: string;
	description: string;
	/** Svelte component for the icon (e.g. from @lucide/svelte). Import in the version content file and pass directly. */
	icon?: Component;
}

export interface DetailedChanges {
	newFeatures: string[];
	improvements: string[];
	bugFixes: string[];
}
