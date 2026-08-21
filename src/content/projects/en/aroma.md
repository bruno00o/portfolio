---
title: Aroma
num: "001"
locale: en
kind: "2022 → 2025"
stack: [Next.js, PocketBase, PWA]
desc: "A web app to check your university schedule on mobile, where ADE (the platform used by several French universities) is barely usable on a phone. Current class and room visible the moment you open it."
order: 1
repo: https://github.com/bruno00o/aroma
live: https://aroma.seilliebert.dev
---

## Context

At Université Gustave Eiffel, schedules go through ADE. No mobile app, and the web UI is barely usable on a phone. Between two classes, finding my next room was taking too long. Aroma starts from that use case: open the app, see the current class and where to go. The rest came on top: merging several schedules (lectures, tutorials, labs, electives), sharing with friends, apprenticeship calendar.

## Why a PWA over a native app?

Aroma is a PWA (Progressive Web App) for several reasons. First, because shipping a native app is usually paid (App Store, Google Play) and more involved (certificates, builds, updates). With a PWA, I can deploy instantly online, no stores in the loop. Second, because a PWA was enough for what I needed: an icon on the home screen and a responsive interface.

If I were to redo this project today and was willing to spend the money, I'd go with React Native and Expo, which is to me the best compromise for a mobile app in 2026.

## Why PocketBase?

My first version used Express and was a pain to maintain. Same logic as the PWA choice: PocketBase is fully free, easy to deploy and maintain for a solo project. It gives you a database, a REST API, auth, and even a dashboard to manage data. It was perfect for me, especially since I didn't need anything fancy on the backend, just basic CRUD.

Same as for the PWA, if I were to redo this project today, I'd go with a custom API, probably Hono and better-auth, because where I thought I wouldn't need any backend code, I ended up having to write some to fetch the ADE calendars inside PocketBase, which would have been easier with a custom API.

## Two versions

**V1 (2022)**: Vue.js (Options then Composition API), Express backend, todo list for homework.

**V2 (2024)**: full rewrite without the todo list (barely used). Next.js, shadcn/ui, PocketBase replacing Express and the separate database. Same core features, far less code to maintain.

Throughout the project I had a handful of regular users, my closest classmates. Little appetite to share more widely, out of fear of having to manage a community, bugs, feature requests.

Everything was deployed on a VPS with Docker Compose and Traefik, with a CI/CD pipeline on GitHub Actions and Watchtower for auto-updates.

## Today

Shut down in 2025 at the end of my studies. Back online in 2026, no new features.
