---
title: Jarvis
num: "004"
locale: fr
kind: "Personnel · 2026 → {present}"
stack: [TypeScript, Bun, Ollama, mlx-audio, MCP]
desc: "Un assistant vocal local pour la maison, inspiré du Jarvis de Tony Stark (comme tout assistant qui se respecte), branché sur les services de mon homelab."
order: 4
---

## Le contexte

Depuis l'avènement des modèles de langage, j'ai comme l'impression qu'on ne parle plus autant de confidentialité. Moi le premier, avant ChatGPT, je m'étais débarrassé de Chrome et de Google, au profit de DuckDuckGo et de bien d'autres outils plus respectueux de la vie privée. Mais avec les LLM en ligne, on s'est tous un peu résignés à confier nos données à de nouveaux acteurs.

C'est pour cette raison que je crois énormément au potentiel des modèles en local à l'avenir, pour retrouver la maîtrise de nos données.

Dernièrement, j'ai été impressionné par les derniers modèles TTS et STT de Mistral, ainsi que par les performances de Qwen 3.5/3.6 et Gemma 4. Je me suis dit que c'était l'occasion parfaite pour me lancer dans un projet d'assistant vocal local, qui pourrait faire le lien entre mes services maison et mes besoins quotidiens, sans jamais sortir de chez moi.

## Le fonctionnement

Voix captée et transcrite en texte via le modèle STT de Mistral. Le texte alimente une boucle ReAct sur un LLM local, qui décide quoi faire en appelant des serveurs MCP : Home Assistant pour la maison, Kubernetes pour mes services. La réponse est synthétisée en voix via le modèle TTS de Mistral.

## Aujourd'hui

En développement. Les briques s'assemblent au fil des sorties de modèles, le projet avance par à-coups quand l'écosystème open source me donne de quoi avancer.
