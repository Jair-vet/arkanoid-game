const BALL_RADIUS = 8;
const BALL_SPEED  = 320; // px/s velocidad inicial

const balls = [];

function ballInit() {
  balls.length = 0;
  balls.push(_createBall(400, paddle.y - BALL_RADIUS - 2));
}

function _createBall(x, y) {
  // Dirección inicial: levemente aleatoria hacia arriba
  const angle = (Math.random() * 60 - 30) * (Math.PI / 180); // -30° a +30°
  return {
    x,
    y,
    vx: BALL_SPEED * Math.sin(angle),
    vy: -BALL_SPEED * Math.cos(angle),
    radius: BALL_RADIUS
  };
}

function ballAddExtra() {
  // La bola extra sale desde la posición de la paleta
  balls.push(_createBall(paddle.x + paddle.width / 2, paddle.y - BALL_RADIUS - 2));
}

function ballAddMulti() {
  // Agrega 2 bolas a la vez con ángulos distintos
  const cx = paddle.x + paddle.width / 2;
  const cy = paddle.y - BALL_RADIUS - 2;
  const currentSpeed = balls.length > 0
    ? Math.sqrt(balls[0].vx ** 2 + balls[0].vy ** 2)
    : BALL_SPEED;
  [-40, 40].forEach(deg => {
    const a = deg * (Math.PI / 180);
    balls.push({ x: cx, y: cy, vx: currentSpeed * Math.sin(a), vy: -currentSpeed * Math.cos(a), radius: BALL_RADIUS });
  });
}

function ballSpeedBoost() {
  const MAX_SPEED = BALL_SPEED * 2.5;
  for (const b of balls) {
    const speed = Math.sqrt(b.vx ** 2 + b.vy ** 2);
    const newSpeed = Math.min(speed * 1.4, MAX_SPEED);
    const ratio = newSpeed / speed;
    b.vx *= ratio;
    b.vy *= ratio;
  }
}

function ballUpdate(dt) {
  for (let i = balls.length - 1; i >= 0; i--) {
    const b = balls[i];

    b.x += b.vx * dt;
    b.y += b.vy * dt;

    // Rebote pared izquierda / derecha
    if (b.x - b.radius < 0) {
      b.x = b.radius;
      b.vx = Math.abs(b.vx);
      playBounceSound();
    } else if (b.x + b.radius > 800) {
      b.x = 800 - b.radius;
      b.vx = -Math.abs(b.vx);
      playBounceSound();
    }

    // Rebote techo
    if (b.y - b.radius < 0) {
      b.y = b.radius;
      b.vy = Math.abs(b.vy);
      playBounceSound();
    }

    // Colisión con paleta
    if (_hitsPaddle(b)) {
      _bouncePaddle(b);
      playBounceSound();
    }

    // Bola cae fuera del canvas
    if (b.y - b.radius > 600) {
      balls.splice(i, 1);
    }
  }

  // Game over inmediato cuando no queda ninguna bola
  if (balls.length === 0 && state.phase === 'playing') {
    state.phase = 'gameover';
    powerupsInit();
  }
}

function _hitsPaddle(b) {
  // Solo si la bola se mueve hacia abajo
  if (b.vy <= 0) return false;
  return (
    b.x + b.radius > paddle.x &&
    b.x - b.radius < paddle.x + paddle.width &&
    b.y + b.radius >= paddle.y &&
    b.y - b.radius <= paddle.y + paddle.height
  );
}

function _bouncePaddle(b) {
  // Punto de impacto normalizado: -1 (izq) a +1 (der)
  const hitNorm = ((b.x - paddle.x) / paddle.width) * 2 - 1;
  const maxAngle = 60 * (Math.PI / 180);
  const angle = hitNorm * maxAngle;
  const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);

  b.vx = speed * Math.sin(angle);
  b.vy = -speed * Math.cos(angle);

  // Sacar la bola del área de la paleta para evitar rebotes dobles
  b.y = paddle.y - b.radius - 1;
}

function ballRender(ctx) {
  for (const b of balls) {
    drawSprite(ctx, 'ball', b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2);
  }
}
