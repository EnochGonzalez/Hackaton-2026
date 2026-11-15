/* TALLER: se diseña el satélite (BUS, SENSORES, SOPORTE) y se arma el cohete
   por partes (COHETE), de abajo hacia arriba. Cada clic se guarda al instante.
   La nave se ve en la bahía de ensamblaje: flota sobre una plataforma y, al
   instalar una pieza, la bahía destella y suena un aviso. */
import {PASOS, NOMBRE_CAT, pieza} from '../../datos/piezas.js';
import {ORDEN_COHETE, parteCohete} from '../../datos/cohete.js';
import {ORBS} from '../../datos/misiones.js';
import {calc, opciones, razonBloqueo, esCohete, MULTI, fmt} from '../../nucleo/calc.js';
import {guardarPartida, misionDe} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {icoPieza, barrasHTML, indicadoresHTML, enlacesAyuda} from '../../compartido/componentes.js';
import {sateliteSVG, coheteSVG} from '../../compartido/nave-svg.js';
import {iniciarEstrellas} from '../../compartido/estrellas.js';
import {efecto} from '../../compartido/audio.js';
import {activarGuia} from '../../compartido/guia.js';
import {t} from '../../idioma/idioma.js';

const app = document.querySelector('#app');
/* En pantallas táctiles o angostas no hay columna de información fija ni hover:
   tocar una pieza abre un panel inferior con sus datos y el botón ELEGIR.
   Esta consulta es la misma que la del modo "flujo" en el CSS. */
const MODO_TOQUE = matchMedia('(hover: none), (max-width: 1100px), (max-height: 600px)');
const partida = exigirPartida();
/* Con un vuelo en curso o terminado no se edita el diseño: REDISEÑAR (en el reporte) lo libera */
if (partida && partida.rep) ir('reporte');
else if (partida && partida.ops) ir('operaciones');
else if (partida) iniciar();

function iniciar() {
  const M = misionDe(partida), sel = partida.sel;
  let sobre = null;                                    // pieza bajo el cursor: {cat, id}
  let instalada = false;                               // se acaba de poner una pieza: la bahía destella
  const corto = n => n.replace(/\s*\(.*?\)/g, '');
  const buscar = (cat, id) => esCohete(cat) ? parteCohete(cat, id) : pieza(id);
  const elegida = (cat, id) => MULTI.includes(cat) ? sel[cat].includes(id) : sel[cat] === id;

  function casilla(it, cat) {
    const activa = elegida(cat, it.id), razon = razonBloqueo(it, cat, M, sel);
    return `<button class="tile ${razon && !activa ? 'lock' : ''}" data-cat="${cat}" data-id="${it.id}" aria-pressed="${activa}" aria-disabled="${!!razon && !activa}">${icoPieza(it, cat)}<span class="nm">${corto(it.n)}</span></button>`;
  }

  function infoHTML() {
    const paso = PASOS[partida.paso];
    if (!sobre) return `<div class="vacio"><h4>${t('Taller')}</h4>${paso.ayuda}<p>${t('Pasa el cursor sobre una pieza para ver sus datos. Las casillas punteadas no sirven para este contrato.')}</p></div>`;
    const it = buscar(sobre.cat, sobre.id), razon = razonBloqueo(it, sobre.cat, M, sel);
    const fila = (k, v) => v ? `<div class="k"><span>${k}</span><b class="mono">${v}</b></div>` : '';
    let filas = fila(t('Categoría'), NOMBRE_CAT[sobre.cat]);
    if (esCohete(sobre.cat)) {
      const caps = sobre.cat === 'f1' ? it.caps.none : sobre.cat === 'boosters' && sel.f1 ? parteCohete('f1', sel.f1).caps[it.id] : null;
      filas += fila(t('Costo'), '$' + fmt(it.c) + ' M') + (caps ? fila(t('Capacidad a {o}', {o: ORBS[M.orbit]}), caps[M.orbit] ? fmt(caps[M.orbit]) + ' kg' : t('No llega')) : '')
        + fila(t('Éxito histórico'), it.rel ? (it.rel * 100).toFixed(1) + '%' : '') + fila(t('Impulso (Isp)'), it.isp ? it.isp + ' s' : '') + fila(t('Diámetro útil'), it.diam ? it.diam + ' m' : '');
    } else {
      filas += fila(t('Peso'), fmt(it.m) + ' kg') + fila(t('Potencia'), it.gen ? t('genera {w} W', {w: fmt(it.gen)}) : it.w ? '-' + it.w + ' W' : '')
        + fila(t('Datos'), it.mbps ? it.mbps + ' Mbps' : '') + fila(t('Ciencia'), it.sci ? it.sci + ' pts' : '') + fila(t('Temperatura'), it.temp ? t('exige {k} K', {k: it.temp}) : it.tempMin ? t('logra {k} K', {k: it.tempMin}) : '')
        + fila(t('Ranuras'), it.slots) + fila(t('Diámetro'), it.diam ? it.diam + ' m' : '') + fila(t('Confiabilidad'), it.rel ? (it.rel > 0 ? '+' : '') + it.rel : '')
        + fila(t('Tiempo'), it.t === 1 ? t('1 mes') : t('{n} meses', {n: it.t})) + fila(t('Costo'), '$' + fmt(it.c) + ' M');
    }
    let acciones = '';
    if (MODO_TOQUE.matches) {
      const activa = elegida(sobre.cat, sobre.id);
      const boton = razon && !activa ? ''
        : activa && esCohete(sobre.cat) ? `<button class="btn" disabled>${t('ELEGIDA')} ✓</button>`
        : `<button class="btn ${activa ? 'light' : 'go2'}" data-accion="elegir">${activa ? t('QUITAR') : t('ELEGIR')}</button>`;
      acciones = `<div class="acc">${boton}<button class="btn light" data-accion="cerrar">${t('CERRAR')}</button></div>`;
    }
    return `<h4>${it.n}</h4>${filas}<p>${it.txt || ''}</p>${razon ? `<div class="why">${razon}</div>` : ''}${acciones}`;
  }

  function pintar() {
    const o = calc(M, sel), paso = PASOS[partida.paso], enCohete = paso.id === 'cohete';
    const pestanas = PASOS.map((p, i) => `<button class="stp ${i === partida.paso ? 'on' : ''}" data-paso="${i}">${p.n}</button>`).join('') + `<button class="stp" data-ir="revision">${t('REVISIÓN')}</button>`;
    let izquierda;
    if (enCohete) {
      const cat = ORDEN_COHETE[partida.sub];
      const sub = ORDEN_COHETE.map((c, i) => `<button class="${i === partida.sub ? 'on' : ''} ${sel[c] ? 'hecho' : ''}" data-sub="${i}" ${i > 0 && !sel[ORDEN_COHETE[i - 1]] ? 'disabled' : ''}><i>${sel[c] ? '✓' : i + 1}</i>${t(['FASE 1', 'BOOSTERS', 'FASE 2', 'COFIA'][i])}</button>`).join('');
      izquierda = `<h3>${t('Arma el cohete de abajo hacia arriba')}</h3><div class="sub">${sub}</div><h3 data-titulo="${cat}">${NOMBRE_CAT[cat]}</h3><div class="grid" data-grid="${cat}">${opciones(cat, M).map(it => casilla(it, cat)).join('')}</div>`;
    } else {
      izquierda = paso.cats.map(c => `<h3 data-titulo="${c}">${NOMBRE_CAT[c]}${c === 'instr' ? ' · ' + t('caben {n}', {n: o.ch ? o.ch.slots : '?'}) : c === 'termico' ? ' · ' + t('puedes combinar') : ''}</h3><div class="grid" data-grid="${c}">${opciones(c, M).map(it => casilla(it, c)).join('')}</div>`).join('');
    }
    /* Bahía de ensamblaje. El retraso negativo hace que las animaciones sigan donde iban al volver a pintar. */
    const fase = -((performance.now() / 1000) % 6).toFixed(2);
    const hechos = enCohete ? ORDEN_COHETE.filter(c => sel[c]).length : [sel.chasis, sel.energia, sel.instr.length, sel.termico.length, sel.adcs, sel.comms, sel.prop].filter(Boolean).length;
    const total = enCohete ? 4 : 7;
    const bahia = `<div class="stage ${enCohete ? 'modo-cohete' : 'modo-sat'} ${instalada ? 'instala' : ''}">
        <div class="st-hud izq"><small>${t('BAHÍA DE ENSAMBLAJE')}</small><b>${enCohete ? t('Cohete') : t('Satélite')}</b></div>
        <div class="st-hud der ${hechos === total ? 'listo' : ''}"><small>${enCohete ? t('PARTES') : t('SISTEMAS')}</small><b>${hechos}<i> / ${total}</i></b></div>
        <div class="st-piso"></div>
        ${enCohete ? '' : '<div class="st-luz"></div>'}
        <div class="plataforma" style="animation-delay:${fase}s"><i></i><i></i><i></i></div>
        <div class="st-nave" style="animation-delay:${fase}s">${enCohete ? coheteSVG(o, ORDEN_COHETE[partida.sub]) : `<svg viewBox="0 0 440 400">${sateliteSVG(o, 220, 215, 1.2)}</svg>`}</div>
        <div class="st-barrido" style="animation-delay:${fase}s"></div>
      </div>`;
    instalada = false;
    app.innerHTML = `<button class="back" data-ir="inicio">‹ ${t('INICIO')}</button>
      <div class="top"><span class="mname">${M.n} · ${ORBS[M.orbit]}</span><div class="steps">${pestanas}</div></div>
      <div class="taller">
        <div class="resumen">${barrasHTML(o)}</div>
        <div class="gridwrap">${enCohete ? "" : `<p class="ayuda-paso">${paso.ayuda}</p>`}${izquierda}</div>
        <div class="info" id="info">${MODO_TOQUE.matches ? '' : infoHTML()}</div>
        ${bahia}
        <div class="right"><h3>${M.n}</h3>${barrasHTML(o)}${indicadoresHTML(o)}</div>
      </div>
      <div class="nav">${partida.paso > 0 ? `<button class="btn light" data-paso="${partida.paso - 1}">‹ ${t('ATRÁS')}</button>` : ''}
        ${enCohete ? `<button class="btn" data-ir="revision">${t('REVISAR')} ›</button>` : `<button class="btn" data-paso="${partida.paso + 1}">${t('SIGUIENTE')} ›</button>`}</div>
      ${enlacesAyuda()}<div class="velo"></div>`;
  }

  /* Pone o quita una pieza. Avisa con un sonido y, si se puso, con un destello en la bahía. */
  function elegir(cat, id) {
    const puesta = !elegida(cat, id) || esCohete(cat);
    instalada = puesta; efecto(puesta ? 'pieza' : 'quitar');
    if (MULTI.includes(cat)) { const L = sel[cat], i = L.indexOf(id); i >= 0 ? L.splice(i, 1) : L.push(id); }
    else if (esCohete(cat)) {
      sel[cat] = id;
      if (cat === 'f1') { sel.boosters = null; sel.etapa = null; sel.cofia = null; }       // cambiar la base desarma lo de arriba
      if (partida.sub < 3) partida.sub++;                                                   // pasa a la siguiente parte
    }
    else sel[cat] = sel[cat] === id ? null : id;
  }

  /* Panel inferior (modo táctil): se abre con la pieza tocada y se cierra con CERRAR, Esc o tocando fuera */
  function abrirPanel(cat, id) {
    sobre = {cat, id};
    const info = document.querySelector('#info');
    info.innerHTML = infoHTML(); info.scrollTop = 0; info.classList.add('abierta');
    document.querySelector('.velo').classList.add('abierta');
  }
  function cerrarPanel() {
    sobre = null;
    document.querySelector('#info').classList.remove('abierta');
    document.querySelector('.velo').classList.remove('abierta');
  }

  iniciarEstrellas({ritmo: .12, lateral: true});       // fondo: estrellas que pasan despacio
  activarEnlaces();
  app.addEventListener('click', e => {
    const accion = e.target.closest('[data-accion]');
    if (accion) {
      if (accion.dataset.accion === 'elegir' && sobre) { elegir(sobre.cat, sobre.id); sobre = null; guardarPartida(partida); pintar(); }
      else cerrarPanel();
      return;
    }
    if (e.target.closest('.velo')) { cerrarPanel(); return; }
    const b = e.target.closest('[data-paso],[data-sub],.tile');
    if (!b || b.disabled) return;
    if (b.classList.contains('tile') && MODO_TOQUE.matches) { abrirPanel(b.dataset.cat, b.dataset.id); return; }
    if (b.dataset.paso !== undefined) { partida.paso = +b.dataset.paso; window.scrollTo(0, 0); }
    else if (b.dataset.sub !== undefined) partida.sub = +b.dataset.sub;
    else { if (b.classList.contains('lock')) return; elegir(b.dataset.cat, b.dataset.id); }
    sobre = null; guardarPartida(partida); pintar();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && MODO_TOQUE.matches) cerrarPanel(); });
  /* Hover solo en escritorio con mouse */
  app.addEventListener('mouseover', e => {
    if (MODO_TOQUE.matches) return;
    const t = e.target.closest('.tile'); if (!t) return;
    sobre = {cat: t.dataset.cat, id: t.dataset.id}; document.querySelector('#info').innerHTML = infoHTML();
  });
  app.addEventListener('mouseout', e => {
    if (MODO_TOQUE.matches) return;
    if (!e.target.closest('.tile') || (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.tile'))) return;
    sobre = null; document.querySelector('#info').innerHTML = infoHTML();
  });
  /* Si la ventana cambia entre escritorio y táctil, se vuelve a pintar con el modo correcto */
  MODO_TOQUE.addEventListener('change', () => { sobre = null; pintar(); });
  pintar();
  activarGuia('taller');

  /* Si se llegó desde un punto de la revisión, se señala la categoría a corregir */
  if (partida.resaltar) {
    const cat = partida.resaltar;
    delete partida.resaltar; guardarPartida(partida);
    const titulo = document.querySelector(`[data-titulo="${cat}"]`), grid = document.querySelector(`[data-grid="${cat}"]`);
    if (titulo && grid) {
      titulo.scrollIntoView({block: 'center'});
      [titulo, grid].forEach(el => el.classList.add('resaltado'));
      setTimeout(() => [titulo, grid].forEach(el => el.classList.remove('resaltado')), 2600);
    }
  }
}
