# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An Arkanoid/Breakout-style game built with pure HTML, CSS, and JavaScript — zero dependencies. Open `index.html` directly in a browser to play (no build step, no server required).

## Running the Game

Open `index.html` in a browser. Because assets are loaded via relative paths, use a local server if the browser blocks file:// requests for images/audio:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

All game code lives in a single `index.html` (or split across `*.js` files in the root). The game loop uses `requestAnimationFrame`.

### Available Assets

- `assets/spritesheet-breakout.png` — sprite atlas for all game visuals
- `assets/sounds/ball-bounce.mp3` — ball bounce sound
- `assets/sounds/break-sound.mp3` — brick break sound

### Sprite System (`assets/spritesheet.js`)

Must be included before game code. Provides:

- `loadSpritesheet(cb)` — loads the PNG atlas; calls `cb` when ready
- `drawSprite(ctx, name, x, y, w, h)` — renders a named sprite; valid names: `"paddle"`, `"ball"`, `"block_red"`, `"block_cyan"`, `"block_green"`, `"block_magenta"`, `"block_yellow"`, `"block_hotpink"`, `"block_gray"`
- `drawFrame(ctx, frame, x, y, w, h)` — renders a raw `{sx, sy, sw, sh}` frame object
- `EXPLOSION_FRAMES` — object keyed by color (`red`, `cyan`, `green`, `magenta`, `yellow`, `hotpink`, `gray`), each an array of 4 frames for animation
- `EXPLOSION_DURATION` — `150` (ms per explosion animation cycle)
- `SPRITES` — raw sprite coordinate map (paddle, ball, blocks)

### Typical Game Loop Pattern

```js
loadSpritesheet(() => {
  // init game state, then start loop
  requestAnimationFrame(gameLoop);
});

function gameLoop(timestamp) {
  update(timestamp);
  render();
  requestAnimationFrame(gameLoop);
}
```
