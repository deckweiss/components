import { loadPageTemplateData } from "$lib/registry";

export async function load() {
	return loadPageTemplateData("changelog-page");
}
