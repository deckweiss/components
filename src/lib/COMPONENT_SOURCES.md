# Component Sources System

This document explains how the component sources system works and how to add outsourced components.

## Overview

Components in the registry now have a source property that identifies where they come from:
- **deckweiss**: Components from the Deckweiss registry (default)
- **shadcn**: Components from shadcn-svelte
- **headlessui**: Components from Headless UI
- **melt-ui**: Components from Melt UI
- **radix-ui**: Components from Radix UI

## File Structure

### `src/lib/outsourced-components.ts`
Defines the outsourced components registry with the following interface:

```typescript
export interface OutsourcedComponent {
  title: string;           // Display name of the component
  link: string;            // URL to the component (opens in new tab)
  source: ComponentSource;  // Source type (shadcn, headlessui, etc.)
  description?: string;    // Optional description
}
```

### `src/lib/registry.ts`
Provides the registry management with:
- `RegistryItem` interface now includes:
  - `source: ComponentSource` - The source of the component
  - `link?: string` - Only present for outsourced components
  - `isOutsourced: boolean` - Whether this is an outsourced component
- `sourceIconMap` - Maps sources to their icon images
- `getSourceIcon(source)` - Gets the icon path for a component source

## How to Add Outsourced Components

1. Open `src/lib/outsourced-components.ts`

2. Add your component to the `outsourcedComponents` array:

```typescript
export const outsourcedComponents: OutsourcedComponent[] = [
  {
    title: "Button",
    link: "https://shadcn-svelte.com/docs/components/button",
    source: "shadcn",
    description: "A versatile button component from shadcn-svelte",
  },
  {
    title: "Dialog",
    link: "https://www.radix-ui.com/docs/primitives/components/dialog",
    source: "radix-ui",
    description: "A dialog component from Radix UI",
  },
  // Add more components as needed
];
```

## How Icons Work

### Icon Path Mapping

Icons are mapped in `registry.ts` via the `sourceIconMap`:

```typescript
export const sourceIconMap: Record<ComponentSource, string> = {
  deckweiss: "/deckweiss-icon.png",
  shadcn: "/shadcn-icon.png",
  headlessui: "/headlessui-icon.png",
  "melt-ui": "/melt-ui-icon.png",
  "radix-ui": "/radix-ui-icon.png",
};
```

The icons should be placed in the `/static/` directory so they are served statically.

### Adding New Source Icons

To add a new source with its icon:

1. Place the icon image in `/static/` (e.g., `shadcn-icon.png`)

2. Add the source to the `ComponentSource` type in `outsourced-components.ts`:

```typescript
export type ComponentSource = "deckweiss" | "shadcn" | "headlessui" | "melt-ui" | "radix-ui" | "your-new-source";
```

3. Add the mapping in `registry.ts`:

```typescript
export const sourceIconMap: Record<ComponentSource, string> = {
  // ... existing mappings
  "your-new-source": "/your-source-icon.png",
};
```

## Display in UI

### Sidebar
- Components appear in the "Components" section
- Icons display next to component names
- Deckweiss components link internally (`/components/{slug}`)
- Outsourced components open in a new tab with an external link icon

### Components Overview Page (`/components`)
- All components (Deckweiss + outsourced) displayed together
- Sorted alphabetically by title
- Icons show next to each component
- Same link behavior as sidebar

## Deckweiss Components

All components from `registry.json` are automatically:
- Assigned the `deckweiss` source
- Given the Deckweiss icon
- Displayed with internal links to their component pages
- Merged and sorted with outsourced components

No manual configuration needed for Deckweiss components.
