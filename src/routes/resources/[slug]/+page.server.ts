import { loadResourceData } from "$lib/resources";

export async function load({ params }) {
	return loadResourceData(params.slug);
}
