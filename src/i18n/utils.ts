import { defaultLang, languages, ui, type Lang, type TranslationKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if ((languages as readonly string[]).includes(maybeLang ?? '')) {
    return maybeLang as Lang;
  }
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return ui[lang][key];
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return normalized;
  if (normalized === '/') return `/${lang}`;
  return `/${lang}${normalized}`;
}

export function stripLangPrefix(pathname: string): string {
  for (const lang of languages) {
    if (lang === defaultLang) continue;
    if (pathname === `/${lang}` || pathname === `/${lang}/`) return '/';
    if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
  }
  return pathname;
}

export function getAlternatePath(currentUrl: URL, targetLang: Lang): string {
  const bare = stripLangPrefix(currentUrl.pathname);
  return getLocalizedPath(bare, targetLang);
}
