---
title: Aroma
num: "001"
locale: fr
kind: "2022 → 2025"
stack: [Next.js, PocketBase, PWA]
desc: "Une web app pour consulter son emploi du temps universitaire sur mobile, là où ADE (la plateforme utilisée par plusieurs universités françaises) n'est pas lisible sur mobile. Cours actuel et salle visibles à l'ouverture."
order: 1
repo: https://github.com/bruno00o/aroma
live: https://aroma.seilliebert.dev
---

## Le contexte

À l'Université Gustave Eiffel, les emplois du temps passent par ADE. Pas d'app mobile, et l'interface web sur téléphone est peu utilisable. Entre deux cours, retrouver sa prochaine salle me prenait trop de temps. Aroma part de cet usage : on ouvre l'app, on voit le cours actuel et où aller. Le reste est venu se greffer ensuite : fusion de plusieurs emplois du temps (CM, TD, TP, options), partage entre amis, calendrier d'alternance.

## Pourquoi une PWA plutôt qu'une app native ?

Aroma est une PWA (Progressive Web App) pour plusieurs raisons. D'abord, parce que le déploiement d'une app native est souvent payant (App Store, Google Play) et plus complexe (certificats, builds, mises à jour). Avec une PWA, je peux déployer instantanément en ligne, sans passer par des stores. Ensuite, parce que la PWA me suffisait pour mon besoin : avoir une icône sur l'écran d'accueil et une interface responsive.

Si je devais refaire ce projet aujourd'hui et que je voulais bien dépenser, je serais parti sur React Native avec Expo, ce qui est pour moi le meilleur compromis pour une app mobile en 2026.

## Pourquoi PocketBase ?

Ma première version utilisait Express et était complexe à maintenir. Pareil que pour le choix de la PWA, PocketBase est totalement gratuit, facile à déployer et à maintenir pour un projet solo. Il offre une base de données, une API REST, une authentification, et même un dashboard pour gérer les données. C'était parfait pour moi, surtout que je n'avais pas besoin de fonctionnalités très avancées côté backend, du simple CRUD.

Pareil que pour la PWA, si je devais refaire ce projet aujourd'hui, je partirais sur une API custom, sûrement avec Hono et better-auth, car là où je pensais ne pas avoir besoin de développer de fonctionnalités backend, j'ai finalement dû écrire un peu de code pour récupérer les calendriers d'ADE sur PocketBase, ce qui aurait été plus simple avec une API custom.

## Deux versions

**V1 (2022)** : Vue.js (Options puis Composition API), backend Express, todo list pour les devoirs.

**V2 (2024)** : reprise complète sans la todo list (peu utilisée). Next.js, shadcn/ui, PocketBase à la place d'Express et de la base séparée. Mêmes fonctions sur l'essentiel, beaucoup moins de code à maintenir.

Tout au long du projet, j'ai eu plusieurs utilisateurs réguliers, mes camarades les plus proches. Peu envie de partager à plus grande échelle, par peur de devoir gérer une communauté, des bugs, des demandes d'amélioration.

Tout était déployé sur un VPS avec Docker Compose et Traefik, avec une pipeline CI/CD sur GitHub Actions et Watchtower pour les mises à jour automatiques.

## Aujourd'hui

Coupé en 2025 à la fin de mes études. Remis en ligne en 2026, sans nouvelles features.
