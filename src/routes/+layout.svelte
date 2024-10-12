<script lang="ts">
	import Toast from '$lib/components/toast/Toast.svelte';
	import { locale, locales, t } from '$lib/i18n';
	import '../app.postcss';
</script>

<svelte:head>
	<title>{$t('title')}</title>
</svelte:head>

<Toast />

<label class="block pt-2 pl-4" for="language">
	{$t('languageLabel')}
	<!-- 
	🐛 There is a bug in Prod, where the lang is loaded from LocalStorage but the select 
	input's state does not update accordingly, even though the locales are set correctly. 

	Does not happen on dev.
	-->
	<select
		class="bg-blue-100 border border-blue-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5"
		bind:value={$locale}
		name="language"
		id="language"
		onchange={() => localStorage.setItem('lang', $locale)}
	>
		{#each locales as l}
			<option value={l}>{l}</option>
		{/each}
	</select>
</label>

<slot />
