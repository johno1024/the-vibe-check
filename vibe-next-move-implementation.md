# Vibe Check — score-driven Next Move

This branch adds `next-move.js`, an isolated post-results enhancement modeled on NO WARNING's weak-score targeting while keeping Vibe Check's own purple/pink identity and relationship-focused tone.

## Intended integration
Load `next-move.js` immediately after the existing inline application script. It reads the five already-rendered score cards and replaces only the existing `#conversationStarters` content after results appear.

## Behavior
- Finds the three lowest score categories.
- Builds three varied prompts from Communication, Emotional Connection, Quality Time, Chemistry, and Relationship Expectations.
- Renames the existing Now What card to `Your next move / Try This Next 👀`.
- Does not read or display Q27.
- Does not modify questions, scoring, invitation encoding, partner flow, Blind Reveal, Mutual Reveal, or privacy logic.

## QA
Use the existing `?qa=1` result scenarios to confirm the enhancement changes with score profiles and that Q27 privacy remains intact.
