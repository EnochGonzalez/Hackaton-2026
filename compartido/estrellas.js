/* ============================================================
   CAMPO DE ESTRELLAS del menú principal. Las partículas bajan
   por la pantalla para que parezca que la nave avanza.
   const campo = iniciarEstrellas();
   campo.acelerar()   al despegar: van mucho más rápido y dejan estela
   campo.normal()     vuelve a la velocidad de crucero
   Tres capas de profundidad: las lejanas son pequeñas y lentas.
   Con "reducir movimiento" activado en el sistema, se quedan quietas.
   ============================================================ */
const CRUCERO = 1, DESPEGUE = 16;

export function iniciarEstrellas() {
  const lienzo = document.createElement('canvas');
  lienzo.className = 'estrellas';
  lienzo.setAttribute('aria-hidden', 'true');
  document.body.prepend(lienzo);
  const c = lienzo.getContext('2d');
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, estrellas = [], ritmo = CRUCERO, meta = CRUCERO, antes = 0;

  function nueva(arriba) {
    const capa = Math.random();                                // 0 lejos, 1 cerca
    return {
      x: Math.random() * W, y: arriba ? -10 : Math.random() * H,
      r: .5 + capa * 1.3,                                      // tamaño
      v: 14 + capa * capa * 110,                               // píxeles por segundo en crucero
      a: .25 + capa * .6,                                      // brillo
      azul: Math.random() < .3,
    };
  }
  function medir() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    lienzo.width = W * dpr; lienzo.height = H * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = Math.round(Math.min(220, W * H / 7000));
    estrellas = Array.from({length: total}, () => nueva(false));
    if (quieto) pintar(0);
  }
  function pintar(dt) {
    c.clearRect(0, 0, W, H);
    c.lineCap = 'round';
    for (const e of estrellas) {
      e.y += e.v * ritmo * dt;
      if (e.y > H + 10) Object.assign(e, nueva(true));
      const estela = Math.min(90, e.v * (ritmo - 1) * .035);  // solo se nota al acelerar
      c.strokeStyle = e.azul ? `rgba(125,211,252,${e.a})` : `rgba(226,232,240,${e.a})`;
      c.lineWidth = e.r * 2;
      c.beginPath(); c.moveTo(e.x, e.y - estela); c.lineTo(e.x, e.y + .01); c.stroke();
    }
  }
  function cuadro(ahora) {
    const dt = Math.min(.05, (ahora - antes) / 1000 || 0);     // tope: al volver a la pestaña no da un salto
    antes = ahora;
    ritmo += (meta - ritmo) * Math.min(1, dt * (meta > ritmo ? 2.2 : 4));
    pintar(dt);
    requestAnimationFrame(cuadro);
  }

  medir();
  addEventListener('resize', medir);
  if (!quieto) requestAnimationFrame(cuadro);
  return {acelerar() { meta = DESPEGUE; }, normal() { meta = ritmo = CRUCERO; }};
}
