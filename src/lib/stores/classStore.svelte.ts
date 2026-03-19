import { i18n } from '$lib/i18n.svelte';
import { toast } from '$lib/stores/toast.svelte';
import { capitalizeNames } from '$lib/utils/capitalizeNames';
import { capitalizeSingleName } from '$lib/utils/capitalizeSingleName';
import { generateRandomNumber } from '$lib/utils/getRandomNumber';
import { normalizeName } from '$lib/utils/normalizeName';
import { sortNamesAlphabetically } from '$lib/utils/sortNamesAlphabetically';

export type Student = { id: string; name: string };

class ClassStore {
	students = $state<Student[]>([]);
	groups = $state<string[][]>([]);
	numOfMembersPerGroup = $state(2);

	createClass(studentsInput: string) {
		const studentsClass = studentsInput.split(',').map((student) => {
			const normalizedName = normalizeName(student);
			const capitalizedName =
				normalizedName.indexOf(' ') >= 0
					? capitalizeNames(normalizedName)
					: capitalizeSingleName(normalizedName);
			return { id: crypto.randomUUID(), name: capitalizedName };
		});
		this.students = sortNamesAlphabetically([...this.students, ...studentsClass], (s) => s.name);
		location.href = '#studentsList';
	}

	createGroups() {
		if (!this.students.length || this.numOfMembersPerGroup <= 0) return;
		const studentsCopy = [...this.students];
		const finalGroups: string[][] = [];

		while (studentsCopy.length > 0) {
			const group = [];
			for (let i = 0; i < this.numOfMembersPerGroup; i++) {
				const randomIndex = generateRandomNumber(0, studentsCopy.length - 1);
				if (studentsCopy.length) {
					group.push(studentsCopy[randomIndex].name);
					studentsCopy.splice(randomIndex, 1);
				} else {
					break;
				}
			}
			finalGroups.push(group);
		}
		this.groups = [...finalGroups];
		location.href = '#groups';
	}

	saveClass() {
		window.localStorage.setItem('class', JSON.stringify({ studentsList: this.students }));
		toast.add({
			type: 'success',
			text: i18n.t('toast.savedClass')
		});
	}

	loadPreviousClass() {
		const savedClass = window.localStorage.getItem('class');
		if (!savedClass) return;

		const data = JSON.parse(savedClass);
		this.students = data.studentsList.sort((a: Student, b: Student) =>
			a.name.localeCompare(b.name)
		);
		toast.add({
			type: 'info',
			text: i18n.t('toast.loadedPreviousClass')
		});
		location.href = '#studentsList';
	}

	resetData() {
		this.students = [];
		this.groups = [];
		toast.add({
			type: 'info',
			text: i18n.t('toast.resetDataBtn')
		});
	}

	deleteStudent(id: string) {
		this.students = this.students.filter((s) => s.id !== id);
	}

	updateStudentName(id: string, newName: string) {
		const normalizedName = normalizeName(newName);
		const capitalizedName =
			normalizedName.indexOf(' ') >= 0
				? capitalizeNames(normalizedName)
				: capitalizeSingleName(normalizedName);
		const studentIndex = this.students.findIndex((s) => s.id === id);
		if (studentIndex !== -1) {
			this.students[studentIndex] = { ...this.students[studentIndex], name: capitalizedName };
		}
		this.students = sortNamesAlphabetically([...this.students], (s) => s.name);
		toast.add({
			type: 'success',
			text: i18n.t('toast.studentNameUpdated')
		});
	}
}

export const classStore = new ClassStore();
