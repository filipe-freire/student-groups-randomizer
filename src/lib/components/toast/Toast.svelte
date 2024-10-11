<script>
	import { toast } from '$lib/stores/toast';

	import ToastItem from './ToastItem.svelte';
</script>

<ul class="not-prose fixed right-6 bottom-6 z-40">
	{#each $toast as item (item.id)}
		<ToastItem {item} />
	{/each}
</ul>
