/**
 * Function responsible for normalizing user input (trim + lowercasing)
 * @param name student name as a string
 * @returns normalized name trimmed and lowercased
 */
export function normalizeName(name: string) {
	return name.trim().toLowerCase();
}
