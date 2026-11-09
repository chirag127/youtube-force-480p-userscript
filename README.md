# ↓ YouTube Force Max Resolution

Caps YouTube video quality at **480p** so a VM or software decoder never has to handle
1080p VP9/AV1 frames it cannot render. No extension, no GPU required.

## Why this exists

YouTube's HTML5 player picks the highest quality the network and screen allow. In a VM
without a GPU (or with a limited virtual GPU), 1080p VP9/AV1 decode can succeed but the
compositor cannot render the decoded frames — you see a gray/green static pattern while
the audio plays. Capping at 480p keeps decode trivial and playable.

## Install

First read the shared **[userscript install guide](https://github.com/chirag127/userscript-install-guide)** (how to set up ScriptCat / Tampermonkey). Then click:

**[Install youtube-force-480p-userscript.user.js](https://github.com/chirag127/youtube-force-480p-userscript/raw/main/youtube-force-480p-userscript.user.js)**

## Use

Open YouTube. The script automatically:

1. Patches `MediaSource.isTypeSupported` so VP9/AV1 formats above 480p are reported as unsupported
2. Downscaling transform on any video element above 480p

Change `MAX_HEIGHT` in the source to `720` if you want a higher cap.

## Verify it's working

Open DevTools → Console — you should see no codec errors. Right-click the player → **Stats for nerds** — the resolution should stay at 480p or lower.

## License

[MIT](LICENSE) © 2026 chirag127

<!-- okf-bundle -->
## 🧠 Knowledge bundle (OKF)

This repository ships its documentation as an
**Open Knowledge Format** bundle in `okf/` —
written so both a human and an AI agent can understand the script without reading the code.

| File | Contents |
|------|----------|
| `okf/bundle.md` | Overview of the collection |
| `okf/index.md` | Catalogue of concepts |
| `okf/concepts/` | Shared knowledge (architecture, metadata, testing, DOM notes) |
| `okf/scripts/` | This script's own note (where applicable) |

Regenerate every repository's copy from the canonical bundle with `node okf/sync-okf.mjs`.
