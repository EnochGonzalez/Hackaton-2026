/* TALLER: se diseña el satélite (BUS, SENSORES, SOPORTE) y se arma el cohete
   por partes (COHETE), de abajo hacia arriba. Cada clic se guarda al instante. */
import {PASOS, NOMBRE_CAT, pieza} from '../../datos/piezas.js';
import {ORDEN_COHETE, parteCohete} from '../../datos/cohete.js';
import {ORBS} from '../../datos/misiones.js';
import {calc, opciones, razonBloqueo, esCohete, MULTI, fmt} from '../../nucleo/calc.js';
import {guardarPartida, misionDe} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {icoPieza, barrasHTML, indicadoresHTML, enlacesAyuda} from '../../compartido/componentes.js';
import {naveSVG, coheteSVG} from '../../compartido/nave-svg.js';

const app = document.querySelector('#app');
const partida = exigirPartida();
/* Con un vuelo en curso o terminado no se edita el diseño: REDISEÑAR (en el reporte) lo libera */
if (partida && partida.rep) ir('reporte');
else if (partida && partida.ops) ir('operaciones');
else if (partida) iniciar();

function iniciar() {
  const M = misionDe(partida), sel = partida.sel;
  let sobre = null;                                    // pieza bajo el cursor: {cat, id}
  const corto = n => n.replace(/\s*\(.*?\)/g, '');
  const buscar = (cat, id) => esCohete(cat) ? parteCohete(cat, id) : pieza(id);
  const elegida = (cat, id) => MULTI.includes(cat) ? sel[cat].includes(id) : sel[cat] === id;

  function casilla(it, cat) {
    const activa = elegida(cat, it.id), razon = razonBloqueo(it, cat, M, sel);
    return `<button class="tile ${razon && !activa ? 'lock' : ''}" data-cat="${cat}" data-id="${it.id}" aria-pressed="${activa}" aria-disabled="${!!razon && !activa}">${icoPieza(it, cat)}<span class="nm">${corto(it.n)}</span></button>`;
  }

  function infoHTML() {
    const paso = PASOS[partida.paso];
    if (!sobre) return `<div class="vacio"><h4>Taller</h4>${paso.ayuda}<p>Pasa el cursor sobre una pieza para ver sus datos. Las casillas punteadas no sirven para este contrato.</p></div>`;
    const it = buscar(sobre.cat, sobre.id), razon = razonBloqueo(it, sobre.cat, M, sel);
    const fila = (k, v) => v ? `<div class="k"><span>${k}</span><b class="mono">${v}</b></div>` : '';
    let filas = fila('Categoría', NOMBRE_CAT[sobre.cat]);
    if (esCohete(sobre.cat)) {
      const caps = sobre.cat === 'f1' ? it.caps.none : sobre.cat === 'boosters' && sel.f1 ? parteCohete('f1', sel.f1).caps[it.id] : null;
      filas += fila('Costo', '$' + fmt(it.c) + ' M') + (caps ? fila('Capacidad a ' + ORBS[M.orbit], caps[M.orbit] ? fmt(caps[M.orbit]) + ' kg' : 'No llega') : '')
        + fila('Éxito histórico', it.rel ? (it.rel * 100).toFixed(1) + '%' : '') + fila('Impulso (Isp)', it.isp ? it.isp + ' s' : '') + fila('Diámetro útil', it.diam ? it.diam + ' m' : '');
    } else {
      filas += fila('Peso', fmt(it.m) + ' kg') + fila('Potencia', it.gen ? 'genera ' + fmt(it.gen) + ' W' : it.w ? '-' + it.w + ' W' : '')
        + fila('Datos', it.mbps ? it.mbps + ' Mbps' : '') + fila('Ciencia', it.sci ? it.sci + ' pts' : '') + fila('Temperatura', it.temp ? 'exige ' + it.temp + ' K' : it.tempMin ? 'logra ' + it.tempMin + ' K' : '')
        + fila('Ranuras', it.slots) + fila('Diámetro', it.diam ? it.diam + ' m' : '') + fila('Confiabilidad', it.rel ? (it.rel > 0 ? '+' : '') + it.rel : '')
        + fila('Tiempo', it.t + (it.t === 1 ? ' mes' : ' meses')) + fila('Costo', '$' + fmt(it.c) + ' M');
    }
    return `<h4>${it.n}</h4>${filas}<p>${it.txt || ''}</p>${razon ? `<div class="why">${razon}</div>` : ''}`;
  }

  function pintar() {
    const o = calc(M, sel), paso = PASOS[partida.paso], enCohete = paso.id === 'cohete';
    const pestanas = PASOS.map((p, i) => `<button class="stp ${i === partida.paso ? 'on' : ''}" data-paso="${i}">${p.n}</button>`).join('') + '<button class="stp" data-ir="revision">REVISIÓN</button>';
    let izquierda;
    if (enCohete) {
      const cat = ORDEN_COHETE[partida.sub];
      const sub = ORDEN_COHETE.map((c, i) => `<button class="${i === partida.sub ? 'on' : ''} ${sel[c] ? 'hecho' : ''}" data-sub="${i}" ${i > 0 && !sel[ORDEN_COHETE[i - 1]] ? 'disabled' : ''}><i>${sel[c] ? '✓' : i + 1}</i>${['FASE 1', 'BOOSTERS', 'FASE 2', 'COFIA'][i]}</button>`).join('');
      izquierda = `<h3>Arma el cohete de abajo hacia arriba</h3><div class="sub">${sub}</div><h3>${NOMBRE_CAT[cat]}</h3><div class="grid">${opciones(cat, M).map(it => casilla(it, cat)).join('')}</div>`;
    } else {
      izquierda = paso.cats.map(c => `<h3>${NOMBRE_CAT[c]}${c === 'instr' ? ` · caben ${o.ch ? o.ch.slots : '?'}` : c === 'termico' ? ' · puedes combinar' : ''}</h3><div class="grid">${opciones(c, M).map(it => casilla(it, c)).join('')}</div>`).join('');
    }
    app.innerHTML = `<button class="back" data-ir="inicio">‹ INICIO</button>
      <div class="top"><span class="mname">${M.n} · ${ORBS[M.orbit]}</span><div class="steps">${pestanas}</div></div>
      <div class="taller">
        <div class="gridwrap">${izquierda}</div>
        <div class="info" id="info">${infoHTML()}</div>
        <div class="stage">${enCohete ? coheteSVG(o, ORDEN_COHETE[partida.sub]) : naveSVG(o)}</div>
        <div class="right"><h3>${M.n}</h3>${barrasHTML(o)}${indicadoresHTML(o)}</div>
      </div>
      <div class="nav">${partida.paso > 0 ? '<button class="btn light" data-paso="' + (partida.paso - 1) + '">‹ ATRÁS</button>' : ''}
        ${enCohete ? '<button class="btn" data-ir="revision">REVISAR ›</button>' : '<button class="btn" data-paso="' + (partida.paso + 1) + '">SIGUIENTE ›</button>'}</div>
      ${enlacesAyuda()}`;
  }

  function elegir(cat, id) {
    if (MULTI.includes(cat)) { const L = sel[cat], i = L.indexOf(id); i >= 0 ? L.splice(i, 1) : L.push(id); }
    else if (esCohete(cat)) {
      sel[cat] = id;
      if (cat === 'f1') { sel.boosters = null; sel.etapa = null; sel.cofia = null; }       // cambiar la base desarma lo de arriba
      if (partida.sub < 3) partida.sub++;                                                   // pasa a la siguiente parte
    }
    else sel[cat] = sel[cat] === id ? null : id;
  }

  activarEnlaces();
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-paso],[data-sub],.tile');
    if (!b || b.disabled) return;
    if (b.dataset.paso !== undefined) partida.paso = +b.dataset.paso;
    else if (b.dataset.sub !== undefined) partida.sub = +b.dataset.sub;
    else { if (b.classList.contains('lock')) return; elegir(b.dataset.cat, b.dataset.id); }
    sobre = null; guardarPartida(partida); pintar();
  });
  app.addEventListener('mouseover', e => {
    const t = e.target.closest('.tile'); if (!t) return;
    sobre = {cat: t.dataset.cat, id: t.dataset.id}; document.querySelector('#info').innerHTML = infoHTML();
  });
  app.addEventListener('mouseout', e => {
    if (!e.target.closest('.tile') || (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.tile'))) return;
    sobre = null; document.querySelector('#info').innerHTML = infoHTML();
  });
  pintar();
}
