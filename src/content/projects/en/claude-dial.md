---
title: claude-dial
num: "005"
locale: en
kind: "2026"
stack: [Go, C++, ESP32, BLE, PlatformIO]
desc: "A desk companion for Claude Code: a round screen that shows what each session is doing, and a dial to approve or reject a permission without leaving the terminal."
order: 5
repo: https://github.com/bruno00o/claude-dial
video: /videos/claude-dial.mp4
---

## Context

A friend of mine uses Claude Code a lot, with several sessions running side by side. When one of them asks for a permission, it first has to be found among the terminals. I wanted to make a present, and it turned into a desk object: an M5Stack Dial, a small round screen with a rotary knob, that shows what each session is doing and approves or rejects a permission without leaving the terminal. In the end I get plenty of use out of it too.

## How it works

Two halves. A Go daemon on the Mac, with no external dependency, receives Claude Code's hooks on localhost. It keeps one state per session (working, idle, blocked, permission requested) and drives the object over Bluetooth Low Energy. On the other side, the Dial's firmware, in C++ with M5Unified and NimBLE, lists the sessions on the round screen. When one of them asks for a permission, it takes over the whole screen: the command in full, in red when it looks risky, and three answers at the end of the knob, allow once, always allow, reject.

One rule since day one: if the object is off or absent, Claude Code behaves exactly as usual. It falls out of the transport. The hooks call a local port; when the daemon is down, the call fails within a few milliseconds and Claude Code goes back to its usual prompt. No answer from the Dial in time, same thing.

Hooks arrive as isolated events rather than a live feed. A refusal typed in the terminal fires no hook, and a stop can be missed. So the state is kept honest by denser liveness hooks and by a periodic sweep that sends stale transient states back to idle.

The rim of the screen doubles as a gauge: it fills with the share of the five-hour token window already spent, read from Claude Code's local transcripts. No API key, and it works offline.

A web simulator speaks the same JSON as the Dial, which made it possible to build everything above the transport without the hardware.

## Why Go?

For a single binary with no dependencies, which Homebrew installs and starts as a service at login. The firmware is C++ because that is the language of the M5Stack libraries and of NimBLE.

## Today

Released, at version 1.1. Installed with Homebrew, the daemon runs as a service at login, and the Dial updates its own firmware over Bluetooth when the bridge is newer than it is. A blank Dial is flashed over USB from the same command.
