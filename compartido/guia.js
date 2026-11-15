/* ============================================================
   GUÍA DE LOS ENTRENAMIENTOS: lleva de la mano al jugador.
   Cada página llama a activarGuia('<pagina>') después de pintarse.
   Si la partida es un entrenamiento (o0, t0) y la guía está encendida:
     · ilumina lo que toca hacer y oscurece el resto,
     · muestra un globo con una instrucción corta,
     · bloquea los clics fuera de lo iluminado.
   Los pasos están en datos/tutoriales.js. El avance de los pasos
   informativos se guarda aparte (missionControl.guia) para que la
   página, al guardar su partida, no lo borre.
   ============================================================ */
import {cargarPartida, cargarPendiente, cargarGuia, guardarGuia} from './estado.js';
import {GUIAS} from '../datos/tutoriales.js';
import {PASOS} from '../datos/piezas.js';
import {t, tx} from '../idioma/idioma.js';

const PARTES = ['FASE 1', 'BOOSTERS', 'FASE 2', 'COFIA'];
const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
const buscar = sel => [...document.querySelectorAll(sel)].find(visible) || null;

export function activarGuia(pagina) {
  const pend = cargarPendiente(), partida = cargarPartida();
  const id = pagina === 'contexto' && pend ? pend.id : partida && partida.id;
  const g0 = cargarGuia();
  if (!GUIAS[id] || !g0 || g0.id !== id || g0.off) return;

  const app = document.querySelector('#app');
  const foco = document.createElement('div'), globo = document.createElement('div');
  foco.className = 'guia-foco'; globo.className = 'guia-globo';
  globo.setAttribute('role', 'dialog'); globo.setAttribute('aria-live', 'polite');
  document.body.append(foco, globo);

  let actual = null, pedido = 0, confirmarSalida = false;

  /* Si el paso pide otra pestaña del taller u otra parte del cohete, primero lleva ahí */
  function redirigir(s, p) {
    if (pagina !== 'taller' || !p) return s;
    if (s.paso !== undefined && p.paso !== s.paso) {
      const siguiente = s.paso === p.paso + 1;
      return {id: s.id + '>paso', objetivo: siguiente ? `.nav [data-paso="${s.paso}"]` : `.steps [data-paso="${s.paso}"]`,
        texto: siguiente ? tx('Toca SIGUIENTE para pasar a {n}.') : tx('Toca la pestaña {n}.'), vars: {n: PASOS[s.paso].n}};
    }
    if (s.sub !== undefined && p.sub !== s.sub) return {id: s.id + '>sub', objetivo: `.sub [data-sub="${s.sub}"]`, texto: tx('Toca {n}.'), vars: {n: t(PARTES[s.sub])}};
    /* Teléfono o tablet: tocar la pieza abre un panel; ahí se confirma con ELEGIR */
    if (s.hecho && s.objetivo.startsWith('.tile') && document.querySelector('#info.abierta')) {
      const abierta = document.querySelector('#info.abierta [data-accion="elegir"]');
      return abierta ? {id: s.id + '>panel', objetivo: '#info.abierta [data-accion="elegir"]', texto: s.texto, extra: tx('Toca ELEGIR.'), suave: 1}
        : {id: s.id + '>cerrar', objetivo: '#info.abierta [data-accion="cerrar"]', texto: tx('Esa no es. Toca CERRAR.'), suave: 1};
    }
    return s;
  }

  function pasoActual() {
    const g = cargarGuia();
    if (!g || g.id !== id || g.off) return null;
    const p = cargarPartida(), ctx = {p, g};
    for (const s of GUIAS[id]) {
      if (s.pagina !== pagina) continue;
      if (s.si && !(p && s.si(ctx))) continue;
      if (s.info ? g.vistos.includes(s.id) : (s.hecho && p && s.hecho(ctx))) continue;
      return redirigir(s, p);
    }
    return null;
  }

  function contenido(s) {
    confirmarSalida = false;
    globo.innerHTML = `<div class="guia-tag">${t('Entrenamiento guiado')}</div>
      <p>${t(s.texto, s.vars)}${s.extra ? ` <b>${t(s.extra)}</b>` : ''}</p>
      <div class="guia-acc">${s.info ? `<button class="btn" data-guia="ok">${t('ENTENDIDO')} ›</button>` : ''}
        <button class="guia-salir" data-guia="salir">${t('Salir de la guía')}</button></div>`;
  }

  function actualizar() {
    pedido = 0;
    const s = pasoActual();
    if (!s) { actual = null; foco.classList.remove('on'); globo.classList.remove('on'); return; }
    const nuevo = !actual || actual.id !== s.id;
    actual = s;
    if (nuevo) {
      contenido(s);
      const el = buscar(s.objetivo);
      if (el && !s.suave) el.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }
    colocar();
  }

  function colocar() {
    if (!actual) return;
    const el = actual.el = buscar(actual.objetivo);
    const W = innerWidth, H = innerHeight, m = 14;
    foco.classList.toggle('suave', !!actual.suave);
    if (el) {
      const r = el.getBoundingClientRect(), pad = 6;
      Object.assign(foco.style, {left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px'});
      foco.classList.add('on');
    } else foco.classList.remove('on');
    globo.classList.add('on');

    const gw = globo.offsetWidth, gh = globo.offsetHeight;
    let x = (W - gw) / 2, y = (H - gh) / 2;
    if (el) {
      const r = el.getBoundingClientRect(), cy = r.top + r.height / 2 - gh / 2, cx = r.left + r.width / 2 - gw / 2;
      if (W < 700) { y = r.top + r.height / 2 > H / 2 ? m : H - gh - m; }                     // teléfono: arriba o abajo
      else if (r.right + m + gw <= W - m) { x = r.right + m + 4; y = cy; }                     // a la derecha
      else if (r.left - m - gw >= m) { x = r.left - m - 4 - gw; y = cy; }                      // a la izquierda
      else if (r.bottom + m + gh <= H - m) { y = r.bottom + m + 4; x = cx; }                   // abajo
      else { y = r.top - m - 4 - gh; x = cx; }                                                 // arriba
    }
    globo.style.left = Math.max(m, Math.min(W - gw - m, x)) + 'px';
    globo.style.top = Math.max(m, Math.min(H - gh - m, y)) + 'px';
  }

  const programar = () => { if (!pedido) pedido = requestAnimationFrame(actualizar); };

  /* Botones del globo */
  globo.addEventListener('click', e => {
    const b = e.target.closest('[data-guia]');
    if (!b) return;
    const g = cargarGuia();
    if (b.dataset.guia === 'ok' && actual) {
      if (!g.vistos.includes(actual.id)) g.vistos.push(actual.id);
      guardarGuia(g); programar();
    } else if (b.dataset.guia === 'salir') {
      if (!confirmarSalida) { confirmarSalida = true; b.textContent = t('¿Seguro? Toca otra vez para salir'); colocar(); return; }
      g.off = true; guardarGuia(g); programar();
    }
  });

  /* Bloquea los clics fuera de lo iluminado (fase de captura: llega antes que la página) */
  document.addEventListener('click', e => {
    if (!actual || !actual.el || !document.contains(actual.el)) return;
    if (e.target.closest('.guia-globo, .idioma, .back') || actual.el.contains(e.target)) return;
    e.stopPropagation(); e.preventDefault();
    globo.classList.remove('sacude'); void globo.offsetWidth; globo.classList.add('sacude');
  }, true);

  new MutationObserver(programar).observe(app, {childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed']});
  addEventListener('resize', programar);
  addEventListener('transitionend', e => { if (!globo.contains(e.target) && e.target !== foco) programar(); }, true);   // paneles que se deslizan
  addEventListener('scroll', () => colocar(), true);
  addEventListener('pageshow', programar);
  programar();
}
