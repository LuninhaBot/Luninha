import {CustomClient} from '#types/CustomClient';
import {readdir} from 'fs/promises';

type CommandKeysObject = typeof import('#locales/pt_BR/commands/data.json');
type CommandNamesKeysObject =
  typeof import('#locales/pt_BR/commandNames/data.json');
type CommandDescriptionsKeysObject =
  typeof import('#locales/pt_BR/commandDescriptions/data.json');
type CommandCategoriesKeysObject =
  typeof import('#locales/pt_BR/commandCategories/data.json');

export type CommandKeys = keyof CommandKeysObject;
export type CommandNamesKeys = keyof CommandNamesKeysObject;
export type CommandDescriptionsKeys = keyof CommandDescriptionsKeysObject;
export type CommandCategoriesKeys = keyof CommandCategoriesKeysObject;

type AllLocaleKeys =
  | CommandKeys
  | CommandNamesKeys
  | CommandDescriptionsKeys
  | CommandCategoriesKeys;

export type SupportedLocales = 'pt_BR' | 'en_US';
export type LocaleCategories =
  | 'commands'
  | 'commandNames'
  | 'commandDescriptions'
  | 'commandCategories';

export class LocaleManager {
  cache: Record<
    LocaleCategories,
    Record<SupportedLocales, Record<AllLocaleKeys, string>>
  >;
  constructor(public client: CustomClient) {
    // @ts-expect-error We are initializing the cache object
    this.cache = {};
    this.loadLocales();
  }

  // Load all locales from ../locales/[language_code]/[category]/data.json
  async loadLocales() {
    const locales = (await readdir('./locales')) as SupportedLocales[];

    for (const locale of locales) {
      const categories = (await readdir(
          `./locales/${locale}`
      )) as LocaleCategories[];

      for (const category of categories) {
        const data = await import(`#locales/${locale}/${category}/data.json`);

        // Check if the category exists in the cache
        // @ts-expect-error We are initializing the locale object if it doesn't exist
        if (!this.cache[category]) this.cache[category] = {};

        // Set the locale data
        this.cache[category][locale] = data;
      }
    }
  }

  get(
    locale: SupportedLocales,
    path: `commandDescriptions:${CommandDescriptionsKeys}`
  ): string;
  get(
    locale: SupportedLocales,
    path: `commandCategories:${CommandCategoriesKeys}`
  ): string;
  get(
    locale: SupportedLocales,
    path: `commandNames:${CommandNamesKeys}`
  ): string;
  get(lang: SupportedLocales, path: string, ...args: string[]) {
    const [category, key] = path.split(':') as [
      LocaleCategories,
      AllLocaleKeys
    ];
    if (!this.cache[category]) return `!!{${category}.${key}}!!`;

    const baseCategory = this.cache[category];
    const baseLocale = baseCategory[lang];

    const locale = baseLocale[key];
    if (locale) {
      if (!args.length) return locale;

      // Use regex to replace {{strings}} with the provided arguments
      return locale.replace(/{{(\d+)}}/g, (_, index) => args[index] as string);
    }

    return `!!{${category}.${key}}!!`;
  }
}
