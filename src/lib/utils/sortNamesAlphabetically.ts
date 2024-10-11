export function sortNamesAlphabetically(studentsClass: string[]) {
	return studentsClass.sort((a, b) => a.localeCompare(b));
}
