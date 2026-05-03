---
title: GameRoute
num: "002"
locale: en
kind: "Personal · 2026 → {present}"
stack: [Tauri, Rust, React]
desc: "A Windows app that automatically identifies the servers of running games and traces the network path to them."
order: 2
repo: https://github.com/bruno00o/gameroute
---

## Context

At SFR, I'm building the network map. As a customer too, I wanted to see where my traffic was going when I played, which lets me cross-check both viewpoints: the network from the operator side, and what I see from the client side.

## How it works

The app runs in the background and uses `pktmon` to capture network packets. It matches the running game process with the IPs seen through `pktmon`.

Once the game exits, the app runs a traceroute to every identified IP and shows the results in a graphical interface, with server geolocation thanks to MaxMind GeoLite2.

## Why Tauri?

I wanted a native, lightweight Windows app. Tauri lets me write the heavy network logic in Rust (capture, parsing, traceroute) and the UI in TypeScript/React.

## Today

First public release in 2026. Open source, Windows binary on GitHub. No code signing for now: Windows SmartScreen will show a warning on first launch.
