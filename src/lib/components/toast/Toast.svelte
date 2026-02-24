<script>
	import { toast } from '$lib/stores/toast.svelte';

	import ToastItem from './ToastItem.svelte';
</script>

<ul class="not-prose fixed bottom-3 right-3 z-40">
	{#each toast.all as item (item.id)}
		<ToastItem {item} />
	{/each}
</ul>
