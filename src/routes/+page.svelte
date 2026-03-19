<script lang="ts">
	import { i18n, locales } from '$lib/i18n.svelte';
	import { classStore } from '$lib/stores/classStore.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { onMount, tick } from 'svelte';

	let studentsInput = $state('');
	let editingId = $state<string | null>(null);
	let editingName = $state('');
	let editingInput = $state<HTMLInputElement | null>(null);

	onMount(() => {
		classStore.loadPreviousClass();
	});

	function handleReturn(e: KeyboardEvent) {
		if (e.code === 'Enter') {
			classStore.createClass(studentsInput);
			studentsInput = '';
		}
	}

	async function startEditing(id: string) {
		editingId = id;
		editingName = classStore.students.find((s) => s.id === id)?.name ?? '';
		await tick();
		editingInput?.select();
	}

	function saveEdit() {
		if (editingId === null) return;
		classStore.updateStudentName(editingId, editingName);
		cancelEdit();
	}

	function cancelEdit() {
		editingId = null;
		editingName = '';
	}

	function copyGroupsToClipboard() {
		let string = '';
		classStore.groups.forEach((group, i) => {
			string += `${i18n.t('groupLabel')} ${i + 1}: ${group.join(' - ')}` + '\n';
		});
		navigator.clipboard.writeText(string);
		toast.add({
			type: 'success',
			text: i18n.t('toast.groupsCopiedToClipboard')
		});
	}
</script>

<main class="mx-auto max-w-4xl px-12 pb-12 pt-4">
	<h1 class="break-words py-10 text-center text-4xl font-bold">{i18n.t('title')}</h1>

	<!-- Check LocalStorage for previous saved class and display btn -->
	{#if window.localStorage.getItem('class')}
		<button class="loadClassBtn" onclick={() => classStore.loadPreviousClass()}
			>{i18n.t('loadClassBtn')}</button
		>
		<br />
	{/if}

	<section class="flex flex-col items-center justify-evenly">
		<div class="w-full max-w-md">
			<label class="mt-6 block" for="addStudent">
				{i18n.t('addStudentsLabel')}
			</label>
			<div class="mx-auto my-8 flex max-w-[450px] items-center justify-evenly">
				<input
					class="block w-full rounded border-2 border-blue-200 px-4 py-3 tracking-wider shadow-sm"
					id="addStudent"
					type="text"
					placeholder={i18n.t('addStudentsPlaceholder')}
					bind:value={studentsInput}
					onkeyup={(e) => handleReturn(e)}
				/>
			</div>
		</div>
		<div class="mx-auto flex max-w-md flex-col justify-between gap-2 sm:min-h-0 sm:flex-row">
			<button
				onclick={() => {
					classStore.createClass(studentsInput);
					studentsInput = '';
				}}>{i18n.t('createClassBtn')}</button
			>
			<button class="danger" onclick={() => classStore.resetData()}>{i18n.t('resetDataBtn')}</button
			>
		</div>
	</section>

	<!-- Students list -->
	<section class="flex flex-col items-center justify-evenly gap-4">
		<h2 id="studentsList" class="mx-auto mb-4 mt-8 text-2xl font-bold">
			{i18n.t('studentsListLabel')}:
		</h2>
		{#if classStore.students.length === 0}
			<p class="italic">{i18n.t('studentsListPlaceholder')}</p>
		{:else}
			<div
				class="grid w-full max-w-3xl grid-rows-[auto_1fr] rounded-md outline outline-2 sm:w-screen"
			>
				<div class="grid grid-cols-[6%_67%_27%] items-center gap-x-1 border-b-2 p-2">
					<p class="text-center font-semibold">#</p>
					<p class="text-center font-semibold">{i18n.t('tableStudentName')}</p>
					<p class="text-center font-semibold">{i18n.t('tableActions')}</p>
				</div>
				<div class="flex max-h-96 flex-col gap-y-1 overflow-scroll px-2">
					{#each classStore.students as student, i}
						<div class="grid grid-cols-[6%_67%_27%] items-center gap-x-1 py-2">
							<p class="text-center">{i + 1}.</p>
							{#if editingId === student.id}
								<input
									bind:this={editingInput}
									class="line-clamp-2 break-words text-center"
									type="text"
									bind:value={editingName}
									onkeyup={(e) => {
										if (e.code === 'Enter') saveEdit();
										if (e.code === 'Escape') cancelEdit();
									}}
								/>
							{:else}
								<p class="line-clamp-2 break-words text-center">{student.name}</p>
							{/if}
							<div class="flex gap-x-1">
								{#if editingId === student.id}
									<button class="!px-1.5 !text-xs" onclick={() => saveEdit()}>
										{i18n.t('saveEditBtn')}
									</button>
									<button class="danger !px-1.5 !text-xs" onclick={() => cancelEdit()}>
										{i18n.t('cancelEditBtn')}
									</button>
								{:else}
									<button
										class="!px-1.5 !text-xs"
										onclick={async () => await startEditing(student.id)}
									>
										{i18n.t('editStudentBtn')}
									</button>
									<button
										class="danger !px-1.5 !text-xs"
										onclick={() => classStore.deleteStudent(student.id)}
									>
										{i18n.t('deleteStudentBtn')}
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>

	<!-- Set Number of Group Members -->
	{#if classStore.students.length > 1}
		<div
			class="mx-auto my-8 flex max-w-[450px] flex-col items-center justify-evenly gap-y-2 sm:flex-row"
		>
			<label class="max-w-64 leading-relaxed" for="numOfMembers"
				>{i18n.t('numOfMembersLabel')}</label
			>
			<input
				class="block w-full max-w-20 rounded border-2 border-blue-200 px-4 py-3 tracking-wider shadow-sm"
				id="numOfMembers"
				bind:value={classStore.numOfMembersPerGroup}
				type="number"
			/>
		</div>
		<div class="mx-auto flex max-w-md flex-col justify-between gap-2 sm:min-h-0 sm:flex-row">
			<button onclick={() => classStore.createGroups()}>{i18n.t('createGroupsBtn')}</button>
			<button class="saveBtn" onclick={() => classStore.saveClass()}
				>{i18n.t('saveClassBtn')}</button
			>
		</div>
	{/if}

	<!-- Final Groups -->
	<section id="groups" class="mx-auto mt-12 max-w-md">
		<h2 class="mx-auto mt-8 text-center text-2xl font-bold">{i18n.t('groupsLabel')}</h2>
		{#if classStore.groups.length}
			<div>
				{#each classStore.groups as group, i}
					<p class="group mt-6 text-lg last:mb-8">
						<b>{i18n.t('groupLabel')} {i + 1}</b>: {group.join(' - ')}
					</p>
				{/each}
			</div>

			<!-- Copy Groups to Clipboard -->
			<button class="leading-5" onclick={() => copyGroupsToClipboard()}
				>{i18n.t('copyGroupsBtn')}</button
			>
		{:else}
			<p class="mt-6 text-center italic">{i18n.t('groupsPlaceholder')}</p>
		{/if}
	</section>

	<footer class="mt-16">
		<div class="text-center">
			<label>
				<span class="pr-2">{i18n.t('languageLabel')}:</span>
				<select
					class="mx-auto inline-block rounded-md border border-blue-300 bg-blue-100 p-1.5 pl-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					bind:value={i18n.locale}
					name="language"
					id="language"
					onchange={() => {
						i18n.setLocale(i18n.locale);
					}}
				>
					{#each locales as l}
						<option selected={i18n.locale === l} value={l}>{l}</option>
					{/each}
				</select>
			</label>
		</div>
		<p class="mt-6 text-center text-gray-700">
			<span class="italic">Filipe Freire</span> | 2021 - {new Date().getFullYear()}
		</p>
	</footer>
</main>

<style>
	button {
		padding: 1ch 3ch;
		border: 2px solid hsl(209, 36%, 47%);
		background-color: hsl(209, 80%, 70%);
		color: hsl(0, 0%, 100%);
		font-weight: 600;
		border-radius: 5px;
		text-transform: uppercase;
		letter-spacing: 1.8px;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.39);
		box-shadow:
			rgba(17, 17, 26, 0.05) 0px 1px 0px,
			rgba(17, 17, 26, 0.1) 0px 0px 8px;
		transition: all 100ms ease-out;
		max-width: 250px;
		margin: 0 auto;
		display: block;
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

	@media screen and (max-width: 400px) {
		button.saveBtn {
			margin-top: 1rem;
		}
	}
</style>
