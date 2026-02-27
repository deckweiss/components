import { WrenchIcon, TableIcon } from "@lucide/svelte";
import type { VersionData } from "$lib/versions/types";

export const versionData: VersionData = {
	version: "v1.0.0",
	date: "2. Februar 2026",
	title: "Initial Release",
	learnMoreUrl: "/changelog",
	changes: [
		{
			title: "New Utility: Format Measurement Value",
			description: "Utility for formatting measurement values",
			icon: WrenchIcon,
		},
		{
			title: "Updated Data Table",
			description: "Updated Data Table component",
			icon: TableIcon,
		},
	],
	detailedChanges: {
		newFeatures: ["Added format-measurement-value utility function"],
		improvements: [
			"Updated Data Table component with improved filtering, sorting, responsiveness and more more text for a second line",
		],
		bugFixes: [],
	},
};
