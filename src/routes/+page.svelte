<script lang="ts">
	import { t } from '$lib/i18n';
	import { toast } from '$lib/stores/toast';
	import { capitalizeNames } from '$lib/utils/capitalizeNames';
	import { capitalizeSingleName } from '$lib/utils/capitalizeSingleName';
	import { generateRandomNumber } from '$lib/utils/getRandomNumber';
	import { normalizeName } from '$lib/utils/normalizeName';
	import { sortNamesAlphabetically } from '$lib/utils/sortNamesAlphabetically';
	import { onMount } from 'svelte';

	let studentsInput = $state('');
	let students: string[] = $state([]);
	let groups: string[][] = $state([]);
	let numOfMembers = $state(2);

	// Creates groups of 2 people by default
	function createGroups() {
		if (!students.length || numOfMembers <= 0) return;
		const studentsCopy = [...students];
		const finalGroups: string[][] = [];

		while (studentsCopy.length > 0) {
			const group = [];
			for (let i = 0; i < numOfMembers; i++) {
				const randomIndex = generateRandomNumber(0, studentsCopy.length - 1);
				if (studentsCopy.length) {
					group.push(studentsCopy[randomIndex]);
					studentsCopy.splice(randomIndex, 1);
				} else {
					break;
				}
			}
			finalGroups.push(group);
		}
		groups = [...finalGroups];
		location.href = '#groups';
	}
	function createClass() {
		const studentsClass = studentsInput.split(',').map((student) => {
			const normalizedName = normalizeName(student);
			if (normalizedName.indexOf(' ') >= 0) {
				return capitalizeNames(normalizedName);
			} else {
				return capitalizeSingleName(normalizedName);
			}
		});
		students = sortNamesAlphabetically([...students, ...studentsClass]);
		location.href = '#studentsList';
		studentsInput = '';
	}
	function handleReturn(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			createClass();
		}
	}
	function saveClass() {
		window.localStorage.setItem('class', students.join(' , '));
		toast.add({
			type: 'success',
			text: $t('toast.savedClass')
		});
	}

	onMount(() => {
		loadPreviousClass();
	});

	function loadPreviousClass() {
		const savedClass = window.localStorage.getItem('class')?.split(' , ');
		students = [...sortNamesAlphabetically(savedClass!)];
		toast.add({
			type: 'info',
			text: `${$t('toast.loadedPreviousClass')}`
		});
		location.href = '#studentsList';
	}
	function copyGroupsToClipboard() {
		let string = '';

		groups.forEach((group, i) => {
			string += `${$t('groupLabel')} ${i + 1}: ${group.join(' - ')}` + '\n';
		});

		navigator.clipboard.writeText(string);
		toast.add({
			type: 'success',
			text: $t('toast.groupsCopiedToClipboard')
		});
	}
	function resetData() {
		students.length = 0;
		groups.length = 0;

		toast.add({
			type: 'info',
			text: `${$t('toast.resetDataBtn')}`
		});
	}
	function deleteStudent(i: number) {
		students = students.filter((_, idx) => idx !== i);
	}
</script>

<main class="mx-auto max-w-4xl px-12 pb-12 pt-4">
	<h1 class="break-words py-10 text-center text-4xl font-bold">{$t('title')}</h1>

	<!-- Check LocalStorage for previous saved class and display btn -->
	{#if window.localStorage.getItem('class')}
		<button class="loadClassBtn" onclick={() => loadPreviousClass()}>{$t('loadClassBtn')}</button>
		<br />
	{/if}

	<section class="addStudentsContainer">
		<div>
			<label class="studentsLabel" for="addStudent"
				><i class="fas fa-user"></i> {$t('addStudentsLabel')}
			</label>
			<div class="inputContainer">
				<input
					class="addStudentInput"
					id="addStudent"
					type="text"
					placeholder={$t('addStudentsPlaceholder')}
					bind:value={studentsInput}
					onkeyup={(e) => handleReturn(e)}
				/>
			</div>
		</div>
		<div class="btnContainer">
			<button onclick={() => createClass()}>{$t('createClassBtn')}</button>
			<button class="danger" onclick={() => resetData()}>{$t('resetDataBtn')}</button>
		</div>
	</section>

	<!-- Students list -->
	<section class="studentsListContainer">
		<h2 id="studentsList" class="text-2xl font-bold">{$t('studentsListLabel')}:</h2>
		{#if students.length === 0}
			<p>{$t('studentsListPlaceholder')}</p>
		{:else}
			<ol class="w-full max-w-60 pl-0">
				{#each students as student, i}
					<li class="student">
						<p>{i + 1}. {student}</p>
						<button class="danger" onclick={() => deleteStudent(i)}>{$t('deleteStudentBtn')}</button
						>
					</li>
				{/each}
			</ol>
		{/if}
	</section>

	<!-- Set Number of Group Members -->
	{#if students.length > 1}
		<div class="inputContainer groups">
			<label for="numOfMembers">{$t('numOfMembersLabel')}</label>
			<input class="max-w-20" id="numOfMembers" bind:value={numOfMembers} type="number" />
		</div>
		<div class="btnContainer">
			<button onclick={() => createGroups()}>{$t('createGroupsBtn')}</button>
			<button class="saveBtn" onclick={() => saveClass()}>{$t('saveClassBtn')}</button>
		</div>
	{/if}

	<!-- Final Groups -->
	<section id="groups" class="groupsContainer">
		<h2 class="text-2xl font-bold">{$t('groupsLabel')}</h2>
		{#if groups.length}
			{#each groups as group, i}
				<p class="group"><b>{$t('groupLabel')} {i + 1}</b>: {group.join(' - ')}</p>
			{/each}

			<!-- Copy Groups to Clipboard -->
			<button class="leading-5" onclick={() => copyGroupsToClipboard()}
				>{$t('copyGroupsBtn')}</button
			>
		{:else}
			<p style="text-align: center;">{$t('groupsPlaceholder')}</p>
		{/if}
	</section>
</main>

<style>
	button {
		padding: 1.5ch 1ch;
		border: 2px solid hsl(209, 36%, 47%);
		background-color: hsl(209, 80%, 70%);
		color: hsl(0, 0%, 100%);
		font-weight: 600;
		font-family: inherit;
		border-radius: 5px;
		text-transform: uppercase;
		letter-spacing: 1.8px;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.39);
		box-shadow:
			rgba(17, 17, 26, 0.05) 0px 1px 0px,
			rgba(17, 17, 26, 0.1) 0px 0px 8px;
		cursor: pointer;
		transition: all 100ms ease-out;
		width: 100%;
		max-width: 250px;
		margin: 0 auto;
		display: block;
	}
	.btnContainer {
		display: flex;
		justify-content: space-between;
		max-width: 450px;
		gap: 0.5rem;
		margin: 0 auto;
	}

	button:focus,
	button:hover,
	button:active {
		border: 2px solid hsl(209, 46%, 23%);
		background-color: hsl(209, 60%, 50%);
	}

	button:hover {
		transform: translateY(-3px);
	}
	button.danger {
		border: 2px solid hsl(0, 76.6%, 26.9%);
		background-color: hsl(0, 50.4%, 55%);
	}
	button.danger:hover,
	button.danger:active {
		border: 2px solid hsl(0, 66%, 19%);
		background-color: hsl(0, 76%, 40%);
	}

	button.saveBtn {
		background-color: hsl(98, 38%, 50%);
		border: 2px solid hsl(120, 83%, 25%);
	}
	button.saveBtn:hover,
	button.saveBtn:active {
		background-color: hsl(98, 38%, 40%);
		border: 2px solid hsl(104.7, 64.6%, 15.5%);
	}

	ol > li {
		width: 100%;
	}

	.student {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.student > button.danger {
		max-width: 7rem;
		padding: 0.7rem;
		margin-left: 0;
		margin-right: 0;
	}

	ol > .student + .student {
		margin-top: 1em;
	}

	input {
		padding: 1ch 2ch;
		border: 2px solid rgb(156, 191, 224);
		border-radius: 5px;
		letter-spacing: 0.8px;
		box-shadow:
			rgba(17, 17, 26, 0.05) 0px 1px 0px,
			rgba(17, 17, 26, 0.1) 0px 0px 8px;
	}

	input[type='number'] {
		border: 2px solid hsla(263, 48%, 54%, 0.8);
	}

	input {
		width: 100%;
		display: block;
	}

	.inputContainer {
		margin: 2em auto;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		max-width: 450px;
	}
	.inputContainer.groups {
		gap: 3rem;
	}
	.inputContainer.groups > label {
		max-width: 260px;
		line-height: 2.2ch;
	}

	.addStudentsContainer {
		flex-direction: column;
	}
	.addStudentsContainer > div {
		max-width: 450px;
		width: 100%;
	}
	.addStudentsContainer,
	.studentsListContainer {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}

	.studentsListContainer {
		flex-direction: column;
		gap: 1em;
	}
	.studentsListContainer > h2 {
		margin: 2em auto 1em;
	}

	.studentsLabel {
		display: block;
		margin-top: 1.5em;
	}

	p.group {
		font-size: 1.1rem;
	}
	p.group + p.group {
		margin-top: 1em;
	}
	p.group:last-of-type {
		margin-bottom: 1em;
	}

	.groupsContainer {
		margin: 2em auto;
		max-width: 400px;
	}
	.groupsContainer > h2 {
		margin: 2em auto;
		text-align: center;
	}
	.groupsContainer > p {
		margin: 2em auto;
		display: block;
	}
	.groupsContainer > p:last-of-type {
		margin-bottom: 3em;
	}

	@media screen and (max-width: 400px) {
		.btnContainer {
			flex-direction: column;
			justify-content: space-between;
			/* background-color: aqua; */
			min-height: 80px;
			max-width: 200px;
			margin: 0 auto;
		}

		button.saveBtn {
			margin-top: 1rem;
		}

		.inputContainer.groups {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
