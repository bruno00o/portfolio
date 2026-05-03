---
title: Homelab
num: "003"
locale: fr
kind: "Personnel · 2025 → {present}"
stack: [Kubernetes, Talos, Cilium, Flux]
desc: "Un cluster Kubernetes auto-hébergé qui fait tourner mes apps, mes services personnels et la maison connectée."
order: 3
repo: https://github.com/bruno00o/homelab
---

## Le contexte

Pendant mes études, j'ai eu un VPS DigitalOcean gratuit grâce au programme étudiant. Quand le crédit s'est arrêté, je n'ai pas trop apprécié le coût pour une VM aussi petite. À côté, j'ai longtemps fait tourner des services à la maison sur un Raspberry Pi, jusqu'au jour où je l'ai cassé en le débranchant pendant une mise à jour...

Deux problèmes à résoudre : le coût qui s'accumule à mesure que les projets s'ajoutent, et la fragilité d'un setup à un seul point de panne. Le homelab Kubernetes répond aux deux, et m'offre en plus un terrain pour apprendre vraiment l'outil même quand je n'ai pas beaucoup de temps à y consacrer.

## Ce qui tourne

Mes projets en ligne (ce portfolio, Aroma, random-gif). Home Assistant pour piloter la maison, avec Frigate pour la vidéosurveillance locale. Authentik en SSO pour tout le reste et une stack d'observabilité complète.
