export type FilterOperator = "=" | "<>" | ">=" | "<=" | "~~*" | "in" | "is_null" | "is_not_null" | "between";

export type FilterRule = {
	id: string;
	operator: FilterOperator;
	value: string | string[] | null;
	// For range/between operator, we need two values
	value2?: string | null;
	// For contains operator on dates, we need to know what part to filter
	datePart?: "day" | "month" | "year" | null;
	// For contains operator on dates, the actual value to filter
	datePartValue?: string | null;
};

export type OperatorConfig = {
	value: FilterOperator;
	label: string;
	requiresValue: boolean; // false for null checks
	isFreitext: boolean; // true for free text input instead of dropdown
	isBetween: boolean; // true for "von...bis" with two inputs
};

// Operators available for string columns
export const STRING_OPERATORS: OperatorConfig[] = [
	{ value: "=", label: "gleich", requiresValue: true, isFreitext: false, isBetween: false },
	{ value: "<>", label: "ungleich", requiresValue: true, isFreitext: false, isBetween: false },
	{ value: "~~*", label: "enthält", requiresValue: true, isFreitext: true, isBetween: false },
	{ value: "in", label: "enthalten in", requiresValue: true, isFreitext: false, isBetween: false },
	{ value: "is_null", label: "ist leer", requiresValue: false, isFreitext: false, isBetween: false },
	{ value: "is_not_null", label: "ist nicht leer", requiresValue: false, isFreitext: false, isBetween: false },
];

// Operators available for number and date columns
export const NUMBER_DATE_OPERATORS: OperatorConfig[] = [
	{ value: "=", label: "gleich", requiresValue: true, isFreitext: false, isBetween: false },
	{ value: "<>", label: "ungleich", requiresValue: true, isFreitext: false, isBetween: false },
	{ value: ">=", label: "größer gleich", requiresValue: true, isFreitext: true, isBetween: false },
	{ value: "<=", label: "kleiner gleich", requiresValue: true, isFreitext: true, isBetween: false },
	{ value: "~~*", label: "enthält", requiresValue: true, isFreitext: true, isBetween: false },
	{ value: "between", label: "von...bis", requiresValue: true, isFreitext: true, isBetween: true },
	{ value: "in", label: "enthalten in", requiresValue: true, isFreitext: false, isBetween: false },
	{ value: "is_null", label: "ist leer", requiresValue: false, isFreitext: false, isBetween: false },
	{ value: "is_not_null", label: "ist nicht leer", requiresValue: false, isFreitext: false, isBetween: false },
];

/**
 * Determines if a column is numeric or date based on sample values
 */
export function getColumnType<TData>(
	column: { id: string; getFacetedUniqueValues: () => Map<unknown, number> },
	table: { getRowModel: () => { rows: Array<{ getValue: (id: string) => unknown }> } }
): "string" | "number" | "date" {
	const uniqueValues = column.getFacetedUniqueValues();
	const sampleValues = Array.from(uniqueValues.keys()).slice(0, 10);

	if (sampleValues.length === 0) {
		// Try to get a value from the table rows
		const rows = table.getRowModel().rows;
		if (rows.length > 0) {
			const firstValue = rows[0].getValue(column.id);
			if (firstValue !== null && firstValue !== undefined) {
				sampleValues.push(firstValue);
			}
		}
	}

	if (sampleValues.length === 0) {
		return "string"; // Default to string
	}

	// Check if all sample values are numbers
	const allNumbers = sampleValues.every((val) => {
		if (val === null || val === undefined) return false;
		const num = Number(val);
		return !isNaN(num) && isFinite(num);
	});

	if (allNumbers) {
		return "number";
	}

	// Check if all sample values are dates
	const allDates = sampleValues.every((val) => {
		if (val === null || val === undefined) return false;
		// Check if it's a Date object or a valid date string
		if (val instanceof Date) return true;
		const dateStr = String(val);
		const date = new Date(dateStr);
		return !isNaN(date.getTime()) && dateStr.length > 8; // Basic date string check
	});

	if (allDates) {
		return "date";
	}

	return "string";
}

/**
 * Get available operators for a column based on its type
 */
export function getOperatorsForColumn<TData>(
	column: { id: string; getFacetedUniqueValues: () => Map<unknown, number> },
	table: { getRowModel: () => { rows: Array<{ getValue: (id: string) => unknown }> } }
): OperatorConfig[] {
	const columnType = getColumnType(column, table);
	if (columnType === "number" || columnType === "date") {
		return NUMBER_DATE_OPERATORS;
	}
	return STRING_OPERATORS;
}

/**
 * Check if a column is a date column
 */
export function isDateColumn<TData>(
	column: { id: string; getFacetedUniqueValues: () => Map<unknown, number> },
	table: { getRowModel: () => { rows: Array<{ getValue: (id: string) => unknown }> } }
): boolean {
	return getColumnType(column, table) === "date";
}

// German month names
export const MONTHS = [
	{ value: "1", label: "Januar" },
	{ value: "2", label: "Februar" },
	{ value: "3", label: "März" },
	{ value: "4", label: "April" },
	{ value: "5", label: "Mai" },
	{ value: "6", label: "Juni" },
	{ value: "7", label: "Juli" },
	{ value: "8", label: "August" },
	{ value: "9", label: "September" },
	{ value: "10", label: "Oktober" },
	{ value: "11", label: "November" },
	{ value: "12", label: "Dezember" },
];

// Date part options for "enthält" operator
export const DATE_PARTS = [
	{ value: "day", label: "Tag" },
	{ value: "month", label: "Monat" },
	{ value: "year", label: "Jahr" },
];
