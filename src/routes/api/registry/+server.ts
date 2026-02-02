import { json } from "@sveltejs/kit";
import { readFileSync } from "fs";
import { join } from "path";

export const prerender = true;

export async function GET() {
	// Use process.cwd() to get the project root directory
	const registryPath = join(process.cwd(), "registry.json");
	const registryContent = readFileSync(registryPath, "utf-8");
	const registryData = JSON.parse(registryContent);
	
	return json(registryData);
}
