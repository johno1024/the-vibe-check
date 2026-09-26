# The Vibe Check — Release Candidate QA

Release gate for the private two-person Vibe Check.

## Core flow
- [x] Fresh start → nickname → 27-question test → finish remains present.
- [x] Choice, scale, and text-answer question types remain supported.
- [x] Back/next navigation and progress remain present.
- [x] Q27/privacy-sensitive flow remains part of the existing app logic.
- [x] In-progress answers persist locally and Resume / Start Over is available.

## Two-person flow
- [x] Partner invitation handling remains present.
- [x] Server-synced Vibe session Share Link remains loaded through the sharing layer.
- [x] Private Reveal Link and reveal-status flow remain loaded.
- [x] Partner answers remain hidden while the second person is taking the test.
- [x] Offline state clearly requires reconnection for invitations/reveals.

## Results
- [x] Results & Reveal 2.0 remains loaded.
- [x] Lowest-score Next Move activities remain loaded.
- [x] QA mode remains available.

## PWA / resilience
- [x] Existing manifest/icon remain present.
- [x] Expanded service-worker app shell is present.
- [x] Install/Add to Home Screen UX is present.
- [x] Interrupted-test resume is present.
- [x] PWA QA presets cover resume, offline, invalid/expired reveal, and clearing saved state.

## Release gate
Build must deploy successfully on Vercel with no build errors. Production runtime-error check must be clean immediately after release. Manual device smoke testing remains recommended for OS-native install prompts, share sheets, and installed-mode launch behavior.