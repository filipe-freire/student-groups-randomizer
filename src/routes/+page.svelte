<script lang="ts">
	import { locale, locales, t } from '$lib/i18n';
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
			<label class="mt-6 block" for="addStudent">
				<i class="fas fa-user"></i>
				{$t('addStudentsLabel')}
			</label>
			<div class="inputContainer">
				<input
					class="block w-full rounded border-2 border-blue-200 px-4 py-3 tracking-wider shadow-sm"
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
	<section class="flex flex-col items-center justify-evenly gap-4">
		<h2 id="studentsList" class="mx-auto mb-4 mt-8 text-2xl font-bold">
			{$t('studentsListLabel')}:
		</h2>
		{#if students.length === 0}
			<p class="italic">{$t('studentsListPlaceholder')}</p>
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
			<input
				class="block w-full max-w-20 rounded border-2 border-blue-200 px-4 py-3 tracking-wider shadow-sm"
				id="numOfMembers"
				bind:value={numOfMembers}
				type="number"
			/>
		</div>
		<div class="btnContainer">
			<button onclick={() => createGroups()}>{$t('createGroupsBtn')}</button>
			<button class="saveBtn" onclick={() => saveClass()}>{$t('saveClassBtn')}</button>
		</div>
	{/if}

	<!-- Final Groups -->
	<section id="groups" class="mx-auto mt-12 max-w-md">
		<h2 class="mx-auto mt-8 text-center text-2xl font-bold">{$t('groupsLabel')}</h2>
		{#if groups.length}
			<div>
				{#each groups as group, i}
					<p class="group mt-6 text-lg last:mb-8">
						<b>{$t('groupLabel')} {i + 1}</b>: {group.join(' - ')}
					</p>
				{/each}
			</div>

			<!-- Copy Groups to Clipboard -->
			<button class="leading-5" onclick={() => copyGroupsToClipboard()}
				>{$t('copyGroupsBtn')}</button
			>
		{:else}
			<p class="mt-6 text-center italic">{$t('groupsPlaceholder')}</p>
		{/if}
	</section>

	<footer class="mt-16">
		<div class="text-center">
			<label>
				<span class="pr-2">{$t('languageLabel')}:</span>
				<select
					class="mx-auto inline-block rounded-md border border-blue-300 bg-blue-100 p-1.5 pl-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					bind:value={$locale}
					name="language"
					id="language"
					onchange={() => {
						localStorage.setItem('lang', $locale);
						locale.set($locale);
					}}
				>
					{#each locales as l}
						<option selected={$locale === l} value={l}>{l}</option>
					{/each}
				</select>
			</label>
		</div>
		<p class="mt-6 text-center text-gray-700">
			<span class="italic">Filipe Freire</span> | {new Date().getFullYear()}
		</p>
	</footer>
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
	.addStudentsContainer {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}

	@media screen and (max-width: 400px) {
		.btnContainer {
			flex-direction: column;
			justify-content: space-between;
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
