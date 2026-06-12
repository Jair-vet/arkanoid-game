// Área del botón "Jugar de nuevo" (coordenadas canvas)
const _btnRect = { x: 300, y: 340, width: 200, height: 44 };

// Registrar clic en canvas para el botón de los overlays
(function _registerClick() {
  const canvasEl = document.getElementById('gameCanvas');
  canvasEl.addEventListener('click', e => {
    if (state.phase === 'playing') return;

    const rect = canvasEl.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 600 / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top)  * scaleY;

    if (
      cx >= _btnRect.x && cx <= _btnRect.x + _btnRect.width &&
      cy >= _btnRect.y && cy <= _btnRect.y + _btnRect.height
    ) {
      initState();
    }
  });
})();

function uiRender(ctx) {
  _drawHUD(ctx);

  if (state.phase === 'gameover') {
    _drawOverlay(ctx, 'GAME OVER');
  } else if (state.phase === 'win') {
    _drawOverlay(ctx, '¡VICTORIA!');
  }
}

function _drawHUD(ctx) {
  ctx.save();
  ctx.font = 'bold 18px monospace';
  ctx.fillStyle = '#fff';

  // Vidas — izquierda
  ctx.textAlign = 'left';
  ctx.fillText('VIDAS: ' + state.lives, 16, 36);

  // Score — derecha
  ctx.textAlign = 'right';
  ctx.fillText('SCORE: ' + state.score, 784, 36);

  ctx.restore();
}

function _drawOverlay(ctx, title) {
  // Fondo semitransparente
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
  ctx.fillRect(0, 0, 800, 600);

  // Título
  ctx.textAlign = 'center';
  ctx.font = 'bold 56px monospace';
  ctx.fillStyle = title === 'GAME OVER' ? '#ff4444' : '#44ff88';
  ctx.fillText(title, 400, 240);

  // Score final
  ctx.font = 'bold 26px monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + state.score, 400, 300);

  // Botón "Jugar de nuevo"
  const b = _btnRect;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.width, b.height, 8);
  ctx.fill();

  ctx.font = 'bold 18px monospace';
  ctx.fillStyle = '#111';
  ctx.fillText('Jugar de nuevo', 400, b.y + 28);

  ctx.restore();
}
