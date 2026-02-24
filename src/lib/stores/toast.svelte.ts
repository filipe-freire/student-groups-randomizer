export type IToast = {
	duration: number;
	id: number;
	text: string;
	type: 'success' | 'error' | 'warning' | 'info';
};

type AddToastOptions = Partial<Omit<IToast, 'id'>>;

const DEFAULT_OPTIONS = {
	duration: 5000,
	text: '',
	type: 'success'
} satisfies Partial<IToast>;

class ToastStore {
	// Using the $state rune for fine-grained reactivity
	#toasts = $state<IToast[]>([]);
	#id = 0;

	// Getter to access the toast list
	get all() {
		return this.#toasts;
	}

	/**
	 * Sends new toast to the store
	 */
	add(options?: AddToastOptions) {
		const entry = {
			...DEFAULT_OPTIONS,
			...options,
			id: this.#id++
		} satisfies IToast;

		// In Svelte 5, we can push directly to the array
		this.#toasts.push(entry);

		// Auto-remove if duration is set
		if (entry.duration > 0) {
			setTimeout(() => this.remove(entry.id), entry.duration);
		}
	}

	/**
	 * Removes toast from the store
	 */
	remove(id: number) {
		this.#toasts = this.#toasts.filter((t) => t.id !== id);
	}
}

// Export a single instance of the class
export const toast = new ToastStore();
