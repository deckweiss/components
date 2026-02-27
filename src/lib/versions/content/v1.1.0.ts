import type { VersionData } from "$lib/versions/types";

export const versionData: VersionData = {
	version: "v1.1.0",
	date: "26. Februar 2026",
	title: "Update Popup and new Categories",
	learnMoreUrl: "/changelog",
	changes: [
		{
			title: "Update Popup",
			description: "Added Update Popup component alongside a version manager",
			icon: "SparklesIcon",
		},
		{
			title: "Resources Category",
			description: "Added new category for copy-paste code snippets",
			icon: "FileIcon",
		},
		{
			title: "Page Templates Category",
			description: "Added new category for ready-to-use pages",
			icon: "LayoutTemplateIcon",
		},
	],
	detailedChanges: {
		newFeatures: [
			'Added new category "Resources" for copy-paste code snippets',
			'Added new category "Page Templates" for ready-to-use pages',
			"Added sidebar items for viewing all components, utils, resources and page templates",
			"Added Update Popup component alongside a version manager",
			"Added Changelog Page as first entry in the Page Templates category",
			"Added Glowing Gradient Button resource",
		],
		improvements: [],
		bugFixes: [],
	},
};
