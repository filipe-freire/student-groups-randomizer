<script lang="ts">
	import { toast, type IToast } from '$lib/stores/toast.svelte';
	import { Cancel, CheckCircle, Error, Info } from '@steeze-ui/material-design-icons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import Close from '../Icons/Close.svelte';

	export let item: IToast;

	const ICONS = {
		info: Info,
		error: Cancel,
		success: CheckCircle,
		warning: Error
	};

	const START = 1;
	const END = 0;
	const progress = tweened(START);
	const hasDuration = item.duration > 0;

	function close() {
		toast.remove(item.id);
	}

	function pause() {
		if (!hasDuration) return;

		progress.set($progress);
	}

	async function resume() {
		if (!hasDuration) return;

		const progressLeft = END + $progress;
		const remainingDuration = item.duration * progressLeft;

		await progress.set(END, {
			duration: remainingDuration
		});

		close();
	}

	onMount(() => {
		resume();
	});
</script>

<li
	class={twMerge(
		'shadow-toast relative mb-2 w-fit min-w-80 max-w-80 overflow-hidden rounded-md border-l-8 bg-slate-100 py-2 pl-4 pr-10 shadow-lg before:w-full',
		item.type === 'info' && 'border-blue-400 before:bg-blue-400',
		item.type === 'error' && 'border-red-400 before:bg-red-400',
		item.type === 'success' && 'border-green-400 before:bg-green-400',
		item.type === 'warning' && 'border-yellow-400 before:bg-yellow-400'
	)}
	on:mouseenter={pause}
	on:mouseleave={resume}
	transition:fade
>
	<progress
		max={START}
		value={$progress}
		class={twMerge(
			'absolute left-0 top-0 flex h-1 w-full appearance-none rounded-e-md [&::-webkit-progress-bar]:bg-slate-200',
			item.type === 'info' &&
				'[&::-moz-progress-bar]:bg-blue-400 [&::-webkit-progress-value]:bg-blue-400',
			item.type === 'error' &&
				'[&::-moz-progress-bar]:bg-red-400 [&::-webkit-progress-value]:bg-red-400',
			item.type === 'success' &&
				'[&::-moz-progress-bar]:bg-green-400 [&::-webkit-progress-value]:bg-green-400',
			item.type === 'warning' &&
				'[&::-moz-progress-bar]:bg-yellow-400 [&::-webkit-progress-value]:bg-yellow-400'
		)}
	></progress>
	<div class="flex items-center gap-3">
		<Icon
			class={twMerge(
				'min-w-7',
				item.type === 'info' && 'text-blue-400',
				item.type === 'error' && 'text-red-400',
				item.type === 'success' && 'text-green-400',
				item.type === 'warning' && 'text-yellow-400'
			)}
			size="30"
			src={ICONS[item.type]}
		/>

		<div class="flex flex-col gap-2">
			<p class="text-xl font-semibold capitalize">
				{item.type}
			</p>
			<p class="line-clamp-3 text-sm">
				{item.text}
			</p>
		</div>
	</div>

	<button class="absolute right-2 top-2 flex rounded-md" on:click={close}>
		<Close size="24" />
	</button>
</li>
