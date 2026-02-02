import { loadComponentData } from "$lib/registry";

export async function load() {
	return loadComponentData("data-table");
}
