# Mission Control

Interactive space mission design and simulation game. Hackathon 2026.

## What is it about?
The player takes on the role of a mission engineer: they receive a contract (goal, orbit, budget and deadline), design the satellite and the rocket, launch it and manage 12 months of operations. At the end they get a report that explains how each decision affected the result.

## What problem does it solve?
Designing a space mission means balancing mass, power, data, budget, communications and orbital constraints. For people who rarely see a complete mission, those trade-offs feel abstract. Mission Control makes them tangible: every part you choose changes the resources, the risk and the science you can achieve.

## How it works
- **2 categories, 3 missions each:** Eye on Earth and Space Telescope.
- **One guided training per category:** a mission that walks the player through every screen, highlighting what to do next and explaining why.
- **3 difficulty levels:** Rookie, Skilled and Expert, which change the budget, deadline, risk and science goal.
- **Workshop:** you build the satellite (bus, instruments, support systems) and the rocket part by part, from the bottom up: Stage 1, boosters, upper stage and fairing. Each part limits which ones fit next.
- **Resources:** mass, power, data and budget, with reliability and build time as indicators.
- **Review:** a status checklist validates the design and lets you run ground tests before launch.
- **Operations:** 12 months with events and consequences.
- **Scoring:** science, resources, budget, decisions and design balance, with a local leaderboard.
- **Languages:** Spanish and English.

## Game flow
Home → Missions → Background → Workshop → Review → Launch → Operations → Report → Leaderboard

## Project structure
Folder and file names are in Spanish, as they appear in the code.

```
index.html / index.css / index.js   home screen
modulos/     one folder per screen (missions, background, workshop, review, launch,
             operations, report, leaderboard, glossary, how to play)
compartido/  theme, saved state, navigation, components, spacecraft drawing,
             confirmation dialog and training guide
nucleo/      game rules: calculations, validation, operations and scoring
datos/       catalog of parts, rockets, missions, difficulty levels, events,
             glossary and training steps
idioma/      English translations
```

## Demo
https://missioncontrol-hackathon.vercel.app

## Team
Santos Enoch González Pérez, Carlos Adrian Alarcón Valencia, Ivan Daniel Galdamez Corzo, Cristopher Gómez Pérez.
