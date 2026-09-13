---
title: "Kazimo tourne sur Mistral, et pourrait tourner à la maison"
dek: "Toute la chaîne vocale de Kazimo, transcription, agent et synthèse, passe par des modèles Mistral à poids ouverts. Pourquoi je veux la faire tourner en local, et ce qu'il faudrait comme machine, en trois paliers estimés."
tags: [Local AI]
locale: fr
date: 2026-09-13
---

Kazimo, c'est mon objet connecté pour une personne âgée isolée, pour qui le smartphone, l'ordinateur ou la tablette sont des obstacles : un cadre photo avec une caméra, des appels, et un assistant vocal qui peut montrer des choses à l'écran. Une règle du projet depuis le premier jour : aucun SDK propriétaire câblé en dur. Tout passe par une couche compatible OpenAI, avec une URL de base et un nom de modèle en configuration.

Aujourd'hui cette URL pointe vers l'API de Mistral. Le choix de Mistral tient d'abord aux poids ouverts : chaque modèle que l'objet appelle existe en version téléchargeable, et mon envie est de les faire tourner à la maison. Je voulais savoir ce que ça coûterait en mémoire. Les chiffres qui suivent sont des estimations, calculées à partir des tailles publiées des modèles et des quantifications courantes. Je n'ai encore rien mesuré sur une machine.

## Pourquoi en local

Aujourd'hui, le son quitte la machine dans deux cas seulement : la question posée après le wake word, et la fenêtre de suivi ouverte à la fin d'une réponse, pour enchaîner sans redire le nom. Le wake word (un modèle openWakeWord entraîné pour le nom, exécuté en ONNX) et la détection de voix (Silero) tournent déjà en local et ne pèsent presque rien en mémoire. Ces deux fenêtres sont courtes par prudence, parce que ce qu'elles captent part vers une API.

Avec les modèles à la maison, cette prudence tombe. J'aurais moins peur de laisser le micro ouvert plus longtemps, et c'est ce que demande l'idée de proactivité décrite sur la page du projet : un objet qui vient vers la personne quand elle entre dans la pièce, lit les messages et les appels manqués, et reste à l'écoute de ce qu'elle répond. Un micro ouvert dont le son reste dans la maison est un compromis que je peux défendre.

## Ce qui tourne aujourd'hui

Les modèles que l'objet appelle, et leur équivalent téléchargeable.

| Étage | Modèle API | Équivalent en poids ouverts |
|---|---|---|
| STT | voxtral-mini-latest | Voxtral Mini 4B Realtime (4B) |
| LLM | mistral-small-latest | Mistral Small 4 (119B au total, 6,5B actifs, MoE) |
| TTS | voxtral-mini-tts-latest | Voxtral 4B TTS (4,1B) |

## Pourquoi Mistral ?

Les trois étages chez le même fournisseur, d'abord : STT, LLM et TTS avec la même API, le même compte, la même facture.

Et des poids ouverts sur les trois. Développer sur l'API avec des modèles que je peux télécharger veut dire que le jour de la bascule, l'objet répond avec le même modèle. Il n'y a ni jeu de questions à repasser, ni prompt à réajuster.

## Faire tourner la même chose à la maison

Le palier à l'identique représente environ 100 Go, donc une machine à 128 Go de mémoire unifiée, type Strix Halo :

- Mistral Small 4 en Q4 : ~70 Go, plus ~3 Go de cache KV
- Voxtral TTS en BF16 : ~10 Go
- Voxtral Realtime en BF16 : ~9 Go
- OS, le démon kazimod et Chromium : ~6 Go

La voix (STT et TTS) et le système prennent 20 à 25 Go dans tous les cas. Seul le LLM change d'un palier à l'autre.

## Trois paliers

| Palier | LLM | STT | Total | Machine |
|---|---|---|---|---|
| Minimum | Ministral 3 8B Q4 (~5 Go) ou Qwen 3.5 9B Q4 (~6 Go) | Q8 (~5 Go) | ≈ 26 Go | 32 Go |
| Medium | Ministral 3 14B Q8 (~15 Go) ou Gemma 4 26B A4B Q4 (~16 Go) | BF16 (~9 Go) | ≈ 40 Go | 48 Go, 64 Go confortable |
| Max | Mistral Small 4 Q4 (~73 Go) | BF16 (~9 Go) | ≈ 100 Go | 128 Go |

La TTS reste en BF16 (~10 Go) à tous les paliers : la quantifier risque d'abîmer la voix.

Ce que chaque palier implique :

- **Minimum** : c'est le moins bon en tool calling et en composition d'interface, les deux tâches de l'agent.
- **Medium** : Ministral 14B reste dans la même famille que le modèle cloud, donc moins de dérive de comportement. Gemma 4 26B A4B est plus rapide et probablement meilleur en multilingue. Qwen3.6 35B A3B est une alternative à ce palier, mais il pousse le total vers ~62 Go, donc une machine à 64 Go.
- **Max** : c'est le même modèle qu'en cloud, sans jeu de questions à repasser.

Le palier dépendra de la machine que je pourrai ajouter au homelab, et de ce que le palier Minimum donne réellement en tool calling une fois mesuré. En attendant, l'API reste en place, et le plan est que le local la remplace un jour.
