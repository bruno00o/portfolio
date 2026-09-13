import type { Lang, TranslationKey } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';

export type StackRow = { labelKey: TranslationKey; items: string[] };

export const stackRows: StackRow[] = [
  { labelKey: 'stack.languages', items: ['TypeScript', 'Java', 'Scala', 'Kotlin', 'C/C++', 'Python', 'PHP', 'Go', 'Rust'] },
  { labelKey: 'stack.data', items: ['Spark', 'Kafka', 'SQL', 'Neo4j', 'ClickHouse', 'MongoDB', 'Redis'] },
  { labelKey: 'stack.infra', items: ['Docker', 'Kubernetes', 'Talos'] },
  { labelKey: 'stack.frameworks', items: ['Next.js', 'Tanstack Start', 'Java Spring', 'Hono', 'Tauri'] },
  { labelKey: 'stack.ci', items: ['GitHub Actions', 'GitLab CI'] },
  { labelKey: 'stack.ai', items: ['Claude', 'MCP', 'Ollama', 'LM Studio'] },
];

// Dates are ISO months. The home shows years only, the CV shows months.
export type WorkId = 'w1' | 'w2' | 'w3';

export type XpItem<Id extends string = string> = {
  id: Id;
  from: string;
  to?: string;
  roleKey: TranslationKey;
  subKey: TranslationKey;
  tagKey?: TranslationKey;
};

export const work: XpItem<WorkId>[] = [
  { id: 'w1', from: '2025-09', roleKey: 'xp.w1.role', subKey: 'xp.w1.sub', tagKey: 'xp.w1.tag' },
  { id: 'w2', from: '2023-09', to: '2025-09', roleKey: 'xp.w2.role', subKey: 'xp.w2.sub', tagKey: 'xp.w2.tag' },
  { id: 'w3', from: '2022-06', to: '2023-06', roleKey: 'xp.w3.role', subKey: 'xp.w3.sub', tagKey: 'xp.w3.tag' },
];

export type EducationId = 'e1' | 'e2';

export const education: XpItem<EducationId>[] = [
  { id: 'e1', from: '2023-09', to: '2025-06', roleKey: 'xp.e1.role', subKey: 'xp.e1.sub', tagKey: 'xp.e1.tag' },
  { id: 'e2', from: '2020-09', to: '2023-06', roleKey: 'xp.e2.role', subKey: 'xp.e2.sub' },
];

export const now = {
  building: ['Kazimo', 'Jarvis', 'GameRoute'],
  cluster: 'Going Merry',
};

export function formatDates(it: XpItem, lang: Lang): string {
  const t = useTranslations(lang);
  return `${it.from.slice(0, 4)} → ${it.to?.slice(0, 4) ?? t('common.present')}`;
}

export function formatMonthRange(it: XpItem, lang: Lang): string {
  const t = useTranslations(lang);
  const month = (iso: string) =>
    new Date(`${iso}-01T00:00:00Z`).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  // Hyphen rather than the site's arrow: ATS date-range parsers expect it.
  return `${month(it.from)} - ${it.to ? month(it.to) : t('common.present')}`;
}
