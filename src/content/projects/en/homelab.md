---
title: Homelab
num: "003"
locale: en
kind: "Personal · 2025 → {present}"
stack: [Kubernetes, Talos, Cilium, Flux]
desc: "A self-hosted Kubernetes cluster running my apps, my personal services and the connected home."
order: 3
repo: https://github.com/bruno00o/homelab
---

## Context

During my studies, I had a free DigitalOcean VPS thanks to the student program. When the credit ran out, I wasn't thrilled with the cost for such a small VM. On the side, I'd been running home services on a Raspberry Pi for a long time, until the day I bricked it by unplugging it mid-update...

Two problems to solve: cost piling up as projects keep adding up, and the fragility of a single-point-of-failure setup. The Kubernetes homelab answers both, and gives me a playground to actually learn the tool even when I don't have much time to spend on it.

## What runs on it

My online projects (this portfolio, Aroma, random-gif). Home Assistant to drive the house, with Frigate for local video surveillance. Authentik as SSO for everything else, plus a full observability stack.
