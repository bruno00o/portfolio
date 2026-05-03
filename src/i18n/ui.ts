export const languages = ['en', 'fr'] as const;
export type Lang = (typeof languages)[number];

export const defaultLang: Lang = 'en';

export const ogLocales: Record<Lang, string> = {
  en: 'en_US',
  fr: 'fr_FR',
};

const en = {
  // ---------- META ----------
  'meta.title': 'Bruno Seilliebert · Software engineer',
  'meta.description':
    'Bruno Seilliebert · Software engineer. I build systems end-to-end, from the data pipeline to the pixel.',

  // ---------- NAV ----------
  'nav.work': 'Work',
  'nav.writing': 'Notes',
  'nav.now': 'Now',
  'nav.contact': 'Contact',
  'nav.drag_hint': '// drag me',

  // ---------- HERO ----------
  'hero.eyebrow': 'Paris · currently at SFR',
  'hero.title': 'Software engineer',
  'hero.oneliner':
    "I enjoy building systems end-to-end, from the data to the display. I'm currently helping build a real-time digital twin of the SFR network.",

  // ---------- PROJECTS (chrome only, entries live in content collection) ----------
  'work.label': 'Selected work',

  // ---------- STACK ----------
  'stack.label': 'Stack',
  'stack.languages': 'Languages',
  'stack.data': 'Data',
  'stack.infra': 'Infra',
  'stack.frameworks': 'Frameworks',
  'stack.ci': 'CI/CD',
  'stack.ai': 'AI',

  // ---------- EXPERIENCE ----------
  'xp.label': 'Experience',
  'xp.edu_label': 'Education',
  'xp.entries': 'entries',
  'xp.entry': 'entry',
  'common.present': 'present',
  'xp.w1.role': 'Software engineer',
  'xp.w1.sub': 'SFR',
  'xp.w1.tag': 'Full-time',
  'xp.w2.role': 'Software engineer',
  'xp.w2.sub': 'SFR',
  'xp.w2.tag': 'Apprenticeship',
  'xp.w3.role': 'Web & mobile developer',
  'xp.w3.sub': 'Kynova',
  'xp.w3.tag': 'Apprenticeship',
  'xp.e1.role': "Master's, Software & Data Engineering",
  'xp.e1.sub': 'Université Gustave Eiffel',
  'xp.e1.tag': 'Apprenticeship',
  'xp.e2.role': "Bachelor's, Computer Science",
  'xp.e2.sub': 'Université Gustave Eiffel',
  'xp.e2.tag': '',

  // ---------- NOW ----------
  'now.label': 'Now',
  'now.city': 'Paris',
  'now.building': 'building',
  'now.exploring': 'exploring',
  'now.running': 'running',
  'now.exploring_text': 'Local LLMs.',
  'now.running_pre': 'A homelab Kubernetes cluster named ',

  // ---------- WRITING (chrome only) ----------
  'writing.label': 'Notes',
  'writing.notes': 'notes',
  'writing.archive': 'archive',
  'writing.draft': 'DRAFT',

  // ---------- DETAIL ----------
  'detail.empty.project': '// full write-up coming',
  'detail.empty.post': '// full write-up coming',
  'detail.links.repo': 'Source',
  'detail.links.live': 'Live',

  // ---------- CONTACT ----------
  'contact.label': 'Contact',
  'contact.copied': '// copied',

  // ---------- FOOTER ----------
  'footer.copy': '© Bruno · {year}',

  // ---------- TOGGLES (aria) ----------
  'toggle.theme': 'Toggle theme',
  'toggle.lang': 'Switch language',
} as const;

export type TranslationKey = keyof typeof en;

const fr: Record<TranslationKey, string> = {
  'meta.title': 'Bruno Seilliebert · Ingénieur logiciel',
  'meta.description':
    "Bruno Seilliebert · Ingénieur logiciel. Je construis des systèmes de bout en bout, du pipeline de données jusqu'au pixel.",

  'nav.work': 'Projets',
  'nav.writing': 'Notes',
  'nav.now': 'Actuel',
  'nav.contact': 'Contact',
  'nav.drag_hint': '// attrape-moi',

  'hero.eyebrow': 'Paris · actuellement chez SFR',
  'hero.title': 'Ingénieur logiciel',
  'hero.oneliner':
    "J'aime construire des systèmes de bout en bout, de la donnée jusqu'à l'affichage. Je participe actuellement à la construction d'un jumeau numérique temps réel du réseau SFR.",

  'work.label': 'Projets sélectionnés',

  'stack.label': 'Stack',
  'stack.languages': 'Langages',
  'stack.data': 'Données',
  'stack.infra': 'Infra',
  'stack.frameworks': 'Frameworks',
  'stack.ci': 'CI/CD',
  'stack.ai': 'IA',

  'xp.label': 'Expérience',
  'xp.edu_label': 'Formation',
  'xp.entries': 'entrées',
  'xp.entry': 'entrée',
  'common.present': "aujourd'hui",
  'xp.w1.role': 'Ingénieur logiciel',
  'xp.w1.sub': 'SFR',
  'xp.w1.tag': 'CDI',
  'xp.w2.role': 'Ingénieur logiciel',
  'xp.w2.sub': 'SFR',
  'xp.w2.tag': 'alternance',
  'xp.w3.role': 'Développeur web et mobile',
  'xp.w3.sub': 'Kynova',
  'xp.w3.tag': 'alternance',
  'xp.e1.role': 'Master, Logiciel et Ingénierie des Données',
  'xp.e1.sub': 'Université Gustave Eiffel',
  'xp.e1.tag': 'alternance',
  'xp.e2.role': 'Licence, Informatique',
  'xp.e2.sub': 'Université Gustave Eiffel',
  'xp.e2.tag': '',

  'now.label': 'Actuel',
  'now.city': 'Paris',
  'now.building': 'je construis',
  'now.exploring': "j'explore",
  'now.running': 'je fais tourner',
  'now.exploring_text': 'LLM locaux.',
  'now.running_pre': 'Un cluster Kubernetes homelab nommé ',

  'writing.label': 'Notes',
  'writing.notes': 'notes',
  'writing.archive': 'archive',
  'writing.draft': 'BROUILLON',

  'detail.empty.project': '// contenu à venir',
  'detail.empty.post': '// article à venir',
  'detail.links.repo': 'Code source',
  'detail.links.live': 'En ligne',

  'contact.label': 'Contact',
  'contact.copied': '// copié',

  'footer.copy': '© Bruno · {year}',

  'toggle.theme': 'Changer le thème',
  'toggle.lang': 'Changer de langue',
};

export const ui = { en, fr } as const;
