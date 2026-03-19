import { translations, type ILocale, type ITranslation } from './translations';

export const locales = Object.keys(translations) as ReadonlyArray<string>;

function checkForLocaleInLocalStorage(): ILocale {
	const localeFromLocalStorage = localStorage.getItem('lang') || '🇺🇸 en';

	if (!locales.includes(localeFromLocalStorage)) {
		return '🇺🇸 en';
	}
	return localeFromLocalStorage as ILocale;
}

function translate(locale: ILocale, key: ITranslation, vars: Record<string, string>) {
	if (!key) throw new Error('no key provided to $t()');
	if (!locale) throw new Error(`no translation for key "${key}"`);

	let text = translations[locale][key];

	if (!text) throw new Error(`no translation found for ${locale}.${key}`);

	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g');
		text = text.replace(regex, vars[k]);
	});

	return text;
}

class I18nStore {
	locale = $state<ILocale>(checkForLocaleInLocalStorage());

	get t() {
		return (key: ITranslation, vars: Record<string, string> = {}) =>
			translate(this.locale, key, vars);
	}

	setLocale(newLocale: ILocale) {
		localStorage.setItem('lang', newLocale);
		this.locale = newLocale;
	}
}

export const i18n = new I18nStore();
