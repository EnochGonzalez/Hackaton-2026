/* GLOSARIO: dos secciones con íconos y buscador */
import {GLO} from '../../datos/glosario.js';
import {activarEnlaces} from '../../compartido/nav.js';
import {ico} from '../../compartido/componentes.js';
import {t} from '../../idioma/idioma.js';

const app = document.querySelector('#app');
let seccion = 0;
function pintar() {
  const pestanas = GLO.map((g, i) => `<button class="stp ${i === seccion ? 'on' : ''}" data-sec="${i}">${g[0].toUpperCase()}</button>`).join('');
  app.innerHTML = `<button class="back" data-volver>‹ ${t('VOLVER')}</button>
    <div class="page paper"><h2>${t('Glosario')}</h2><div class="sub">${t('Los términos que vas a encontrar en el taller y en los contratos.')}</div>
      <div class="tools"><div class="steps">${pestanas}</div><input class="fld" id="buscar" placeholder="${t('Buscar término')}"></div>
      <div class="gl">${GLO[seccion][1].map(t => `<div class="gi" data-q="${(t[1] + ' ' + t[2]).toLowerCase()}">${ico(t[0])}<div><b>${t[1]}</b><span>${t[2]}</span></div></div>`).join('')}</div>
    </div>`;
}
activarEnlaces();
app.addEventListener('click', e => { const b = e.target.closest('[data-sec]'); if (b) { seccion = +b.dataset.sec; pintar(); } });
app.addEventListener('input', e => {
  if (e.target.id !== 'buscar') return;
  const q = e.target.value.toLowerCase();
  document.querySelectorAll('.gi').forEach(g => { g.style.display = g.dataset.q.includes(q) ? '' : 'none'; });
});
pintar();
