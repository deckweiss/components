import { writable } from "svelte/store";
import { versionData as v1_0_0 } from "./content/v1.0.0";
import { versionData as v1_1_0 } from "./content/v1.1.0";
import type { VersionData } from "./types";

/** When set, the update popup will show this version */
export const versionPopupToShow = writable<VersionData | null>(null);

export function showVersionHighlights(version: VersionData): void {
	versionPopupToShow.set(version);
}

// Add all version data here
const versions: VersionData[] = [v1_0_0, v1_1_0];

// Sort versions by version number (ascending - oldest first)
const sortedVersions = [...versions].sort((a, b) => {
	const aVersion = a.version.replace(/^v/, "");
	const bVersion = b.version.replace(/^v/, "");
	return aVersion.localeCompare(bVersion, undefined, { numeric: true });
});

/** Changelog for the changelog page (newest first) */
export function getChangelog(): VersionData[] {
	return [...sortedVersions].reverse();
}

export function getLatestVersion(): VersionData {
	return sortedVersions[sortedVersions.length - 1];
}

export function getAllVersions(): VersionData[] {
	return sortedVersions;
}

/**
 * Check if ref matches slug (ref is full path like "/components/update-popup")
 */
function refMatchesSlug(ref: string | undefined, slug: string): boolean {
	if (!ref) return false;
	return ref.endsWith("/" + slug) || ref === slug;
}

/**
 * Get changelog entries from the last 30 days
 */
function getLastMonthEntries(): VersionData[] {
	const now = new Date();
	const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

	return sortedVersions.filter((entry) => {
		const entryDate = new Date(entry.date);
		return entryDate >= oneMonthAgo && entryDate <= now;
	});
}

/**
 * Check if an item was recently added (appears in changelog entries from the last 30 days)
 */
export function isRecentlyAdded(slug: string): boolean {
	const recentEntries = getLastMonthEntries();
	if (recentEntries.length === 0) return false;

	return recentEntries.some((entry) =>
		entry.detailedChanges.newFeatures?.some((feature) =>
			feature.replaceAll(" ", "-").toLowerCase().includes(slug.replaceAll(" ", "-").toLowerCase())
		)
	);
}

/**
 * Check if an item was recently updated (appears in changelog entries from the last 30 days)
 */
export function isRecentlyUpdated(slug: string): boolean {
	const recentEntries = getLastMonthEntries();
	if (recentEntries.length === 0) return false;

	return recentEntries.some((entry) =>
		entry.detailedChanges.improvements?.some((improvement) =>
			improvement
				.replaceAll(" ", "-")
				.toLowerCase()
				.includes(slug.replaceAll(" ", "-").toLowerCase())
		)
	);
}

export function getStoredVersion(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("hasSeenVersion");
}

export function setStoredVersion(version: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem("hasSeenVersion", version);
}

export function getVersionsToShow(): VersionData[] {
	const storedVersion = getStoredVersion();

	if (!storedVersion) {
		return sortedVersions;
	}

	// Find the index of the stored version
	const storedIndex = sortedVersions.findIndex((v) => v.version === storedVersion);

	if (storedIndex === -1) {
		return sortedVersions;
	}

	// Return all versions after the stored version
	return sortedVersions.slice(storedIndex + 1);
}

export function hasNewVersions(): boolean {
	const versionsToShow = getVersionsToShow();
	return versionsToShow.length > 0;
}

// Debug function to help with testing
export function debugVersionState() {
	console.log("Debug Version State:", {
		storedVersion: getStoredVersion(),
		allVersions: getAllVersions().map((v) => v.version),
		versionsToShow: getVersionsToShow().map((v) => v.version),
		hasNewVersions: hasNewVersions(),
	});
}
