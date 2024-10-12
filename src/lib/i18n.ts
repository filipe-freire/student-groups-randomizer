import { derived, writable } from 'svelte/store';
import { translations, type ILocale, type ITranslation } from './translations';

export const locales = Object.keys(translations) as ReadonlyArray<string>;

function checkForLocaleInLocalStorage(): ILocale {
	const localeFromLocalStorage = localStorage.getItem('lang') || '🇺🇸 en';

	if (!locales.includes(localeFromLocalStorage)) {
		return '🇺🇸 en';
	}
	return localeFromLocalStorage as ILocale;
}

export const locale = writable<ILocale>(checkForLocaleInLocalStorage());

function translate(locale: ILocale, key: ITranslation, vars: Record<string, string>) {
	// Let's throw some errors if we're trying to use keys/locales that don't exist.
	// We could improve this by using Typescript and/or fallback values.
	if (!key) throw new Error('no key provided to $t()');
	if (!locale) throw new Error(`no translation for key "${key}"`);

	// Grab the translation from the translations object.
	let text = translations[locale][key];

	if (!text) throw new Error(`no translation found for ${locale}.${key}`);

	// Replace any passed in variables in the translation string.
	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g');
		text = text.replace(regex, vars[k]);
	});

	return text;
}

export const t = derived(
	locale,
	($locale) =>
		(key: ITranslation, vars = {}) =>
			translate($locale, key, vars)
);
