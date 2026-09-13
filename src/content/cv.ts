import type { Lang } from '../i18n/ui';
import type { WorkId, EducationId } from './profile';

export type CvXp = { lead: string; bullets: string[] };
export type CvSkillRow = { label: string; items: string[] };

export type CvCopy = {
  labels: {
    profile: string;
    projects: string;
    skills: string;
    languages: string;
    certifications: string;
  };
  summary: string;
  // Shorter than the home's stack on purpose: only what is practiced, most relevant first.
  skills: CvSkillRow[];
  work: Record<WorkId, CvXp>;
  // Honours or a one-line note per education entry, shown after the dates. Empty string: nothing.
  education: Record<EducationId, string>;
  languages: string[];
  certifications: string[];
};

export const cvCopy: Record<Lang, CvCopy> = {
  en: {
    labels: {
      profile: 'Summary',
      projects: 'Projects',
      skills: 'Skills',
      languages: 'Spoken languages',
      certifications: 'Certifications',
    },
    summary:
      'Software Engineer, three years at SFR on the real-time digital twin of the network: data ingestion, graph, real-time web interface and AI agents for root cause analysis, built with the network teams that use them. I ship and run what I build, from the data to the screen. On the side, a homelab and personal projects, from electronics to the web.',
    skills: [
      { label: 'Languages', items: ['TypeScript', 'Python', 'Go', 'Java'] },
      { label: 'Infra', items: ['Docker', 'Kubernetes', 'Talos', 'Linux', 'GitHub Actions', 'GitLab CI'] },
      { label: 'Frameworks', items: ['TanStack Start', 'Next.js', 'Vue.js', 'Django', 'Spring'] },
      { label: 'Data', items: ['ClickHouse', 'Neo4j', 'Kafka', 'SQL', 'Redis'] },
      { label: 'AI', items: ['MCP', 'Deep Agents', 'Claude', 'Ollama'] },
    ],
    work: {
      w1: {
        lead: 'Real-time digital twin of the network: 100k+ devices, dozens of users.',
        bullets: [
          '**Ingestion of SNMP metrics** (Zabbix via Kafka), network discovery (S3) and syslog into ClickHouse, plus the transformations feeding the graph: a log is visible in the interface in **under a minute** (Vector, Go)',
          '**Neo4j graph of the network**, Graph Data Science algorithms (max flow) flagging isolated routers',
          '**Real-time web application** on the state of the network, refreshed over SSE (TypeScript, TanStack Start)',
          '**AI agents for root cause analysis** in natural language: three MCP servers (Neo4j, ClickHouse, NetBox) and a custom RAG tool (Deep Agents)',
          'Started the AI agent work alone, then **mentored an intern** on it',
          '**Seven services in production**, run autonomously from provisioning to upgrades, plus one OpenShift deployment',
        ],
      },
      w2: {
        lead: 'Internal tools for the network engineering teams, start of the digital twin project.',
        bullets: [
          '**Network visualization application** with Neo4j and Next.js, to analyze and optimize the infrastructure',
          '**Router configuration tool** with Vue.js and Django, plus Python automation scripts cutting deployment time and manual errors',
        ],
      },
      w3: {
        lead: "Websites and mobile apps for the agency's clients.",
        bullets: [
          '**Websites and web and mobile apps** for a range of clients, from the design mockups to delivery and maintenance (SEO, CMS)',
        ],
      },
    },
    education: { e1: 'Honours (mention Bien)', e2: 'Honours (mention Assez Bien)' },
    languages: ['French (native)', 'English (professional, TOEIC 930/990)'],
    certifications: ['Neo4j Certified Professional'],
  },
  fr: {
    labels: {
      profile: 'Profil',
      projects: 'Projets',
      skills: 'Compétences',
      languages: 'Langues',
      certifications: 'Certifications',
    },
    summary:
      "Ingénieur logiciel, trois ans chez SFR sur le jumeau numérique temps réel du réseau : ingestion des données, graphe, interface web temps réel et agents IA d'analyse de causes racines, construits avec les équipes réseau qui les utilisent. Je livre et j'exploite ce que je construis, de la donnée à l'écran. À côté, un homelab et des projets personnels, de l'électronique au web.",
    skills: [
      { label: 'Langages', items: ['TypeScript', 'Python', 'Go', 'Java'] },
      { label: 'Infra', items: ['Docker', 'Kubernetes', 'Talos', 'Linux', 'GitHub Actions', 'GitLab CI'] },
      { label: 'Frameworks', items: ['TanStack Start', 'Next.js', 'Vue.js', 'Django', 'Spring'] },
      { label: 'Données', items: ['ClickHouse', 'Neo4j', 'Kafka', 'SQL', 'Redis'] },
      { label: 'IA', items: ['MCP', 'Deep Agents', 'Claude', 'Ollama'] },
    ],
    work: {
      w1: {
        lead: "Jumeau numérique temps réel du réseau : 100 000+ équipements, des dizaines d'utilisateurs.",
        bullets: [
          "**Ingestion de métriques SNMP** (Zabbix via Kafka), découverte réseau (S3) et syslog vers ClickHouse, et transformations alimentant le graphe : un log est visible dans l'interface en **moins d'une minute** (Vector, Go)",
          "**Graphe Neo4j du réseau**, algorithmes Graph Data Science (max flow) détectant les routeurs isolés",
          "**Application web temps réel** sur l'état du réseau, rafraîchie en SSE (TypeScript, TanStack Start)",
          "**Agents IA pour l'analyse de causes racines** en langage naturel : trois serveurs MCP (Neo4j, ClickHouse, NetBox) et un outil RAG maison (Deep Agents)",
          "Chantier des agents IA démarré seul, puis **encadrement d'un stagiaire** sur le projet",
          '**Sept services en production**, exploités en autonomie du provisionnement aux mises à jour ; un déploiement OpenShift sur un projet annexe',
        ],
      },
      w2: {
        lead: "Outils internes des équipes d'ingénierie réseau, début du projet de jumeau numérique.",
        bullets: [
          "**Application de visualisation du réseau** avec Neo4j et Next.js, pour analyser et optimiser l'infrastructure",
          "**Outil de configuration de routeurs** avec Vue.js et Django, et scripts d'automatisation Python réduisant le temps de déploiement et les erreurs manuelles",
        ],
      },
      w3: {
        lead: "Sites web et applications mobiles pour les clients de l'agence.",
        bullets: [
          "**Sites et applications web et mobiles** pour divers clients, de la maquette graphique à la livraison et à la maintenance (SEO, CMS)",
        ],
      },
    },
    education: { e1: 'Mention Bien', e2: 'Mention Assez Bien' },
    languages: ['Français (langue maternelle)', 'Anglais (professionnel, TOEIC 930/990)'],
    certifications: ['Neo4j Certified Professional'],
  },
};
