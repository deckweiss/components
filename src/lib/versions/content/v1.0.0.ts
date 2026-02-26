import type { VersionData } from "$lib/versions/types";

export const versionData: VersionData = {
	version: "v1.0.0",
	date: "2. Februar 2026",
	title: "Initial Release",
	learnMoreUrl: "/changelog",
	changes: [
		{
			title: "Format Measurement Value",
			description: "Utility for formatting measurement values",
			icon: "RocketIcon",
		},
		{
			title: "Data Table",
			description: "Updated Data Table component",
			icon: "TrendingUpIcon",
		},
	],
	detailedChanges: {
		newFeatures: ["Added format-measurement-value utility function"],
		improvements: ["Updated Data Table component"],
		bugFixes: [],
	},
};
