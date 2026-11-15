/* MARCADOR: tabla de clasificación local con 4 formas de ordenar */
import {DIF, ORDEN_DIF} from '../../datos/dificultades.js';
import {cargarTabla} from '../../compartido/estado.js';
import {activarEnlaces} from '../../compartido/nav.js';
import {limpio} from '../../compartido/componentes.js';
import {mision} from '../../datos/misiones.js';
import {t, tx} from '../../idioma/idioma.js';

const app = document.querySelector('#app');
const ORDENES = {
  todas: [tx('Todas las misiones'),            (a, b) => b.i - a.i],                                             // la más reciente primero
  dif:   [tx('Por dificultad'),                (a, b) => ORDEN_DIF[b.dif] - ORDEN_DIF[a.dif] || b.total - a.total],
  mayor: [tx('Calificación de mayor a menor'), (a, b) => b.total - a.total],
  menor: [tx('Calificación de menor a mayor'), (a, b) => a.total - b.total],
};
let orden = 'todas';

function pintar() {
  const filas = cargarTabla().map((x, i) => ({...x, i})).sort(ORDENES[orden][1]).slice(0, 50);
  app.innerHTML = `<button class="back" data-ir="inicio">‹ ${t('INICIO')}</button>
    <div class="page paper"><h2>${t('Tabla de clasificación')}</h2><div class="sub">${t('Partidas guardadas en este navegador.')}</div>
      <div class="tools"><select class="sel" id="orden">${Object.keys(ORDENES).map(k => `<option value="${k}" ${k === orden ? 'selected' : ''}>${t(ORDENES[k][0])}</option>`).join('')}</select></div>
      ${filas.length ? `<div class="tblwrap"><table class="tbl"><tr><th>#</th><th>${t('Comandante')}</th><th>${t('Misión')}</th><th>${t('Dificultad')}</th><th>${t('Nota')}</th><th>${t('Puntos')}</th><th>${t('Fecha')}</th></tr>
        ${filas.map((x, n) => `<tr><td>${n + 1}</td><td>${limpio(x.name)}</td><td>${limpio(mision(x.mid) ? mision(x.mid).n : x.mn)}</td><td>${(DIF[x.dif] || DIF.ing).n}</td><td class="g">${limpio(x.grade)}</td><td>${+x.total}</td><td>${limpio(x.date)}</td></tr>`).join('')}</table></div>`
        : `<div class="vacio">${t('Todavía no hay partidas. Termina una misión y agrégala a la tabla.')}</div>`}
    </div>`;
}
activarEnlaces();
app.addEventListener('change', e => { if (e.target.id === 'orden') { orden = e.target.value; pintar(); } });
pintar();
