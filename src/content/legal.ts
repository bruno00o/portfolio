import type { Lang } from '../i18n/ui';

export type LegalCopy = {
  title: string;
  publisher: { h: string; body: string; role: string };
  hosting: { h: string; lead: string; fr: string };
  ip: { h: string; body: string; source: string };
  data: { h: string; noCookies: string; storage: string; analytics: string };
  infra: { h: string; body: string; link: string };
  contact: { h: string };
};

export const legalCopy: Record<Lang, LegalCopy> = {
  en: {
    title: 'Legal notice',
    publisher: {
      h: 'Publisher',
      body: 'This site is published on a non-professional basis by Bruno Seilliebert.',
      role: 'Publication director: Bruno Seilliebert.',
    },
    hosting: {
      h: 'Hosting',
      lead: 'The site is served over the global network of Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, United States.',
      fr: 'French establishment: Cloudflare France SAS, 6 place de la Madeleine, 75008 Paris. Phone: +33 1 73 01 52 44.',
    },
    ip: {
      h: 'Intellectual property',
      body: 'Unless stated otherwise, the texts and images on this site are the work of its author.',
      source: 'The source code of the site is public:',
    },
    data: {
      h: 'Personal data',
      noCookies:
        'This site sets no cookies and collects no personal data through any form.',
      storage:
        'Two keys are written to your browser local storage, solely to remember preferences you set yourself: bruno-theme for the light or dark theme, and bruno-lang for the language. They never leave your browser.',
      analytics:
        'Audience measurement uses an Umami instance hosted by the publisher. It sets no cookies and builds no visitor profile.',
    },
    infra: {
      h: 'Infrastructure',
      body: 'The site is a set of static files, served to the public over the Cloudflare network from an origin I host myself: a Kubernetes cluster running at home, described in',
      link: 'Homelab',
    },
    contact: { h: 'Contact' },
  },
  fr: {
    title: 'Mentions légales',
    publisher: {
      h: 'Éditeur',
      body: 'Ce site est édité à titre non professionnel par Bruno Seilliebert.',
      role: 'Directeur de la publication : Bruno Seilliebert.',
    },
    hosting: {
      h: 'Hébergement',
      lead: "Le site est servi par le réseau global de Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis.",
      fr: 'Établissement français : Cloudflare France SAS, 6 place de la Madeleine, 75008 Paris. Téléphone : +33 1 73 01 52 44.',
    },
    ip: {
      h: 'Propriété intellectuelle',
      body: "Sauf mention contraire, les textes et les images de ce site sont l'œuvre de son auteur.",
      source: 'Le code source du site est public :',
    },
    data: {
      h: 'Données personnelles',
      noCookies:
        "Ce site ne dépose aucun cookie et ne collecte aucune donnée personnelle par formulaire.",
      storage:
        "Deux clés sont enregistrées dans le stockage local de votre navigateur, uniquement pour mémoriser des préférences que vous définissez vous-même : bruno-theme pour le thème clair ou sombre, et bruno-lang pour la langue. Elles ne quittent jamais votre navigateur.",
      analytics:
        "La mesure d'audience utilise une instance Umami hébergée par l'éditeur. Elle ne dépose aucun cookie et ne constitue aucun profil de visiteur.",
    },
    infra: {
      h: 'Infrastructure',
      body: "Le site est un ensemble de fichiers statiques, servis au public par le réseau Cloudflare depuis une origine que j'héberge moi-même : un cluster Kubernetes qui tourne chez moi, décrit dans",
      link: 'Homelab',
    },
    contact: { h: 'Contact' },
  },
};
