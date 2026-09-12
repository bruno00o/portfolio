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

export type XpItem = {
  from: string;
  to?: string;
  roleKey: TranslationKey;
  subKey: TranslationKey;
  tagKey?: TranslationKey;
};

export const work: XpItem[] = [
  { from: '2025', roleKey: 'xp.w1.role', subKey: 'xp.w1.sub', tagKey: 'xp.w1.tag' },
  { from: '2023', to: '2025', roleKey: 'xp.w2.role', subKey: 'xp.w2.sub', tagKey: 'xp.w2.tag' },
  { from: '2022', to: '2023', roleKey: 'xp.w3.role', subKey: 'xp.w3.sub', tagKey: 'xp.w3.tag' },
];

export const education: XpItem[] = [
  { from: '2023', to: '2025', roleKey: 'xp.e1.role', subKey: 'xp.e1.sub', tagKey: 'xp.e1.tag' },
  { from: '2020', to: '2023', roleKey: 'xp.e2.role', subKey: 'xp.e2.sub' },
];

export const now = {
  building: ['Jarvis', 'GameRoute'],
  cluster: 'Going Merry',
};

export function formatDates(it: XpItem, lang: Lang): string {
  const t = useTranslations(lang);
  return `${it.from} → ${it.to ?? t('common.present')}`;
}
