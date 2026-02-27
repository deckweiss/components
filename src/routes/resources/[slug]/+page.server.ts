import { loadResourceData, resourcesData } from "$lib/resources";

export const prerender = true;

export function entries() {
	return resourcesData.map((r) => ({ slug: r.slug }));
}

export async function load({ params }) {
	return loadResourceData(params.slug);
}
