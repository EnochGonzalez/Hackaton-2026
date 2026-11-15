/* CONTEXTO: explica el contrato antes de diseñar. Aquí es donde de verdad
   se inicia la misión (y donde se avisa si se va a perder el progreso). */
import {CATEGORIAS, ORB, mision} from '../../datos/misiones.js';
import {DIF, aplicarDificultad} from '../../datos/dificultades.js';
import {fmt} from '../../nucleo/calc.js';
import {cargarPartida, guardarPartida, nuevaPartida, misionDe, hayProgreso, esLaMisma, cargarPendiente, guardarPendiente} from '../../compartido/estado.js';
import {ir, activarEnlaces} from '../../compartido/nav.js';

const partida = cargarPartida(), pend = cargarPendiente();
if (!pend && !partida) ir('misiones');
else {
  const m = pend ? aplicarDificultad(mision(pend.id), pend.dif) : misionDe(partida);
  const perderia = pend && hayProgreso(partida) && !esLaMisma(partida, pend.id, pend.dif);
  document.querySelector('#app').innerHTML = `<button class="back" data-ir="misiones">‹ MISIONES</button>
    <div class="ctx paper">
      <div class="lbl">${CATEGORIAS.find(c => c.id === m.cat).n} · Contrato</div><h2>${m.n}</h2>
      <div class="chips"><span class="chip">PRESUPUESTO ${fmt(m.budget)} MDD</span><span class="chip">PLAZO ${m.deadline} MESES</span><span class="chip">ÓRBITA ${ORB[m.orbit]}</span>
        <span class="chip light">OPERACIÓN 12 MESES</span><span class="chip light">DIFICULTAD ${DIF[m.dif].n.toUpperCase()}</span></div>
      <div class="lbl">Contexto</div><p>${m.ctx}</p>
      <div class="row2"><div><div class="lbl">Objetivo</div><p>${m.goal}</p></div><div><div class="lbl">Requisito del contrato</div><p>${m.needTxt}</p></div></div>
      <div class="lbl">Misiones reales que lo inspiran</div><p>${m.real}</p>
      <div class="lbl">Cómo se evalúa</div><p>Ciencia 400 · Recursos 200 · Presupuesto 150 · Decisiones 150 · Equilibrio 100.</p>
      ${perderia ? `<div class="warnbar"><b>Tienes una misión en curso: ${misionDe(partida).n} (${DIF[partida.dif].n}).</b> Si inicias esta misión, el progreso de tu taller se perderá.</div>
        <div class="acciones"><button class="btn light" data-ir="taller">CONTINUAR ${misionDe(partida).n.toUpperCase()}</button><button class="go" id="iniciar">INICIAR ESTA MISIÓN Y PERDER EL PROGRESO</button></div>`
        : '<button class="go" id="iniciar">IR AL TALLER</button>'}
    </div>`;
  activarEnlaces();
  document.querySelector('#iniciar').addEventListener('click', () => {
    if (pend && !esLaMisma(partida, pend.id, pend.dif)) guardarPartida(nuevaPartida(pend.id, pend.dif));
    guardarPendiente(null);
    ir('taller');
  });
}
