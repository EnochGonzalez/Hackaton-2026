/* REVISIÓN: semáforo de 8 filas, pruebas en Tierra y botón LANZAR */
import {PRUEBAS, PASOS} from '../../datos/piezas.js';
import {ORDEN_COHETE} from '../../datos/cohete.js';
import {ORBS} from '../../datos/misiones.js';
import {calc, fmt} from '../../nucleo/calc.js';
import {puedeLanzar} from '../../nucleo/validacion.js';
import {guardarPartida, misionDe} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {barrasHTML, indicadoresHTML, enlacesAyuda} from '../../compartido/componentes.js';
import {naveSVG} from '../../compartido/nave-svg.js';
import {t} from '../../idioma/idioma.js';

const app = document.querySelector('#app');
const partida = exigirPartida();
if (partida && partida.rep) ir('reporte');
else if (partida && partida.ops) ir('operaciones');
else if (partida) {
  const M = misionDe(partida);
  let filas = [];
  const pintar = () => {
    const o = calc(M, partida.sel), ok = puedeLanzar(o);
    filas = o.rows;
    const lista = filas.map((r, i) => `<button class="vrow ${r.st}" data-fila="${i}" title="${r.ir === 'pruebas' ? t('Ver las pruebas en Tierra') : t('Ir al taller a corregirlo')}">
      <div class="dot ${r.st}">${r.st === 'ok' ? '✓' : r.st === 'warn' ? '!' : '×'}</div><div><b>${r.k}</b><span>${r.msg}</span></div><i class="ir">${r.ir === 'pruebas' ? '↓' : '›'}</i></button>`).join('');
    const pruebas = PRUEBAS.map(x => `<button class="${partida.sel.tests === x.id ? 'on' : ''}" data-prueba="${x.id}">${x.n.toUpperCase()}</button>`).join('');
    const ts = o.ts;
    app.innerHTML = `<button class="back" data-ir="inicio">‹ ${t('INICIO')}</button>
      <div class="top"><span class="mname">${M.n} · ${ORBS[M.orbit]} · ${t('Revisión')}</span></div>
      <div class="revwrap">
        <div class="rev paper"><h2>${t('Revisión previa al lanzamiento')}</h2><p class="pista">${t('Toca un punto para ir a donde se corrige.')}</p>${lista}
          <div class="pruebas"><div class="lbl">${t('Pruebas en Tierra')}</div><div class="seg">${pruebas}</div>
            <small>${ts.txt} ${ts.rel ? t('+{r} de confiabilidad, +{m} meses y ${c} M.', {r: ts.rel, m: ts.t, c: fmt(ts.cMul * M.testBase)}) : ''}</small></div>
        </div>
        <div class="right"><h3>${M.n}</h3>${barrasHTML(o)}${indicadoresHTML(o)}<div class="shipbox">${naveSVG(o)}</div>
          <div class="launchbox"><div class="p">${ok ? t('Probabilidad de éxito: {p}%', {p: o.chance}) : t('Corrige los puntos en rojo para poder lanzar.')}</div>
            <button class="btn go2" id="lanzar" ${ok ? '' : 'disabled'}>${t('LANZAR')}</button></div></div>
      </div>
      <div class="nav"><button class="btn light" data-ir="taller">‹ ${t('VOLVER AL TALLER')}</button></div>${enlacesAyuda()}`;
  };
  activarEnlaces();
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-prueba],[data-fila],#lanzar');
    if (!b || b.disabled) return;
    if (b.id === 'lanzar') ir('lanzamiento');
    else if (b.dataset.fila !== undefined) irACorregir(filas[+b.dataset.fila].ir);
    else { partida.sel.tests = b.dataset.prueba; guardarPartida(partida); pintar(); }
  });
  /* Lleva al lugar donde se corrige una fila: las pruebas (aquí mismo) o un paso del taller */
  function irACorregir(destino) {
    if (destino === 'pruebas') {
      const caja = document.querySelector('.pruebas');
      caja.scrollIntoView({behavior: 'smooth', block: 'center'});
      caja.classList.remove('resaltado'); void caja.offsetWidth; caja.classList.add('resaltado');
      return;
    }
    const cat = destino.cat;
    partida.paso = PASOS.findIndex(p => p.cats.includes(cat));
    if (ORDEN_COHETE.includes(cat)) partida.sub = ORDEN_COHETE.indexOf(cat);
    partida.resaltar = cat;                      // el taller lo usa una vez para señalar la categoría
    guardarPartida(partida); ir('taller');
  }
  pintar();
}
