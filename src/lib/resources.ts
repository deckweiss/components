/**
 * Resources registry
 * Static copy-paste pages with no installation or external links
 */

export interface ResourceItem {
	name: string;
	slug: string;
	description: string;
}

export const resourcesData: ResourceItem[] = [
	{
		name: "Outsourced Components",
		slug: "outsourced-components",
		description: "Reference list of components from external sources (shadcn, more-shadcn, etc.) used in this project.",
	},
];

/**
 * Get resources sorted alphabetically by name
 */
export function getResources(): ResourceItem[] {
	return [...resourcesData].sort((a, b) => a.name.localeCompare(b.name));
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
		},
	};
}
