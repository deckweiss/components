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
	icon: string;
}

export interface DetailedChanges {
	newFeatures: string[];
	improvements: string[];
	bugFixes: string[];
}
