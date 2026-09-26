# The Vibe Check 👀

A playful, flirty, mobile-first private two-person vibe test: pick your side of the story, answer separately, then reveal what actually lines up.

## Production status

**v1.0 — production-ready.** The app has completed its release-candidate regression gate. See `RELEASE-QA.md` for the permanent QA matrix.

## Experience

1. Person 1 starts the 27-question Vibe Check and answers privately.
2. The app creates the private two-person invitation/session flow.
3. Person 2 completes their side without seeing Person 1's answers.
4. Results unlock only through the reveal experience after both sides are complete.
5. Results surface alignment, differences, mutual reveals, and **Next Move** activities aimed at the lowest-scoring categories.
6. The final privacy-sensitive question retains its special reveal rules and is not treated like an ordinary scored answer.

## Included

- Complete 27-question Vibe Check
- Private two-person server-synced session flow
- Share/invitation experience + Private Reveal Link
- Results & Reveal 2.0
- Lowest-score **Next Move** activities
- Preserved Q27 privacy behavior
- Mobile-first interaction polish
- Installable PWA with offline app shell
- Interrupted-test Resume / Start Over support
- Connectivity and invalid/expired-link handling
- Integrated QA mode and PWA regression presets

## Privacy and connectivity

Partner answers remain hidden during the test-taking flow and are surfaced only through the intended reveal experience. Server-synced invitations, session status, and reveals require an internet connection; the local app shell and supported in-progress state can remain available offline.

## QA

Use the repository QA entry point / QA mode for fast aligned, mixed, privacy, reveal, resume, and PWA regression scenarios. `RELEASE-QA.md` is the release gate and should be updated whenever a future change affects a checked flow.

## Version

Current production milestone: **1.0.0**.
