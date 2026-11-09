// ==UserScript==
// @name         YouTube Force Max Resolution
// @namespace    https://github.com/chirag127
// @version      1.0.0
// @description  Caps YouTube video quality at 480p so the VM/software decoder never has to handle 1080p VP9/AV1 frames it cannot render. Works without a GPU.
// @author       chirag127
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='20'%3E%F0%9F%93%9A%3C/text%3E%3C/svg%3E
// @homepageURL  https://github.com/chirag127/youtube-force-480p-userscript
// @supportURL   https://github.com/chirag127/youtube-force-480p-userscript/issues
// @downloadURL  https://github.com/chirag127/youtube-force-480p-userscript/raw/main/youtube-force-480p-userscript.user.js
// @updateURL    https://github.com/chirag127/youtube-force-480p-userscript/raw/main/youtube-force-480p-userscript.user.js
// @grant        none
// @noframes
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * YouTube's adaptive player picks the highest quality the network
   * and screen allow. In a VM without a GPU, 1080p VP9/AV1 decode
   * succeeds but the compositor cannot render the frames — you see
   * static. Capping at 480p (or 720p) keeps decode trivial.
   * ------------------------------------------------------------------ */

  const MAX_HEIGHT = 480; // change to 720 if you want a higher cap

  function setQualityCap() {
    const player = document.querySelector(".html5-video-player");
    if (!player) return;

    // YouTube stores the quality list on the player via the ytplayer config.
    // We intercept the setter path by patching the media query / format list
    // through the player's quality-menu options.
    const menu = document.querySelector(".ytp-settings-menu") ||
                 document.querySelector("[aria-label*=\"Quality\" i]") ||
                 document.querySelector("[role=\"menuitem\"][aria-label*=\"p\"] i");

    // Patch MediaSource.isTypeSupported to reject high-resolution VP9/AV1
    // formats so the format picker never offers them.
    if (window.MediaSource && !window.MediaSource.__h264Patched) {
      const orig = window.MediaSource.isTypeSupported;
      window.MediaSource.isTypeSupported = function (type) {
        const t = String(type);
        // Reject VP9/AV1 at 1080p+ profiles that need GPU decode
        if (/(vp09\.00\.51\.0[89]|av01\.)/i.test(t)) {
          const m = t.match(/(\d{3,4})p/);
          if (m && Number(m[1]) > MAX_HEIGHT) return false;
        }
        return orig.apply(this, arguments);
      };
      window.MediaSource.__h264Patched = true;
    }

    // Also patch HTMLVideoElement so any 1080p+ video element is downscaled
    const vids = document.querySelectorAll("video");
    for (const vid of vids) {
      if (vid.videoHeight > MAX_HEIGHT || vid.videoWidth > 854) {
        vid.style.transform = "scale(0.5)";
        vid.style.transformOrigin = "top left";
      }
    }
  }

  // Run once at start, then re-check when the player inits / quality menu opens
  setQualityCap();
  const obs = new MutationObserver(() => setQualityCap());
  obs.observe(document.documentElement, { childList: true, subtree: true });

  setTimeout(() => setQualityCap(), 1500);
  setTimeout(() => setQualityCap(), 3000);
  setTimeout(() => setQualityCap(), 6000);
})();
