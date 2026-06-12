# 01-arkanoid-mvp

**Estado:** Aprobado
**Fecha:** 2026-06-12
**Dependencias:** ninguna (spec inicial)
**Objetivo:** Implementar un juego Arkanoid jugable en el navegador con un nivel, tres vidas, power-ups de bola extra y paleta ancha, y overlays de victoria/game over.

---

## Alcance

### Incluido
- Canvas de 800×600 px con loop de juego vía `requestAnimationFrame`
- Paleta controlada simultáneamente por mouse y teclado (flechas / A-D)
- Una bola con física de rebote predecible (reflexión de ángulo simple)
- Layout de ladrillos: 10 columnas × 6 filas usando los sprites disponibles
- Sistema de 3 vidas; perder una vida al dejar caer la bola
- Marcador en pantalla: 10 puntos por ladrillo destruido
- Power-ups que caen al romper un ladrillo (15 % de probabilidad):
  - **Bola extra** — activa una segunda bola; máximo 2 bolas simultáneas
  - **Paleta ancha** — aumenta el ancho de la paleta durante 8 segundos
- Overlay de **Game Over** (sin vidas restantes) con botón "Jugar de nuevo"
- Overlay de **Victoria** (todos los ladrillos destruidos) con botón "Jugar de nuevo"
- Sonidos: rebote de bola y ruptura de ladrillo usando los assets disponibles
- Uso del sistema de sprites existente (`assets/spritesheet.js`)

### Fuera de alcance (diferido a specs posteriores)
- Múltiples niveles
- High score persistente (localStorage)
- Power-ups adicionales (bola lenta, láser, escudo, etc.)
- Soporte táctil / móvil
- Pantalla de inicio / menú principal
- Animaciones de explosión de ladrillos (disponibles en spritesheet pero no requeridas en MVP)

---

## Modelo de datos

### Archivos que se crearán
- `index.html` — canvas, referencias a scripts
- `game.js` — loop principal, estado global, inicialización
- `paddle.js` — lógica y render de la paleta
- `ball.js` — lógica y render de bola(s)
- `bricks.js` — layout, colisiones y render de ladrillos
- `powerups.js` — lógica de caída, tipos y efectos de power-ups
- `ui.js` — HUD (vidas, score) y overlays (game over, victoria)

### Estructuras principales

```js
// Estado global en game.js
const state = {
  lives: 3,
  score: 0,
  phase: 'playing' | 'gameover' | 'win'
};

// Paleta — paddle.js
const paddle = {
  x, y, width, height,   // width normal: 100px; wide: 160px
  wideUntil: null         // timestamp en ms; null = sin efecto activo
};

// Bola — ball.js (array de hasta 2)
const balls = [
  { x, y, vx, vy, radius: 8 }
];

// Ladrillo — bricks.js
const bricks = [
  { row, col, x, y, width, height, color, alive: true }
];
// Colores asignados por fila usando sprites disponibles:
// row 0→red, row 1→cyan, row 2→green, row 3→magenta, row 4→yellow, row 5→hotpink

// Power-up en caída — powerups.js
const fallingPowerups = [
  { x, y, vy: 120, type: 'extraball' | 'widepaddle' }
];
```

---

## Plan de implementación

Cada paso deja el sistema en estado funcional o al menos ejecutable sin errores.

1. **Scaffolding inicial** — Crear `index.html` con el `<canvas>` de 800×600, incluir `assets/spritesheet.js` y los scripts del juego en orden. Verificar que el canvas se renderiza en blanco.

2. **Loop de juego (`game.js`)** — Implementar `requestAnimationFrame`, `update(dt)` y `render()`. Arrancar con `loadSpritesheet(cb)`. El juego corre vacío sin errores.

3. **Paleta (`paddle.js`)** — Renderizar paleta con sprite. Mover con teclado (←→ / A-D) y mouse (`mousemove`). Limitar al ancho del canvas.

4. **Bola (`ball.js`)** — Renderizar una bola. Física de rebote contra paredes laterales y techo. La bola cae y se detecta pérdida de vida. Rebote contra la paleta con ángulo simple (basado en punto de impacto).

5. **Ladrillos (`bricks.js`)** — Generar grid 10×6. Renderizar con sprite por color de fila. Detectar colisión bola-ladrillo (AABB), marcar `alive: false`, sumar 10 puntos al score.

6. **HUD y overlays (`ui.js`)** — Mostrar vidas y score en pantalla. Overlay de Game Over y Victory con botón "Jugar de nuevo" que reinicia el estado completo sin recargar la página.

7. **Sonidos** — Reproducir `ball-bounce.mp3` en rebote y `break-sound.mp3` al romper ladrillo. Usar `Audio` con pool simple para evitar cortes.

8. **Power-ups (`powerups.js`)** — Al destruir un ladrillo, 15% de probabilidad de crear un `fallingPowerup`. Detectar colisión con paleta. Aplicar efectos:
   - `extraball`: agregar segunda bola al array si `balls.length < 2`
   - `widepaddle`: setear `paddle.wideUntil = now + 8000`

9. **Efecto paleta ancha** — En `update()`, verificar si `Date.now() > paddle.wideUntil` para restaurar ancho normal. Indicador visual opcional (color diferente mientras está activo).

10. **Pulido y verificación final** — Probar condiciones borde: perder con 2 bolas activas (solo se descuenta vida cuando `balls` queda vacío), power-up de bola extra cuando ya hay 2 bolas (ignorar), reinicio limpio de todo el estado.

---

## Criterios de aceptación

- [x] El canvas se renderiza a exactamente 800×600 px sin errores en consola
- [x] La paleta responde a mouse y teclado simultáneamente sin conflicto
- [x] La paleta no sale de los límites del canvas
- [x] La bola rebota correctamente en paredes laterales, techo y paleta
- [ ] Al caer la bola, se descuenta una vida
- [ ] Con 2 bolas activas, solo se descuenta vida cuando ambas caen
- [ ] El grid de 10×6 ladrillos se renderiza con el sprite correcto por fila de color
- [ ] Romper un ladrillo suma 10 puntos al marcador visible en pantalla
- [ ] El marcador se actualiza en tiempo real durante el juego
- [ ] Al destruir todos los ladrillos aparece el overlay de Victoria
- [ ] Al perder las 3 vidas aparece el overlay de Game Over
- [ ] Ambos overlays muestran el score final y el botón "Jugar de nuevo"
- [ ] El botón "Jugar de nuevo" reinicia el estado completo sin recargar la página
- [ ] Cada ladrillo roto tiene 15% de probabilidad de soltar un power-up
- [ ] El power-up `extraball` agrega una segunda bola (máximo 2 simultáneas)
- [ ] El power-up `widepaddle` ensancha la paleta durante exactamente 8 segundos
- [ ] Atrapar `extraball` con 2 bolas activas no produce una tercera bola
- [ ] Suena `ball-bounce.mp3` en cada rebote de bola
- [ ] Suena `break-sound.mp3` al romper cada ladrillo

---

## Decisiones tomadas y descartadas

| Decisión | Elegida | Alternativas descartadas | Justificación |
|---|---|---|---|
| Número de niveles | 1 nivel fijo | Múltiples niveles | Reduce scope del MVP; niveles van en spec posterior |
| Arquitectura | Múltiples archivos `.js` | Todo en `index.html` | Mejor separación de responsabilidades y mantenibilidad |
| Controles | Mouse + teclado simultáneo | Solo teclado / solo mouse | Mayor accesibilidad sin complejidad extra |
| Score persistente | No (solo en pantalla) | localStorage con high score | Fuera del scope del MVP |
| Power-ups | 2 tipos (bola extra, paleta ancha) | Más tipos (láser, escudo, bola lenta) | Suficiente variedad para MVP sin aumentar complejidad |
| Probabilidad de power-up | 15% por ladrillo | Por tipo de bloque / color especial | Simple de implementar, distribución natural |
| Duración paleta ancha | 8 segundos fijos | Permanente hasta perder vida | Balance entre utilidad y riesgo para el jugador |
| Máximo de bolas | 2 simultáneas | Ilimitadas | Evita caos visual y complejidad de colisiones |
| Física de rebote | Reflexión simple por punto de impacto | Física realista con vectores | Predecible y fiel al Arkanoid original |
| Animaciones de explosión | Fuera de scope | Usar `EXPLOSION_FRAMES` del spritesheet | Disponibles en assets pero no requeridas para MVP jugable |
| Soporte táctil | Fuera de scope | Touch events para móvil | MVP enfocado en desktop |

---

## Riesgos identificados

1. **Colisión bola-ladrillo inexacta (AABB).** Con velocidad alta, la bola puede "atravesar" un ladrillo delgado en un solo frame. Mitigación: limitar la velocidad máxima de la bola o implementar detección por paso (sub-stepping).

2. **Rebote múltiple en esquina de ladrillo.** La bola puede tocar dos ladrillos simultáneamente y producir un rebote doble inesperado. Mitigación: procesar solo la primera colisión por frame.

3. **Audio bloqueado por el navegador.** Los navegadores modernos bloquean `Audio.play()` antes de interacción del usuario. Mitigación: iniciar el contexto de audio en el primer evento de mouse o teclado.

4. **Reinicio incompleto del estado.** Si el botón "Jugar de nuevo" no reinicia todos los módulos correctamente (bolas, power-ups en caída, timer de paleta ancha), el juego puede arrancar en estado corrupto. Mitigación: centralizar el reset en una función `initState()` en `game.js` que todos los módulos exponen.
