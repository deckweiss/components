import { loadUtilData } from "$lib/registry";

export async function load() {
	return loadUtilData("format-measurement-value");
}
