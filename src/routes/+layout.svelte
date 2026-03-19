<script lang="ts">
	import Toast from '$lib/components/toast/Toast.svelte';
	import { i18n } from '$lib/i18n.svelte';
	import '../app.postcss';

	let { children } = $props();
</script>

<svelte:head>
	<title>{i18n.t('title')}</title>
</svelte:head>

<Toast />

{@render children()}
