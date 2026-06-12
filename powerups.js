// Pesos: más repeticiones = más probabilidad de salir
const POWERUP_TYPES = [
  'extraball', 'extraball', 'extraball', 'extraball', // 4x — frecuente
  'multiball', 'multiball', 'multiball', 'multiball', 'multiball', // 5x — muy frecuente
  'widepaddle', 'widepaddle', 'widepaddle', 'widepaddle', // 4x — frecuente
  'speedball'
];
const POWERUP_VY    = 120; // px/s de caída
const POWERUP_W     = 52;
const POWERUP_H     = 18;
const POWERUP_PROB  = 0.40; // 40% de prob por ladrillo roto

const fallingPowerups = [];

// Colores y etiquetas de cada tipo
const POWERUP_STYLE = {
  extraball:  { bg: '#44aaff', label: '+BOLA' },
  widepaddle: { bg: '#ffaa00', label: 'ANCHA' },
  multiball:  { bg: '#ff44cc', label: 'x3BOLA' },
  speedball:  { bg: '#ff6600', label: 'RÁPIDO' }
};

function powerupsInit() {
  fallingPowerups.length = 0;
}

function powerupsSpawn(brick) {
  if (Math.random() >= POWERUP_PROB) return;
  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  fallingPowerups.push({
    x:    brick.x + brick.width  / 2 - POWERUP_W / 2,
    y:    brick.y + brick.height / 2 - POWERUP_H / 2,
    vy:   POWERUP_VY,
    type
  });
}

function powerupsUpdate(dt, timestamp) {
  for (let i = fallingPowerups.length - 1; i >= 0; i--) {
    const p = fallingPowerups[i];
    p.y += p.vy * dt;

    // Colisión con paleta
    if (
      p.x + POWERUP_W > paddle.x &&
      p.x             < paddle.x + paddle.width &&
      p.y + POWERUP_H >= paddle.y &&
      p.y             <= paddle.y + paddle.height
    ) {
      _applyPowerup(p.type, timestamp);
      fallingPowerups.splice(i, 1);
      continue;
    }

    // Salió por la parte inferior del canvas
    if (p.y > 600) {
      fallingPowerups.splice(i, 1);
    }
  }
}

function _applyPowerup(type, timestamp) {
  if (type === 'extraball') {
    ballAddExtra();
  } else if (type === 'multiball') {
    ballAddMulti();
  } else if (type === 'speedball') {
    ballSpeedBoost();
  } else if (type === 'widepaddle') {
    paddle.width = PADDLE_WIDTH_WIDE;
    paddle.wideUntil = timestamp + 8000;
  }
}

function powerupsRender(ctx) {
  for (const p of fallingPowerups) {
    const style = POWERUP_STYLE[p.type];

    ctx.save();

    // Cápsula de color
    ctx.fillStyle = style.bg;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, POWERUP_W, POWERUP_H, POWERUP_H / 2);
    ctx.fill();

    // Etiqueta
    ctx.fillStyle = '#111';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(style.label, p.x + POWERUP_W / 2, p.y + POWERUP_H / 2);

    ctx.restore();
  }
}
