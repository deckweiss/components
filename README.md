# Component Registry

This project serves as a custom component registry for `shadcn-svelte`. It allows you to develop, document, and distribute your own Svelte components that can be added to any SvelteKit project using the `shadcn-svelte` CLI.

## Core Concepts: Internal vs. Registry Components

It's essential to understand the two main directories for components:

1.  **`src/lib/components/ui` (Internal Development)**
    This is where you should **develop, test, and refine** your components. Think of it as your workshop. The components in this directory are used for local development, visualization in Storybook, and are the "source of truth" for your component's code.

2.  **`src/lib/registry` (Public Registry)**
    This directory contains the files that are prepared for **distribution**. When a user adds a component using the CLI, the files are served from here. The structure in this directory defines what code gets delivered to the end-user. It might be a direct copy of a component from `src/lib/components/ui`, or it could be a more complex "block" composed of multiple files.

This separation allows you to have extensive documentation, examples, and tests for your internal components without bloating the code that gets shipped to the consumer.

## Development Workflow

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run the Development Server & Storybook

For live-reloading and a visual environment to build your components:

```bash
# Run the SvelteKit dev server
pnpm dev

# Run Storybook to see your internal components
pnpm storybook
```

## How to Add a New Component

Here is the standard workflow for adding a new component to the registry.

### Step 1: Develop the Component in the lib/registry folder

*   **For a simple UI component**: Create a new file such as `avatar.svelte` inside `src/lib/registry/ui/`.
*   **For a complex "Block" component**: Create a new directory like `src/lib/registry/blocks/data-table/` and add all the files that should be included when a user installs that block.

For example, to create a new `avatar` component:

1.  Create the component directory: `src/lib/registry/ui/avatar/`
2.  Create the Svelte file: `avatar.svelte`
3.  Create an `index.ts` to export it: `export { default as Avatar } from './avatar.svelte'`
4.  (optional) Create a Storybook story (`src/stories/Avatar.stories.svelte`) to view and test it in isolation.

### Step 2: Register the Component

Add a new entry to the `items` array in the `registry.json` file. This entry tells the `shadcn-svelte` CLI where to find the component's files.

**Crucially, the `files.path` property must point to the component's location within the `src/lib/registry` directory.**

**Example for a simple `avatar` component:**
```json
{
  "name": "avatar",
  "type": "registry:component",
  "title": "Avatar",
  "description": "An image element with a fallback for representing a user.",
  "files": [
    {
      "path": "src/lib/registry/ui/avatar.svelte",
      "type": "registry:component"
    }
  ]
}
```

### Step 3: Build the Registry

After adding your component to `registry.json`, run the build command. This generates the final JSON definitions in the `static/r` directory that the CLI will consume.

```bash
pnpm build:registry
```

### Step 4: Showcase the Component

Create a new folder with your components slug inside `routes/components` and create a new `+page.svelte`. Like the other example pages, build a demo page by using the `ComponentPageWrapper`. You will also need a `page.server.ts` with a simple load function and the components slug (refer to the other component's pages).

## Consuming Components

Once the registry is built and the project is hosted, users can add your components to their projects with the CLI:

```bash
pnpm dlx shadcn-svelte@next add https://components.deckweiss.at/r/<component-name>.json
```