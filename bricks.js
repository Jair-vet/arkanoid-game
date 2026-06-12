const BRICK_COLS   = 10;
const BRICK_ROWS   = 6;
const BRICK_W      = 70;
const BRICK_H      = 20;
const BRICK_GAP_X  = 4;
const BRICK_GAP_Y  = 4;
const BRICK_TOP    = 60;  // margen superior (deja espacio al HUD)
const BRICK_LEFT   = (800 - (BRICK_COLS * BRICK_W + (BRICK_COLS - 1) * BRICK_GAP_X)) / 2;

// Color por fila según spec
const ROW_COLORS = ['red', 'cyan', 'green', 'magenta', 'yellow', 'hotpink'];

const bricks = [];

function bricksInit() {
  bricks.length = 0;
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      bricks.push({
        row,
        col,
        x: BRICK_LEFT + col * (BRICK_W + BRICK_GAP_X),
        y: BRICK_TOP  + row * (BRICK_H + BRICK_GAP_Y),
        width:  BRICK_W,
        height: BRICK_H,
        color: ROW_COLORS[row],
        alive: true
      });
    }
  }
}

function bricksUpdate() {
  for (const b of balls) {
    _collideBallBricks(b);
  }
}

function _collideBallBricks(b) {
  for (const brick of bricks) {
    if (!brick.alive) continue;

    // AABB entre círculo y rectángulo
    const nearX = Math.max(brick.x, Math.min(b.x, brick.x + brick.width));
    const nearY = Math.max(brick.y, Math.min(b.y, brick.y + brick.height));
    const dx = b.x - nearX;
    const dy = b.y - nearY;

    if (dx * dx + dy * dy > b.radius * b.radius) continue;

    // Colisión detectada — resolver rebote
    _resolveRebound(b, brick);

    // Destruir ladrillo y sumar puntos
    brick.alive = false;
    state.score += 10;
    playBreakSound();
    powerupsSpawn(brick);

    // Solo una colisión por bola por frame
    break;
  }
}

function _resolveRebound(b, brick) {
  // Calcular solapamiento en cada eje para decidir qué componente invertir
  const overlapLeft   = (b.x + b.radius) - brick.x;
  const overlapRight  = (brick.x + brick.width) - (b.x - b.radius);
  const overlapTop    = (b.y + b.radius) - brick.y;
  const overlapBottom = (brick.y + brick.height) - (b.y - b.radius);

  const minH = Math.min(overlapLeft, overlapRight);
  const minV = Math.min(overlapTop,  overlapBottom);

  if (minH < minV) {
    b.vx = -b.vx;
  } else {
    b.vy = -b.vy;
  }
}

function bricksAllCleared() {
  return bricks.length > 0 && bricks.every(b => !b.alive);
}

function bricksRender(ctx) {
  for (const brick of bricks) {
    if (!brick.alive) continue;
    drawSprite(ctx, 'block_' + brick.color, brick.x, brick.y, brick.width, brick.height);
  }
}
