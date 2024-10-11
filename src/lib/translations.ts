export const translations = {
	'🇺🇸 en': {
		languageLabel: 'Language',

		// App Specific
		title: 'Student Groups Randomizer!',
		loadClassBtn: 'Load previous class!',
		addStudentsLabel: 'Student(s)',
		addStudentsPlaceholder: 'Ex: student1, student2, student3...',
		createClassBtn: 'Add Student(s)',
		studentsListLabel: 'Students',
		resetDataBtn: 'Reset',
		studentsListPlaceholder: "You're class is empty, please add students.",
		numOfMembersLabel: 'How many members do you want the groups to have?',
		groupsLabel: 'Final Groups',
		copyGroupsBtn: 'Copy Groups to Clipboard',
		groupsPlaceholder: 'No groups were created yet!',
		groupLabel: 'Group',
		deleteStudentBtn: 'Delete',
		createGroupsBtn: 'Create groups',
		saveClassBtn: 'Save Class!',

		// Toast
		'toast.resetDataBtn': 'Data was cleared! ✅',
		'toast.groupsCopiedToClipboard': 'Groups successfully copied to clipboard!',
		'toast.loadedPreviousClass': 'Class loaded successfully',
		'toast.savedClass': 'Class successfully saved for the next visit! 🎉'
	},
	'🇵🇹 pt-pt': {
		languageLabel: 'Idioma',
		title: 'Gerador de Grupos de Estudantes!',
		loadClassBtn: 'Importar turma anterior',
		addStudentsLabel: 'Aluno(s)',
		addStudentsPlaceholder: 'Ex: aluno1, aluno2, aluno3...',
		createClassBtn: 'Adicionar Aluno(s)',
		studentsListLabel: 'Alunos',
		resetDataBtn: 'Limpar',
		studentsListPlaceholder: 'A turma está vazia, por favor adicione alunos.',
		numOfMembersLabel: 'Quantos membros pretende que os grupos tenham?',
		groupsLabel: 'Grupos Finais',
		copyGroupsBtn: 'Copiar Grupos para a área de transferência',
		groupsPlaceholder: 'Nenhum grupo foi criado ainda!',
		groupLabel: 'Grupo',
		deleteStudentBtn: 'Remover',
		createGroupsBtn: 'Criar grupos',
		saveClassBtn: 'Guardar turma',

		// Toast
		'toast.resetDataBtn': 'Dados limpos com sucesso! ✅',
		'toast.groupsCopiedToClipboard': 'Grupos copiados com sucesso para a área de transferência!',
		'toast.loadedPreviousClass': 'Turma importada com sucesso!',
		'toast.savedClass': 'Turma guardada com sucesso para a proxima vez!'
	}
};

export type ILocale = keyof typeof translations;
// export a type that contains the nested keys of both the locales of translations object
export type ITranslation = keyof (typeof translations)[ILocale];
