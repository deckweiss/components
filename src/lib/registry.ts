import { isRecentlyAdded } from "./version-manager";
import { isRecentlyUpdated } from "./version-manager";
import { outsourcedComponents, type ComponentSource } from "./outsourced-components";
import DeckweissIcon from "$lib/assets/deckweiss-icon-white.svg";
import ShadcnIcon from "$lib/assets/shadcn-logo.png";
import ShadcnSvelteExtrasIcon from "$lib/assets/shadcn-svelte-extras-logo.svg";
import MoreShadCnIcon from "$lib/assets/more-shadcn-logo.svg";

/**
 * Registry data management
 * Handles loading and accessing component/util data from registry.json
 */

export type { ComponentSource, OutsourcedComponent } from "./outsourced-components";

export interface RegistryJsonItem {
	name: string;
	type: string;
	title: string;
	description: string;
	registryDependencies?: string[];
	dependencies?: string[];
	files?: unknown[];
}

export interface RegistryJson {
	items: RegistryJsonItem[];
}

export interface RegistryItem {
	name: string;
	slug: string;
	description: string;
	isWip: boolean;
	isNew: boolean;
	isUpdated: boolean;
	source?: ComponentSource;
	link?: string;
	isOutsourced?: boolean;
}

// Cache for registry data (set from layout server load)
let registryDataCache: RegistryJson | null = null;

// Get registry data (from cache set by layout)
function getRegistryData(): RegistryJson {
	return registryDataCache || { items: [] };
}

/**
 * Set registry data (called from layout)
 * This initializes the registry cache with data loaded server-side
 */
export function setRegistryData(data: RegistryJson) {
	registryDataCache = data;
}

/**
 * Get components from registry.json and merge with outsourced components
 * Only includes items with type "registry:component" or "registry:block"
 * Sorted alphabetically by name
 */
export function getComponents(): RegistryItem[] {
	const data = getRegistryData();
	
	// Deckweiss components from registry.json
	const deckweissComponents = data.items
		.filter((item) => item.type === "registry:component" || item.type === "registry:block")
		.map((item) => ({
			name: item.title,
			slug: item.name,
			description: item.description,
			isWip: item.files?.length === 0,
			isNew: isRecentlyAdded(item.name),
			isUpdated: isRecentlyUpdated(item.name),
			source: "deckweiss" as const,
			link: undefined,
			isOutsourced: false,
		}));
	
	// Outsourced components
	const outsourced = outsourcedComponents.map((comp) => ({
		name: comp.title,
		slug: comp.title.toLowerCase().replace(/\s+/g, "-"),
		description: comp.description || "",
		isWip: false,
		isNew: false,
		isUpdated: false,
		source: comp.source,
		link: comp.link,
		isOutsourced: true,
	}));
	
	// Merge and sort alphabetically
	return [...deckweissComponents, ...outsourced].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get utils from registry.json
 * Only includes items with type "registry:file"
 * Sorted alphabetically by name
 */
export function getUtils(): RegistryItem[] {
	const data = getRegistryData();
	
	// Deckweiss components from registry.json
	const utils = data.items
		.filter((item) => item.type === "registry:file")
		.map((item) => ({
			name: item.title,
			slug: item.name,
			description: item.description,
			isWip: item.files?.length === 0,
			isNew: isRecentlyAdded(item.name),
			isUpdated: isRecentlyUpdated(item.name),
		}));

	
	// Merge and sort alphabetically
	return utils.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Source to icon image path mapping
 * Maps component sources to their icon images in /src/lib/assets/
 */
export const sourceIconMap: Record<ComponentSource, string> = {
	deckweiss: DeckweissIcon,
	shadcn: ShadcnIcon,
	'shadcn-svelte-extras': ShadcnSvelteExtrasIcon,
	'more-shadcn': MoreShadCnIcon,
};

/**
 * Get icon path for a component source
 */
export function getSourceIcon(source: ComponentSource): string {
	return sourceIconMap[source];
}

/**
 * Get a component by slug from registry.json
 * Returns the raw registry item with title, description, etc.
 */
export function getComponentBySlug(slug: string): RegistryJsonItem | null {
	const data = getRegistryData();
	const item = data.items.find((item) => item.name === slug);
	return item || null;
}

/**
 * Load component data for a page
 * Returns formatted component data with title, description, isWip, isNew, and isUpdated flags
 * Throws 404 error if component not found
 */
export async function loadComponentData(slug: string) {
	const { error } = await import("@sveltejs/kit");
	const { isRecentlyAdded, isRecentlyUpdated } = await import("./version-manager");
	
	const component = getComponentBySlug(slug);
	
	if (!component) {
		error(404, "Component not found");
		throw new Error("Unreachable"); // TypeScript doesn't know error() throws
	}
	
	return {
		component: {
			title: component.title,
			description: component.description || "",
			isWip: !component.files || component.files.length === 0,
			isNew: isRecentlyAdded(component.name),
			isUpdated: isRecentlyUpdated(component.name),
			slug: component.name,
		}
	};
}

/**
 * Load utility data for a page
 * Returns formatted utility data with title, description, isWip, isNew, and isUpdated flags
 * Throws 404 error if utility not found
 */
export async function loadUtilData(slug: string) {
	const { error } = await import("@sveltejs/kit");
	const { isRecentlyAdded, isRecentlyUpdated } = await import("./version-manager");
	
	const util = getComponentBySlug(slug);
	
	if (!util) {
		error(404, "Utility not found");
		throw new Error("Unreachable"); // TypeScript doesn't know error() throws
	}
	
	return {
		util: {
			title: util.title,
			description: util.description || "",
			isWip: !util.files || util.files.length === 0,
			isNew: isRecentlyAdded(util.name),
			isUpdated: isRecentlyUpdated(util.name),
			slug: util.name,
		}
	};
}

// Create proxy objects that read from cache dynamically
const createRegistryProxy = (getter: () => RegistryItem[]) => {
	return new Proxy([], {
		get(target, prop) {
			const current = getter();
			const value = (current as unknown as Record<string, unknown>)[prop as string];
			if (value !== undefined) {
				return typeof value === 'function' ? value.bind(current) : value;
			}
			return Reflect.get(current, prop);
		},
		has(target, prop) {
			return Reflect.has(getter(), prop);
		},
		getOwnPropertyDescriptor(_target, prop) {
			return Reflect.getOwnPropertyDescriptor(getter(), prop);
		},
		ownKeys() {
			return Reflect.ownKeys(getter());
		}
	}) as unknown as RegistryItem[];
};

// Export components and utils as proxies that read from cache
export const components = createRegistryProxy(getComponents);
export const utils = createRegistryProxy(getUtils);
