<script lang="ts">
	import Toast from '$lib/components/toast/Toast.svelte';
	import { locale, locales, t } from '$lib/i18n';
	import '../app.postcss';
</script>

<Toast />

<label class="block pt-2 pl-4" for="language">
	{$t('languageLabel')}
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
