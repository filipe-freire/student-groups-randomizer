export function capitalizeNames(names: string) {
	return names
		.split(' ')
		.map((name) => name[0].toLocaleUpperCase() + name.slice(1))
		.join(' ');
}
