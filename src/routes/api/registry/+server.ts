import { json } from "@sveltejs/kit";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

export async function GET() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = join(__filename, "..", "..", "..", "..", "..");
	const registryPath = join(__dirname, "registry.json");
	const registryContent = readFileSync(registryPath, "utf-8");
	const registryData = JSON.parse(registryContent);
	
	return json(registryData);
}
