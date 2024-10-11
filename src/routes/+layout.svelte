<script lang="ts">
	import Toast from '$lib/components/toast/Toast.svelte';
	import { locale, locales } from '$lib/i18n';
	import '../app.postcss';
</script>

<Toast />

<select bind:value={$locale} name="language" id="language">
	{#each locales as l}
		<option value={l}>{l}</option>
	{/each}
</select>

<slot />
