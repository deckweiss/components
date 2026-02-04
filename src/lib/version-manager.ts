/**
 * Version manager for changelog and version tracking
 */

export interface ChangelogEntry {
	version: string;
	date: string;

	changes: {
		type: "added" | "updated" | "fixed" | "removed";
		category: "component" | "util";
		description: string;
		/** Reference to component or util slug if applicable (matches registry.json name field) */
		ref?: string;
	}[];
}

export const changelog: ChangelogEntry[] = [
	/*
		version: "1.0.1",
		date: "2026-02-02",
		changes: [
			{ type: "added", category: "component", description: "Added Dashboard Card component", ref: "dashboard-card" },
		],
	},*/
	{
		version: "1.0.0",
		date: "2026-02-02",
		changes: [
			
			{ type: "added", category: "util", description: "Added formatMeasurementValue utility function", ref: "format-measurement-value" },
			{ type: "updated", category: "component", description: "Updated Data Table component", ref: "data-table" },
		],
	}
];

/**
 * Get changelog entries from the last month
 */
function getLastMonthEntries(): ChangelogEntry[] {
	const now = new Date();
	const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

	return changelog.filter((entry) => {
		const entryDate = new Date(entry.date);
		return entryDate >= oneMonthAgo && entryDate <= now;
	});
}

/**
 * Check if an item was recently added (appears in changelog entries from the last month)
 */
export function isRecentlyAdded(slug: string): boolean {
	const recentEntries = getLastMonthEntries();
	if (recentEntries.length === 0) return false;

	return recentEntries.some((entry) =>
		entry.changes.some((change) => change.type === "added" && change.ref === slug)
	);
}

/**
 * Check if an item was recently updated (appears in changelog entries from the last month)
 */
export function isRecentlyUpdated(slug: string): boolean {
	const recentEntries = getLastMonthEntries();
	if (recentEntries.length === 0) return false;

	return recentEntries.some((entry) =>
		entry.changes.some((change) => change.type === "updated" && change.ref === slug)
	);
}

/**
 * Get the latest version number
 */
export function getLatestVersion(): string {
	return changelog[0]?.version ?? "0.0.0";
}
