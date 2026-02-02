import type { Column, Table } from "@tanstack/table-core";

/**
 * Extracts the header value from a column definition.
 * Handles both string headers and function headers (e.g., `() => emailHeader`).
 */
export function getColumnHeaderValue<TData>(
	column: Column<TData, unknown>,
	table: Table<TData>
): string {
	const headerDef = column.columnDef.header;

	if (typeof headerDef === "function") {
		try {
			// Find the corresponding header to get proper context
			const headerGroups = table.getHeaderGroups();
			const header = headerGroups
				.flatMap((hg) => hg.headers)
				.find((h) => h.column.id === column.id);

			if (header) {
				const result = headerDef(header.getContext());
				return typeof result === "string" ? result : column.id;
			}

			// Fallback: try calling with undefined (works for simple functions like () => emailHeader)
			const result = headerDef(undefined as any);
			return typeof result === "string" ? result : column.id;
		} catch {
			return column.id;
		}
	}

	return (headerDef as string | undefined) ?? column.id;
}
