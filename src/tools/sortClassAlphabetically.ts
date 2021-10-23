export function sortAlphabetically(studentsClass: string[]) {
  return studentsClass.sort((a, b) => a.localeCompare(b));
}
