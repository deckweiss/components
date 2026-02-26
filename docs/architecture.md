# Deckweiss Components Architecture

## Overview

This project is a component registry built with SvelteKit, providing installable UI components, utilities, and page templates for Svelte projects.

## Categories

### Components (`registry:component`, `registry:block`)

Installable UI components and blocks. Located in `src/lib/registry/blocks/` and `src/lib/registry/ui/`.

### Utils (`registry:file`)

Utility functions and shared code. Located in `src/lib/registry/utils/`.

### Resources

Static copy-paste reference pages (not installable). Defined in `src/lib/resources.ts`. Routes: `/resources`, `/resources/[slug]`.

### Page Templates (`registry:page`)

Installable full-page templates. Same installation flow as components but for complete page layouts. Routes: `/page-templates`, `/page-templates/[slug]`.

## Version Manager

The unified version system lives in `$lib/versions/`:

- **`types.ts`** – `VersionData`, `ChangelogChange`, `DetailedChanges`
- **`version-manager.ts`** – `getAllVersions()`, `getChangelog()`, `getLatestVersion()`, `isRecentlyAdded()`, `isRecentlyUpdated()`
- **`content/v*.ts`** – Version data files (e.g. `v1.0.0.ts`, `v1.1.0.ts`)

### Changelog Entry Format

Changelog entries support optional `ref` for "View" links:

- `ref`: Full path for the link, e.g. `"/components/update-popup"`, `"/utils/format-measurement-value"`, `"/page-templates/changelog-page"`
- `type`: `"added" | "updated" | "fixed" | "removed"`
- `description`: Human-readable change description

The `ref` is used for `isRecentlyAdded()` and `isRecentlyUpdated()` (matching by slug as the last path segment).

## Page Layout Components

- `ComponentPageLayout` – Components with installation CTA
- `UtilPageLayout` – Utils
- `ResourcePageLayout` – Resources
- `PageTemplatePageWrapper` – Page templates with installation CTA

## Registry Build

Run `pnpm build:registry` to regenerate `static/r/*.json` from `registry.json`. Valid item types: `registry:component`, `registry:block`, `registry:file`, `registry:page`, etc.
