const PADDLE_WIDTH_NORMAL = 100;
const PADDLE_WIDTH_WIDE   = 160;
const PADDLE_HEIGHT       = 14;
const PADDLE_SPEED        = 500; // px/s con teclado

const paddle = {
  x: 0,
  y: 570,
  width: PADDLE_WIDTH_NORMAL,
  height: PADDLE_HEIGHT,
  wideUntil: null
};

// Teclas presionadas
const _keys = {};

function paddleInit() {
  paddle.x = (800 - PADDLE_WIDTH_NORMAL) / 2;
  paddle.y = 570;
  paddle.width = PADDLE_WIDTH_NORMAL;
  paddle.wideUntil = null;
}

// Registrar eventos de entrada (se llaman una sola vez al cargar)
(function _registerInputs() {
  window.addEventListener('keydown', e => { _keys[e.key] = true; });
  window.addEventListener('keyup',   e => { _keys[e.key] = false; });

  const canvasEl = document.getElementById('gameCanvas');
  canvasEl.addEventListener('mousemove', e => {
    if (state.phase !== 'playing') return;
    const rect = canvasEl.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    paddle.x = mouseX - paddle.width / 2;
    _clampPaddle();
  });
})();

function _clampPaddle() {
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > 800) paddle.x = 800 - paddle.width;
}

function paddleUpdate(dt, timestamp) {
  // Efecto paleta ancha: restaurar si expiró
  if (paddle.wideUntil !== null && timestamp > paddle.wideUntil) {
    paddle.width = PADDLE_WIDTH_NORMAL;
    paddle.wideUntil = null;
  }

  // Movimiento por teclado
  if (_keys['ArrowLeft'] || _keys['a'] || _keys['A']) {
    paddle.x -= PADDLE_SPEED * dt;
  }
  if (_keys['ArrowRight'] || _keys['d'] || _keys['D']) {
    paddle.x += PADDLE_SPEED * dt;
  }
  _clampPaddle();
}

function paddleRender(ctx) {
  // Color diferente si paleta ancha activa
  if (paddle.wideUntil !== null) {
    ctx.globalAlpha = 0.85;
    ctx.filter = 'hue-rotate(90deg)';
  }
  drawSprite(ctx, 'paddle', paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.globalAlpha = 1;
  ctx.filter = 'none';
}
