<script lang="ts">
	import Toast from '$lib/components/toast/Toast.svelte';
	import { locale, locales, t } from '$lib/i18n';
	import '../app.postcss';
</script>

<svelte:head>
	<title>{$t('title')}</title>
</svelte:head>

<Toast />

<label class="block pl-4 pt-2" for="language">
	{$t('languageLabel')}
	<select
		class="block rounded-md border border-blue-300 bg-blue-100 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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

<slot />
