<script lang="ts">
	import Toast from '$lib/components/toast/Toast.svelte';
	import { t } from '$lib/i18n';
	import '../app.postcss';

	let { children } = $props();
</script>

<svelte:head>
	<title>{$t('title')}</title>
</svelte:head>

<Toast />

{@render children()}
