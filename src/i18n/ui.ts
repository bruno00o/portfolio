export const languages = ['en', 'fr'] as const;
export type Lang = (typeof languages)[number];

export const defaultLang: Lang = 'en';

export const ogLocales: Record<Lang, string> = {
  en: 'en_US',
  fr: 'fr_FR',
};

const en = {
  // ---------- META ----------
  'meta.title': 'Bruno Seilliebert, software engineer',
  'meta.description':
    'Bruno Seilliebert, software engineer. I build systems end-to-end, from the data pipeline to the pixel.',

  // ---------- LLMS.TXT ----------
  'llms.markdown':
    'Every project and note is also available as raw Markdown: append .md to its URL.',
  'llms.alternate': 'French version of this file:',

  // ---------- NAV ----------
  'nav.work': 'Work',
  'nav.writing': 'Notes',
  'nav.contact': 'Contact',
  'nav.home': 'Home',

  // ---------- HERO ----------
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
  'writing.draft': 'Draft',

  // ---------- DETAIL ----------
  'detail.empty.project': '// full write-up coming',
  'detail.empty.post': '// full write-up coming',
  'detail.links.repo': 'Source',
  'detail.links.live': 'Live',

  // ---------- CONTACT ----------
  'contact.label': 'Contact',
  'contact.copied': '// copied',

  // ---------- FOOTER ----------
  'footer.built': 'Built with Astro',
  'footer.legal': 'Legal notice',

  // ---------- TOGGLES (aria) ----------
  'toggle.theme': 'Toggle theme',
  'toggle.lang': 'Switch language',
} as const;

export type TranslationKey = keyof typeof en;

const fr: Record<TranslationKey, string> = {
  'meta.title': 'Bruno Seilliebert, ingénieur logiciel',
  'meta.description':
    "Bruno Seilliebert, ingénieur logiciel. Je construis des systèmes de bout en bout, du pipeline de données jusqu'au pixel.",

  'llms.markdown':
    "Chaque projet et chaque note est aussi disponible en Markdown brut : ajoutez .md à son URL.",
  'llms.alternate': "Version anglaise de ce fichier :",

  'nav.work': 'Projets',
  'nav.writing': 'Notes',
  'nav.contact': 'Contact',
  'nav.home': 'Accueil',

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
  'common.present': "aujourd'hui",
  'xp.w1.role': 'Ingénieur logiciel',
  'xp.w1.sub': 'SFR',
  'xp.w1.tag': 'CDI',
  'xp.w2.role': 'Ingénieur logiciel',
  'xp.w2.sub': 'SFR',
  'xp.w2.tag': 'Alternance',
  'xp.w3.role': 'Développeur web et mobile',
  'xp.w3.sub': 'Kynova',
  'xp.w3.tag': 'Alternance',
  'xp.e1.role': 'Master, Logiciel et Ingénierie des Données',
  'xp.e1.sub': 'Université Gustave Eiffel',
  'xp.e1.tag': 'Alternance',
  'xp.e2.role': 'Licence, Informatique',
  'xp.e2.sub': 'Université Gustave Eiffel',

  'now.label': 'Actuel',
  'now.city': 'Paris',
  'now.building': 'je construis',
  'now.exploring': "j'explore",
  'now.running': 'je fais tourner',
  'now.exploring_text': 'LLM locaux.',
  'now.running_pre': 'Un cluster Kubernetes homelab nommé ',

  'writing.label': 'Notes',
  'writing.draft': 'Brouillon',

  'detail.empty.project': '// contenu à venir',
  'detail.empty.post': '// article à venir',
  'detail.links.repo': 'Code source',
  'detail.links.live': 'En ligne',

  'contact.label': 'Contact',
  'contact.copied': '// copié',

  'footer.built': 'Fait avec Astro',
  'footer.legal': 'Mentions légales',

  'toggle.theme': 'Changer le thème',
  'toggle.lang': 'Changer de langue',
};

export const ui = { en, fr } as const;
