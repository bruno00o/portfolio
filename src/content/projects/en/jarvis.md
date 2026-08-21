---
title: Jarvis
num: "004"
locale: en
kind: "2026 → {present}"
stack: [TypeScript, Bun, Ollama, mlx-audio, MCP]
desc: "A local voice assistant for the home, inspired by Tony Stark's Jarvis (as any self-respecting assistant should be), wired into my homelab services."
order: 4
---

## Context

Since language models took off, I get the feeling we don't talk about privacy as much anymore. I was the first to drop Chrome and Google before ChatGPT came along, in favor of DuckDuckGo and a bunch of other privacy-friendly tools. But with online LLMs, we've all kind of resigned ourselves to handing our data to new players.

That's why I deeply believe in the future of local models, as a way to take back control over our data.

Lately, I've been impressed by Mistral's latest TTS and STT models, and by what Qwen 3.5/3.6 and Gemma 4 can do. It felt like the perfect moment to start a local voice assistant project that could bridge my home services and my daily needs, without ever leaving the house.

## How it works

Voice captured and transcribed to text via Mistral's STT model. The text feeds a ReAct loop on a local LLM, which decides what to do by calling MCP servers: Home Assistant for the house, Kubernetes for my services. The response is synthesized back to voice via Mistral's TTS model.

## Today

In development. The pieces come together as new models drop, the project moves in fits and starts whenever the open source ecosystem gives me something to build on.
