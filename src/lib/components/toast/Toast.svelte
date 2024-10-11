<script>
	import { toast } from '$lib/stores/toast';

	import ToastItem from './ToastItem.svelte';
</script>

<ul class="not-prose fixed right-3 bottom-3 z-40">
	{#each $toast as item (item.id)}
		<ToastItem {item} />
	{/each}
</ul>
