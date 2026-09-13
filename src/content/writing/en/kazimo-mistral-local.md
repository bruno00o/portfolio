---
title: "Kazimo runs on Mistral, and could run at home"
dek: "Kazimo's whole voice chain, transcription, agent and synthesis, goes through Mistral models with open weights. Why I want to run it locally, and what machine it would take, in three estimated tiers."
tags: [Local AI]
locale: en
date: 2026-09-13
---

Kazimo is my connected object for an elderly person living alone, for whom the smartphone, the computer or the tablet are obstacles: a photo frame with a camera, calls, and a voice assistant that can show things on screen. One rule of the project since day one: no proprietary SDK hard-wired anywhere. Everything goes through an OpenAI-compatible layer, with a base URL and a model name in configuration.

Today that URL points to Mistral's API. Picking Mistral comes down to open weights first: every model the object calls exists as a download, and what I want is to run them at home. I wanted to know what that would cost in memory. The figures below are estimates, worked out from the published model sizes and the usual quantizations. I have not measured anything on a machine yet.

## Why local

Today, sound leaves the machine in two cases only: the question asked after the wake word, and the follow-up window opened at the end of an answer, to carry on without saying the name again. The wake word (an openWakeWord model trained for the name, run in ONNX) and voice activity detection (Silero) already run locally and take almost no memory. Those two windows are kept short out of caution, because what they capture goes to an API.

With the models at home, that caution goes away. I would be less afraid of leaving the microphone open longer, and that is what the idea of proactivity on the project page calls for: an object that comes to the person when she walks into the room, reads the messages and missed calls, and keeps listening to what she answers. An open microphone whose sound stays in the house is a trade-off I can defend.

## What runs today

The models the object calls, and their downloadable equivalent.

| Stage | API model | Open-weights equivalent |
|---|---|---|
| STT | voxtral-mini-latest | Voxtral Mini 4B Realtime (4B) |
| LLM | mistral-small-latest | Mistral Small 4 (119B total, 6.5B active, MoE) |
| TTS | voxtral-mini-tts-latest | Voxtral 4B TTS (4.1B) |

## Why Mistral?

All three stages from the same provider, first: STT, LLM and TTS with the same API, the same account, the same bill.

And open weights on all three. Building on the API with models I can download means that on the day of the switch, the object answers with the same model. There is no question set to rerun and no prompt to readjust.

## Running the same thing at home

The identical tier is about 100 GB, so a machine with 128 GB of unified memory, Strix Halo class:

- Mistral Small 4 in Q4: ~70 GB, plus ~3 GB of KV cache
- Voxtral TTS in BF16: ~10 GB
- Voxtral Realtime in BF16: ~9 GB
- OS, the kazimod daemon and Chromium: ~6 GB

Voice (STT and TTS) and the system take 20 to 25 GB in every case. Only the LLM changes from one tier to the next.

## Three tiers

| Tier | LLM | STT | Total | Machine |
|---|---|---|---|---|
| Minimum | Ministral 3 8B Q4 (~5 GB) or Qwen 3.5 9B Q4 (~6 GB) | Q8 (~5 GB) | ≈ 26 GB | 32 GB |
| Medium | Ministral 3 14B Q8 (~15 GB) or Gemma 4 26B A4B Q4 (~16 GB) | BF16 (~9 GB) | ≈ 40 GB | 48 GB, 64 GB comfortable |
| Max | Mistral Small 4 Q4 (~73 GB) | BF16 (~9 GB) | ≈ 100 GB | 128 GB |

TTS stays in BF16 (~10 GB) at every tier: quantizing it risks damaging the voice.

What each tier implies:

- **Minimum**: the weakest at tool calling and interface composition, the agent's two jobs.
- **Medium**: Ministral 14B stays in the same family as the cloud model, so less behavioral drift. Gemma 4 26B A4B is faster and probably better multilingual. Qwen3.6 35B A3B is an alternative at this tier, but it pushes the total to ~62 GB, so a 64 GB machine.
- **Max**: the same model as in the cloud, with no question set to rerun.

The tier will depend on the machine I can add to the homelab, and on what the Minimum tier really delivers at tool calling once measured. Until then the API stays in place, and the plan is for local to replace it one day.
