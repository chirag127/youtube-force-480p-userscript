# AGENTS.md - youtube-force-480p-userscript

Single-file userscript. `youtube-force-480p-userscript.user.js` at repo root IS the product. No build, no deps, `@grant none`.

## Method

YouTube's adaptive player picks the highest quality the network and screen allow. In a VM
without a GPU, 1080p VP9/AV1 decode can succeed but the compositor cannot render the frames
— you see static. This script caps quality at 480p by:

1. Patching `MediaSource.isTypeSupported` so VP9/AV1 formats above 480p are reported as unsupported
2. Applying a CSS transform scale to any video element above 480p

## Rules

- One file, zero deps, `@grant none`. Runs at `document-start`.
- Change `MAX_HEIGHT` in the source to adjust the cap (default 480).
- No hotkeys, no UI panel — silent background patch.

## Install docs

Shared guide: https://github.com/chirag127/userscript-install-guide — link it, never duplicate install steps.

## Test

`sctl install ./youtube-force-480p-userscript.user.js`, open YouTube, play a video, check
**Stats for nerds** — resolution should stay at 480p or lower. Confirm no static.

<!-- okf-requirement -->
## 🧠 OKF documentation requirement (mandatory)

**Every repository in this collection MUST ship an Open Knowledge Format (OKF) bundle in `okf/`.**

A repository without `okf/` is **incomplete**, even if the script works.

### What must exist

```
okf/
├── bundle.md      overview of the collection
├── index.md       catalogue of concepts
├── concepts/      all shared concept notes (architecture, metadata, scriptcat-and-sctl,
│                  testing, youtube-dom, okf-requirement)
└── scripts/       THIS repository's own script note (where one applies)
```

### Rules

1. **Never hand-edit** a repository's `okf/` copy. The canonical bundle is
   `docs/okf/` in the `c:\ws` monorepo.
2. After changing the canonical bundle, regenerate every copy:
   `node okf/sync-okf.mjs`
3. Verify nothing has drifted: `node okf/sync-okf.mjs --check` - must exit `0`.
4. `README.md` must link to `okf/`. `AGENTS.md` (this file) must restate this requirement.
5. When adding a new script, add its note at `docs/okf/scripts/<repo-name>.md` in the canonical
   bundle first, then sync.
6. Record durable knowledge here as a concept note: fragile selectors, platform rules,
   rejected alternatives, and mistakes that already cost time.

Full detail: [`docs/okf/concepts/okf-requirement.md`](docs/okf/concepts/okf-requirement.md)
