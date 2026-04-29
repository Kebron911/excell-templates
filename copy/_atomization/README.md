# Content Atomization — Templates

This folder holds the fill-in-the-blank source files for the weekly content engine.

**Spec:** [`docs/superpowers/specs/2026-04-29-content-atomization-engine.md`](../../docs/superpowers/specs/2026-04-29-content-atomization-engine.md)
**Runbook:** [`docs/runbooks/weekly-content-atomization.md`](../../docs/runbooks/weekly-content-atomization.md)

## Folder layout

```
_atomization/
├── README.md                    ← this file
├── topic-brief-template.md      ← Monday's first artifact — fill in to lock the topic
├── master-deck-template.md      ← the 10-slide source-of-truth template
├── atomization-map.md           ← per-platform transform reference (slide → artifact)
└── decks/                       ← one folder per weekly Master Deck
    └── YYYY-MM-DD-{slug}/
        ├── brief.md             ← copy of topic-brief-template, filled in
        ├── deck.md              ← copy of master-deck-template, filled in
        ├── audio-master.wav     ← single voiceover recording
        └── assets/
            ├── youtube-long.mp4
            ├── ig-carousel/      ← 1080×1350 PNGs
            ├── ig-reel.mp4
            ├── shorts/           ← short-1.mp4 ... short-N.mp4
            └── pins/             ← 1000×1500 pin variants
```

## How to use

1. **Monday:** copy `topic-brief-template.md` and `master-deck-template.md` into a new `decks/YYYY-MM-DD-{slug}/` folder. Fill in `brief.md`, then `deck.md`.
2. **Tue–Fri:** follow the runbook step-by-step. Every artifact lives inside the deck folder.
3. **Friday end-of-week:** the deck folder is now a self-contained record of one week of content. Don't move or rename it — engagement signals tag back to it.

## Why this folder is in `copy/`

Everything in `copy/` is user-facing draft material. The atomization templates are the source-of-truth from which all other `copy/` artifacts (blog posts, emails, pinterest pins, etsy listing copy) are generated. This folder is the upstream node in the dependency graph.
