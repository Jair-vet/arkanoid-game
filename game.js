// --- Sonidos ---
const _POOL_SIZE = 4;

function _makePool(src) {
  return Array.from({ length: _POOL_SIZE }, () => {
    const a = new Audio(src);
    a.volume = 0.4;
    return a;
  });
}

const _poolBounce = _makePool('assets/sounds/ball-bounce.mp3');
const _poolBreak  = _makePool('assets/sounds/break-sound.mp3');

let _audioUnlocked = false;

function _unlockAudio() {
  if (_audioUnlocked) return;
  _audioUnlocked = true;
  // Reproducir y pausar inmediatamente para desbloquear el contexto
  [..._poolBounce, ..._poolBreak].forEach(a => {
    a.play().then(() => a.pause()).catch(() => {});
  });
}

function _playFromPool(pool) {
  if (!_audioUnlocked) return;
  const clip = pool.find(a => a.paused || a.ended) || pool[0];
  clip.currentTime = 0;
  clip.play().catch(() => {});
}

function playBounceSound() { _playFromPool(_poolBounce); }
function playBreakSound()  { _playFromPool(_poolBreak); }

// Desbloquear audio en primer evento de usuario
window.addEventListener('keydown',   _unlockAudio, { once: true });
window.addEventListener('mousemove', _unlockAudio, { once: true });
window.addEventListener('click',     _unlockAudio, { once: true });

// Estado global
const state = {
  lives: 3,
  score: 0,
  phase: 'playing' // 'playing' | 'gameover' | 'win'
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;

function initState() {
  state.lives = 3;
  state.score = 0;
  state.phase = 'playing';

  paddleInit();
  ballInit();
  bricksInit();
  powerupsInit();
}

function update(dt, timestamp) {
  if (state.phase !== 'playing') return;

  paddleUpdate(dt, timestamp);
  ballUpdate(dt);
  bricksUpdate();
  powerupsUpdate(dt, timestamp);

  // Condición de victoria: todos los ladrillos destruidos
  if (bricksAllCleared()) {
    state.phase = 'win';
    powerupsInit(); // limpiar power-ups en vuelo al terminar
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bricksRender(ctx);
  paddleRender(ctx);
  ballRender(ctx);
  powerupsRender(ctx);
  uiRender(ctx);
}

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // delta en segundos, máx 50 ms
  lastTime = timestamp;

  update(dt, timestamp);
  render();

  requestAnimationFrame(gameLoop);
}

loadSpritesheet(() => {
  initState();
  requestAnimationFrame((ts) => {
    lastTime = ts;
    gameLoop(ts);
  });
});
