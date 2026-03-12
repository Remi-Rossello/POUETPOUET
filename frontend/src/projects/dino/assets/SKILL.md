---
name: dino
description: "Use when: user types /dino and wants immediate Google Dino autoplay. Default behavior opens the game and starts an infinite background bot loop with auto-restart. Keywords: /dino, dino, trex, autoplay, infinite bot."
---

# Dino Skill

## Purpose
This skill defines the default `/dino` behavior.

When the user types `/dino`, immediately:
1. Open the Dino page.
2. Start an infinite autoplay bot in background mode.
3. Keep it running until the user explicitly asks to stop.

Use this when you want:
- instant no-questions autoplay on `/dino`
- a permanent continuous bot loop
- automatic restart after crashes
- a reliable start path without brittle element clicks

## Preconditions
- Browser control tools are available (`open_browser_page`, `run_playwright_code`).
- A page can be opened from the current session.
- The target game URL is reachable.

## Canonical Game URL
Use this page (stable for automation):
- `https://elgoog.im/t-rex/`

Note:
- The URL can redirect to `https://elgoog.im/dinosaur-game/`. This is expected.

## Slash Command Contract
- Trigger phrase: `/dino`
- Default action: do not run a short baseline test first.
- Required action: jump directly to continuous mode.
- Runtime mode: infinite background loop (`window.__dinoBotInterval`).
- Stop condition: only stop when user asks (for example: `stop dino`, `/dino stop`, `stop bot`).
- Tab policy: use exactly one Dino tab per session. Do not open duplicate tabs.

Single-tab enforcement:
- Before calling `open_browser_page`, check existing browser pages.
- If a page is already on `elgoog.im/t-rex` or `elgoog.im/dinosaur-game`, reuse its `pageId`.
- Call `open_browser_page` only when no Dino page exists.
- Never call `open_browser_page` more than once for a single `/dino` request.

## Step 1: Open the browser page
1. Inspect current browser pages first.
2. If a Dino page already exists (`https://elgoog.im/t-rex/` or `https://elgoog.im/dinosaur-game/`), reuse that `pageId`.
3. Otherwise call `open_browser_page` once with the Dino URL and save the returned `pageId`.
4. Reuse this same `pageId` for all next Playwright calls.

Expected outcome:
- The page title includes `Chrome Dinosaur Game`.
- The page URL resolves to the dinosaur game route.
- `window.Runner?.instance_` is available from `page.evaluate` in the main frame.

## Step 2: Start continuous mode immediately (default)
For `/dino`, this step is mandatory and should happen immediately after opening the page.

Fast-start rule:
- Fire one immediate `keydown` + short `keyup` jump pulse right after `Runner` is detected.
- If `playing` is still false after ~120 ms, fire a second pulse.
- Start the interval loop right away (do not wait for a warm-up delay).

Important reliability rule:
- Do not depend on clicking DOM refs or iframe body to start.
- Prefer direct `page.evaluate` keyboard events and bot injection in the main frame.
- Only attempt click/focus fallback if `Runner` is missing.

## Step 3: Improve behavior (optional tuning)
Use these tuning rules depending on requested style:

- `late jump` behavior:
  - reduce jump trigger distance (`dist < 70..90` range)
  - keep jump hold moderate (`120..170 ms`)

- `always big jump` behavior:
  - fixed long hold (`~220 ms`)
  - trigger on near obstacle only (`dist < ~95`)

- `triple cactus safer jump`:
  - merge nearby cactus into a cluster
  - if cluster count >= 3, increase hold and trigger a bit earlier

Cluster logic guideline:
- Start from first cactus width.
- Merge next cactus while gap <= `~44..52 px`.
- Compute `clusterSpan` and `clusterCount`.
- Use bigger hold when `clusterCount >= 3`.

## Step 4: Continuous mode (infinite loop)
For persistent autoplay, inject an interval into page scope:
- store id in `window.__dinoBotInterval`
- clear old interval before creating a new one
- auto-restart on crash
- trigger one initial jump to start if not already playing
- do not run post-start verification waits; start and keep running immediately

Reference continuous snippet:
```javascript
const status = await page.evaluate(() => {
  const r = window.Runner?.instance_;
  if (!r) return { ok: false, error: 'Runner not found' };

  if (window.__dinoBotInterval) {
    clearInterval(window.__dinoBotInterval);
    window.__dinoBotInterval = null;
  }

  const key = (type, code) => {
    document.dispatchEvent(
      new KeyboardEvent(type, { keyCode: code, which: code, bubbles: true })
    );
  };

  const bigJump = () => {
    key('keydown', 32);
    setTimeout(() => key('keyup', 32), 220);
  };

  const startPulse = () => {
    key('keydown', 32);
    setTimeout(() => key('keyup', 32), 120);
  };

  if (r.crashed) r.restart();
  if (!r.playing) {
    startPulse();
    setTimeout(() => {
      const rr = window.Runner?.instance_;
      if (rr && !rr.playing) startPulse();
    }, 120);
  }

  const tick = () => {
    const rr = window.Runner?.instance_;
    if (!rr) return;

    if (rr.crashed) {
      rr.restart();
      setTimeout(() => startPulse(), 60);
      return;
    }

    const o = (rr.horizon?.obstacles || [])[0];
    if (!o) return;

    const dist = o.xPos - rr.tRex.xPos;
    if (!rr.tRex.jumping && dist > 0 && dist < 95) {
      bigJump();
    }
  };

  tick();
  window.__dinoBotInterval = setInterval(() => {
    tick();
  }, 12);

  return { ok: true, running: true };
});

return status;
```

## Step 5: Stop procedure
To stop cleanly, clear the interval and reset flag.
Do not run this automatically after `/dino`; run only on explicit user stop request.

Reference stop snippet:
```javascript
const status = await page.evaluate(() => {
  if (window.__dinoBotInterval) {
    clearInterval(window.__dinoBotInterval);
    window.__dinoBotInterval = null;
  }
  return {
    stopped: !window.__dinoBotInterval,
    score: Number(window.Runner?.instance_?.distanceMeter?.digits?.join('') || '0'),
    crashed: !!window.Runner?.instance_?.crashed,
    playing: !!window.Runner?.instance_?.playing
  };
});

return status;
```

## Verification Checklist
- Page opens on Dino route.
- `Runner.instance_` exists.
- Game starts immediately and keeps running in background mode.
- Stop command sets `stopped === true`.

## Common Failure Modes
- `Runner not found`:
  - page is not the Dino game page
  - game script not fully loaded yet
  - action: wait briefly, reload once, re-check `Runner.instance_`

- Click or iframe timeout with no visible action:
  - game is controllable from main frame; skip click targeting
  - inject start/bot logic with `page.evaluate` directly
  - avoid verification waits; re-inject loop immediately if needed

- Jumps happen too early:
  - lower trigger distance
  - shorten hold time

- Triple cactus collisions:
  - detect cactus clusters
  - increase hold for cluster size >= 3
  - trigger slightly earlier for large cluster span

- Bot keeps running after user says stop:
  - ensure interval id is stored in `window.__dinoBotInterval`
  - always clear interval before creating a new one

## Output Contract
When running this skill in an automation session, report:
- URL opened
- whether bot started
- running/stopped state
- any tuning changes applied

For `/dino`, the expected report is:
- `started: true`
- `running: true`
- `mode: infinite-background`