import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

export async function load() {
	// Read registry.json server-side
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = join(__filename, "..", "..", "..");
	const registryPath = join(__dirname, "registry.json");
	const registryContent = readFileSync(registryPath, "utf-8");
	const registryData = JSON.parse(registryContent);
	
	return {
		registryData
	};
}
