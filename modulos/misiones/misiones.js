/* MISIONES: se elige dificultad y contrato. Aceptar NO borra el taller:
   solo deja la misión como "pendiente" y abre su contexto. */
import {CATEGORIAS, MISIONES, ORBS} from '../../datos/misiones.js';
import {DIF, aplicarDificultad} from '../../datos/dificultades.js';
import {fmt} from '../../nucleo/calc.js';
import {cargarPartida, misionDe, hayProgreso, esLaMisma, cargarDificultad, guardarDificultad, guardarPendiente, cargarMarcador} from '../../compartido/estado.js';
import {ir, activarEnlaces} from '../../compartido/nav.js';

const app = document.querySelector('#app');
const partida = cargarPartida(), enCurso = hayProgreso(partida), marcas = cargarMarcador();
let dif = cargarDificultad(), abierta = partida ? misionDe(partida).cat : 'ojo';
guardarPendiente(null);

function pintar() {
  const selector = Object.keys(DIF).map(k => `<button class="${dif === k ? 'on' : ''}" data-dif="${k}">${DIF[k].n.toUpperCase()}</button>`).join('');
  const lista = CATEGORIAS.map(c => {
    const filas = abierta !== c.id ? '' : MISIONES.filter(m => m.cat === c.id).map(m0 => {
      const m = aplicarDificultad(m0, dif), esta = enCurso && esLaMisma(partida, m.id, dif), mejor = marcas[m.id];
      return `<div class="mrow"><div class="tt">
          <b>${m.n}${esta ? '<span class="best curso">EN CURSO</span>' : ''}${mejor ? `<span class="best">MEJOR ${mejor.grade} · ${mejor.total}</span>` : ''}</b>
          <span>${fmt(m.budget)} MDD · PLAZO ${m.deadline} MESES · ÓRBITA ${ORBS[m.orbit]}</span></div>
        ${esta ? '<button class="btn" data-ir="taller">CONTINUAR</button>' : `<button class="go" data-aceptar="${m.id}">ACEPTAR</button>`}</div>`;
    }).join('');
    return `<button class="cat" data-cat="${c.id}"><span>${c.n}</span><small>${abierta === c.id ? '▲' : '▼'} ${c.txt}</small></button>${filas}`;
  }).join('');
  app.innerHTML = `<button class="back" data-ir="inicio">‹ INICIO</button>
    <div class="mis paper">
      ${enCurso ? `<div class="warnbar"><b>Tienes una misión en curso: ${misionDe(partida).n} (${DIF[partida.dif].n}).</b> Si inicias una misión nueva, el progreso de tu taller se puede perder.</div>` : ''}
      <div class="difbar"><div class="lbl">Dificultad</div><div class="seg">${selector}</div><p>${DIF[dif].txt}</p></div>
      ${lista}
    </div>`;
}

activarEnlaces();
app.addEventListener('click', e => {
  const b = e.target.closest('[data-dif],[data-cat],[data-aceptar]');
  if (!b) return;
  if (b.dataset.dif) { dif = b.dataset.dif; guardarDificultad(dif); pintar(); }
  else if (b.dataset.cat) { abierta = abierta === b.dataset.cat ? null : b.dataset.cat; pintar(); }
  else { guardarPendiente({id: b.dataset.aceptar, dif}); ir('contexto'); }
});
pintar();
