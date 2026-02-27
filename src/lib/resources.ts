import { isRecentlyAdded, isRecentlyUpdated } from "$lib/versions/version-manager";

/**
 * Resources registry
 * Static copy-paste pages with no installation or external links
 */

export interface ResourceItem {
	name: string;
	slug: string;
	description: string;
	/** External URL - when set, clicking the resource opens this link in a new tab */
	link?: string;
	isNew?: boolean;
	isUpdated?: boolean;
}

export const resourcesData: Omit<ResourceItem, "isNew" | "isUpdated">[] = [
	{
		name: "Outsourced Components",
		slug: "outsourced-components",
		description: "Reference list of components from external sources (shadcn, more-shadcn, etc.) used in this project.",
	},
	{
		name: "Glowing Gradient Button",
		slug: "glowing-gradient-button",
		description: "A button component with a glowing gradient background effect.",
		link: "https://tailwindflex.com/@leon-bachmann/glowing-backround-button",
	},
];

/**
 * Get resources sorted alphabetically by name
 */
export function getResources(): ResourceItem[] {
	return [...resourcesData]
		.map((r) => ({
			...r,
			isNew: isRecentlyAdded(r.slug),
			isUpdated: isRecentlyUpdated(r.slug),
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Load resource data for a page
 * Throws 404 if resource not found
 */
export async function loadResourceData(slug: string) {
	const { error } = await import("@sveltejs/kit");

	const resource = resourcesData.find((r) => r.slug === slug);

	if (!resource) {
		error(404, "Resource not found");
		throw new Error("Unreachable");
	}

	return {
		resource: {
			title: resource.name,
			description: resource.description,
			slug: resource.slug,
			link: resource.link,
			isNew: isRecentlyAdded(resource.slug),
			isUpdated: isRecentlyUpdated(resource.slug),
		},
	};
}
