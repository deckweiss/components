import { readFileSync } from "fs";
import { join } from "path";

export async function load() {
	// Read registry.json server-side
	// Use process.cwd() to get the project root directory
	const registryPath = join(process.cwd(), "registry.json");
	const registryContent = readFileSync(registryPath, "utf-8");
	const registryData = JSON.parse(registryContent);
	
	return {
		registryData
	};
}
