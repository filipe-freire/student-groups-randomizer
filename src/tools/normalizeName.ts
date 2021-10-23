/**
 * Function responsible for normalizing user input (trim + lowercasing)
 * @param name student name as a string
 * @returns normalized name trimmed and lowecased
 */
export function normalizeName(name: string) {
  return name.trim().toLowerCase();
}
