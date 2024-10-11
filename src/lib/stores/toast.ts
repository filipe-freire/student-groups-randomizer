import { writable } from 'svelte/store';

export type IToast = {
	/**
	 * Duration in ms. 0 means infinite.
	 */
	duration: number;
	id: number;
	text: string;
	type: 'success' | 'error' | 'warning' | 'info';
	action?: {
		text: string;
		callback: VoidFunction;
	};
};

type AddToastOptions = Partial<Omit<IToast, 'id'>>;

const DEFAULT_OPTIONS = {
	duration: 5000,
	text: '',
	type: 'success'
} satisfies Partial<IToast>;

function createToast() {
	const toastStore = writable<IToast[]>([]);
	let id = 0;

	/**
	 * Sends new toast to the store
	 */
	function addToast(options?: AddToastOptions) {
		const entry = {
			...DEFAULT_OPTIONS,
			...options,
			id: id++
		} satisfies IToast;

		toastStore.update((toasts) => {
			return [...toasts, entry];
		});
	}

	/**
	 * Removes toast from the store
	 */
	function removeToast(id: number) {
		toastStore.update((toasts) => {
			return toasts.filter((toast) => toast.id !== id);
		});
	}

	return {
		subscribe: toastStore.subscribe,
		add: addToast,
		remove: removeToast
	};
}

export const toast = createToast();
