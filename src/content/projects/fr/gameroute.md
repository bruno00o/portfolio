---
title: GameRoute
num: "002"
locale: fr
kind: "2026 → {present}"
stack: [Tauri, Rust, React]
desc: "Une app Windows qui identifie automatiquement les serveurs des jeux en cours et trace le chemin réseau jusqu'à eux."
order: 2
repo: https://github.com/bruno00o/gameroute
---

## Le contexte

Chez SFR, je construis la carte du réseau. Étant aussi client, j'avais envie de voir par où mon trafic passait quand je jouais, ce qui me permet de croiser les deux points de vue : le réseau côté opérateur, et ce que je vois côté client.

## Le fonctionnement

L'application tourne en arrière-plan et lance `pktmon` pour capturer les paquets réseau. Elle fait l'association entre le processus du jeu qui tourne et les IP vues via `pktmon`.

Une fois le jeu quitté, l'app lance un traceroute vers toutes les IP identifiées et affiche les résultats dans une interface graphique, avec la géolocalisation des serveurs grâce à MaxMind GeoLite2.

## Pourquoi Tauri ?

Je voulais une app Windows native, légère. Tauri me permet d'écrire la logique réseau lourde en Rust (capture, parsing, traceroute) et l'interface en TypeScript/React.

## Aujourd'hui

Première version publique en 2026. App open source, binaire Windows disponible sur GitHub. Pas de signature de code pour l'instant : Windows SmartScreen affichera un avertissement au premier lancement.
