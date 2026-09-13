---
title: claude-dial
num: "005"
locale: fr
kind: "2026"
stack: [Go, C++, ESP32, BLE, PlatformIO]
desc: "Un compagnon de bureau pour Claude Code : un écran rond qui montre ce que fait chaque session, et une molette pour approuver ou refuser une permission sans quitter le terminal."
order: 5
repo: https://github.com/bruno00o/claude-dial
video: /videos/claude-dial.mp4
---

## Le contexte

Un ami utilise beaucoup Claude Code, avec plusieurs sessions en parallèle. Quand l'une d'elles demande une permission, il faut d'abord la retrouver parmi les terminaux. Je voulais lui faire un cadeau, et ça a donné un objet de bureau : un M5Stack Dial, un petit écran rond avec une molette, qui affiche ce que fait chaque session et qui approuve ou refuse une permission sans quitter le terminal. Et finalement, j'en profite bien aussi.

## Le fonctionnement

Deux moitiés. Un démon en Go sur le Mac, sans aucune dépendance externe, reçoit les hooks de Claude Code sur localhost. Il tient un état par session (au travail, au repos, bloquée, permission demandée) et pilote l'objet en Bluetooth Low Energy. De l'autre côté, le firmware du Dial, en C++ avec M5Unified et NimBLE, liste les sessions sur l'écran rond. Quand l'une d'elles demande une permission, il prend tout l'écran : la commande en entier, en rouge si elle paraît risquée, et trois réponses au bout de la molette, autoriser une fois, toujours autoriser, refuser.

Une règle depuis le premier jour : si l'objet est éteint ou absent, Claude Code se comporte exactement comme d'habitude. Elle découle du transport. Les hooks appellent un port local ; si le démon ne tourne pas, l'appel échoue en quelques millisecondes et Claude Code repasse par son prompt habituel. Pas de réponse du Dial dans les temps, même chose.

Les hooks arrivent comme des événements isolés plutôt que comme un flux. Un refus tapé dans le terminal ne déclenche aucun hook, et un arrêt peut être manqué. L'état est donc tenu à jour par des hooks de présence plus denses et par un balayage périodique qui renvoie au repos les états transitoires trop vieux.

Le bord de l'écran sert aussi de jauge : il se remplit avec la part de la fenêtre de cinq heures de tokens déjà consommée, lue dans les transcriptions locales de Claude Code. Pas de clé d'API, et ça marche hors ligne.

Un simulateur web parle le même JSON que le Dial, ce qui a permis de développer tout ce qui est au-dessus du transport sans le matériel.

## Pourquoi Go ?

Pour un seul binaire sans dépendances, que Homebrew installe et lance comme un service à l'ouverture de session. Le firmware, lui, est en C++ parce que c'est le langage des bibliothèques M5Stack et de NimBLE.

## Aujourd'hui

Publié, en version 1.1. Installation par Homebrew, le démon tourne en service à l'ouverture de session, et le Dial met à jour son propre firmware en Bluetooth quand le pont est plus récent que lui. Un Dial vierge se flashe en USB depuis la même commande.
