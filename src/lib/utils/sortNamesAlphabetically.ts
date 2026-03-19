export function sortNamesAlphabetically<T>(studentsClass: T[], key?: (item: T) => string) {
	return studentsClass.sort((a, b) => {
		const nameA = key ? key(a) : (a as unknown as string);
		const nameB = key ? key(b) : (b as unknown as string);
		return nameA.localeCompare(nameB);
	});
}
