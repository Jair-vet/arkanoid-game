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
