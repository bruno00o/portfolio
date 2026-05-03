---
title: "Claude meets Gaspard and helps me remember 5 years of CS classes"
dek: "An MCP server plugged into a LightRAG index (graph + vectors) over 5 years of class material, callable straight from claude.ai. All local on the Mac and the Talos cluster, zero tokens billed server-side."
tag: "RAG · MCP"
locale: en
date: 2026-05-02
---

The other day, on the Neo4j Browser, I wanted to run a simple Cypher query: find nodes with no relation between them. I thought: "Wait, isn't this something we covered in third year graph algorithms?". Pretty sure of it, but no way to find it again across five years of archives.

The idea of building a RAG over my class notes had been in the back of my head since I finished my studies, with no real urgency. This time I had the trigger, and the chance to dig into local LLMs along the way.

Meet Gaspard: an MCP server plugged into a LightRAG index (graph + vectors) over my 5 years of class material, callable straight from claude.ai.

## The corpus

The corpus was almost the hardest part to put together.

- a handful of my own files
- some scraping of the professors' websites (lucky I kept the links)
- the course PDFs I still had

In total: 959 files, after fairly aggressive filtering. I excluded raw source code (`.py`, `.java`, `.c`...), third-party notes, admin docs, and non-CS subjects (algebra, analysis...). Otherwise the knowledge graph clogs up with entities like `printf` or `getInstance` that pollute the searches.

## Why LightRAG instead of pure vector RAG?

Picking a knowledge graph over pure vector RAG is what changes everything on this corpus. Asking "what did I see about concurrency in master's?" returns a cluster of connected entities (`ReentrantLock`, `synchronized`, `volatile`...) instead of a list of isolated chunks. Across 5 years of studies, the concepts are interlinked (from third-year Java up to master's, from algorithmic complexity all the way through), and the qualitative jump from a KG on this kind of corpus is real.

Concretely, LightRAG needs two models to operate:

- an **embeddings** model, to vectorize the chunks at ingestion time and the queries at query time
- an **extraction LLM**, to identify the entities and relations that populate the knowledge graph

That double constraint drove every model choice from there.

## All local

The ambition was simple: zero external API, all local for ingestion. Except that on my 24 GB of Apple Silicon RAM, fitting both models at the same time is tight.

For the extraction LLM, I first wanted to try the biggest models I could run, to maximize quality (lfm2, Qwen3.6 27B), but with the embedding model alongside and the context, it didn't fit comfortably.

I fell back on one of Google's latest models, Gemma 4 E4B, which is a reasoning model by default. Bad news for structured extraction: LightRAG expects clean JSON, and the chain of thought messes up the output format while doubling latency for zero benefit on this kind of task. Luckily, LM Studio listed an Unsloth -it variant that disables reasoning, and that one runs well. As a bonus, Gemma 4 is vision-capable, so Docling (the tool I use for doc parsing) hands it the schemas and figures from the PDFs (automata, B-trees, algorithm graphs), it describes them, and they get indexed like regular text.

On the embeddings side, I'd also started with Qwen3-Embedding-8B, but combined with the extraction LLM it no longer fit in RAM. I switched to Qwen3-Embedding-0.6B: retrieval quality doesn't change significantly, it cuts the required RAM by ten, and it lets me host it on CPU in the cluster without pain.

## The MCP

LightRAG normally makes two LLM calls per query: one to extract the keywords, one to synthesize the answer. On a GPU-less cluster, that means paying for an API.

Except LightRAG exposes a `/query/data` endpoint that returns only the retrieved fragments (entities, relations, chunks, citations) without synthesis. And it accepts pre-extracted `hl_keywords` / `ll_keywords`, which short-circuits the first LLM call too. So the idea: push both LLM calls over to claude.ai.

1. Claude reads my question, derives the high/low-level keywords, calls my MCP with them.
2. The server does pure retrieval on Qdrant + Neo4j, returns the fragments.
3. Claude writes the answer, citing my files.

Server-side: zero tokens billed. My claude.ai subscription does all the LLM work. The MCP server itself fits in about fifty lines of Python (FastMCP).

## Deployment on Talos

On Talos (my personal k8s cluster), I first deployed the three databases LightRAG needs to store its state:

- **Qdrant** for vectors
- **Neo4j** (DozerDB) for the graph
- **Valkey** for the KV cache

The idea: during ingestion, the Mac writes directly to these databases over the LAN. Once ingestion is done, the query-only LightRAG I run on the cluster reuses the already-persisted data as is. The Mac becomes a stateless worker you turn off afterwards.

Ingestion side then: LM Studio + Gemma 4 E4B + Docling on the Mac, into the Talos databases. Slow: 5 passes, one per year of study, almost 3 days total.

Serving side on the cluster: no LLM hosted, only retrieval. The already-populated databases plus a llama.cpp server for embeddings (Qwen3-Embedding-0.6B Q8_0, accelerated on the nodes' Intel iGPU via Vulkan). I had initially gone with TEI, but OOM on 16 GB: llama.cpp is lighter and threw in the iGPU as a bonus.

The MCP server is exposed to claude.ai via a Cloudflare Tunnel.

## So, does it work?

To close the loop, I asked Claude the question that started it all.

![Screenshot of Claude answering through Gaspard on the question of conflict-free node lists, with citations to algorithmes_extraits.pdf, td04-enonce.pdf and algographes-02-parcours.pdf](./gaspard-independent-set.png)

Not just an answer, but two related concepts (Independent Set and graph coloring) with citations to the actual third-year PDFs.
