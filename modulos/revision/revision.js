/* REVISIÓN: semáforo de 8 filas, pruebas en Tierra y botón LANZAR */
import {PRUEBAS} from '../../datos/piezas.js';
import {ORBS} from '../../datos/misiones.js';
import {calc, fmt} from '../../nucleo/calc.js';
import {puedeLanzar} from '../../nucleo/validacion.js';
import {guardarPartida, misionDe} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {barrasHTML, indicadoresHTML, enlacesAyuda} from '../../compartido/componentes.js';
import {naveSVG} from '../../compartido/nave-svg.js';

const app = document.querySelector('#app');
const partida = exigirPartida();
if (partida && partida.rep) ir('reporte');
else if (partida && partida.ops) ir('operaciones');
else if (partida) {
  const M = misionDe(partida);
  const pintar = () => {
    const o = calc(M, partida.sel), ok = puedeLanzar(o);
    const filas = o.rows.map(r => `<div class="vrow"><div class="dot ${r.st}">${r.st === 'ok' ? '✓' : r.st === 'warn' ? '!' : '×'}</div><div><b>${r.k}</b><span>${r.msg}</span></div></div>`).join('');
    const pruebas = PRUEBAS.map(t => `<button class="${partida.sel.tests === t.id ? 'on' : ''}" data-prueba="${t.id}">${t.n.toUpperCase()}</button>`).join('');
    const t = o.ts;
    app.innerHTML = `<button class="back" data-ir="inicio">‹ INICIO</button>
      <div class="top"><span class="mname">${M.n} · ${ORBS[M.orbit]} · Revisión</span></div>
      <div class="revwrap">
        <div class="rev paper"><h2>Revisión previa al lanzamiento</h2>${filas}
          <div class="pruebas"><div class="lbl">Pruebas en Tierra</div><div class="seg">${pruebas}</div>
            <small>${t.txt} ${t.rel ? `+${t.rel} de confiabilidad, +${t.t} meses y $${fmt(t.cMul * M.testBase)} M.` : ''}</small></div>
        </div>
        <div class="right"><h3>${M.n}</h3>${barrasHTML(o)}${indicadoresHTML(o)}<div class="shipbox">${naveSVG(o)}</div>
          <div class="launchbox"><div class="p">${ok ? `Probabilidad de éxito: ${o.chance}%` : 'Corrige los puntos en rojo para poder lanzar.'}</div>
            <button class="btn go2" id="lanzar" ${ok ? '' : 'disabled'}>LANZAR</button></div></div>
      </div>
      <div class="nav"><button class="btn light" data-ir="taller">‹ VOLVER AL TALLER</button></div>${enlacesAyuda()}`;
  };
  activarEnlaces();
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-prueba],#lanzar');
    if (!b || b.disabled) return;
    if (b.id === 'lanzar') ir('lanzamiento');
    else { partida.sel.tests = b.dataset.prueba; guardarPartida(partida); pintar(); }
  });
  pintar();
}
