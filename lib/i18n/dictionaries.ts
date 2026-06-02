import { mn } from "./mn";
import { en } from "./en";

export type Lang = "mn" | "en";

export const dictionaries = { mn, en } as const;

export type Dictionary = typeof mn;

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang] ?? dictionaries.mn;
}

export const SUPPORTED_LANGS: Lang[] = ["mn", "en"];
export const DEFAULT_LANG: Lang = "mn";
