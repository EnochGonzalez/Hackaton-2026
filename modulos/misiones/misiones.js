/* MISIONES: se elige dificultad y contrato, o un entrenamiento guiado.
   Las dos categorías se ven lado a lado. Aceptar NO borra el taller:
   solo deja la misión como "pendiente" y abre su contexto. */
import {CATEGORIAS, MISIONES, ORBS} from '../../datos/misiones.js';
import {DIF, aplicarDificultad} from '../../datos/dificultades.js';
import {fmt} from '../../nucleo/calc.js';
import {cargarPartida, misionDe, hayProgreso, esLaMisma, esTutorial, cargarDificultad, guardarDificultad, guardarPendiente, cargarMarcador, cargarGuia, guardarGuia} from '../../compartido/estado.js';
import {ir, activarEnlaces} from '../../compartido/nav.js';
import {ico} from '../../compartido/componentes.js';
import {preguntar} from '../../compartido/dialogo.js';
import {t} from '../../idioma/idioma.js';

const app = document.querySelector('#app');
const partida = cargarPartida(), marcas = cargarMarcador();
const enCurso = hayProgreso(partida) && !esTutorial(partida);     // misión real con progreso
let dif = cargarDificultad();
guardarPendiente(null);

const ICONO_CAT = {ojo: 'orbita', tel: 'espejo'};

/* Tarjeta del entrenamiento guiado de una categoría */
function tarjetaEntrenamiento(c) {
  const m = MISIONES.find(x => x.cat === c.id && x.tuto);
  if (!m) return '';
  const enMarcha = partida && partida.id === m.id && !partida.rep && hayProgreso(partida), hecho = marcas[m.id];
  const boton = enMarcha ? `<button class="btn" data-tuto="${m.id}" data-seguir>${t('CONTINUAR')}</button>`
    : `<button class="btn" data-tuto="${m.id}">${hecho ? t('REPETIR') : t('EMPEZAR')}</button>`;
  return `<div class="tuto">
      <div class="tuto-tx"><div class="lbl">${t('Entrenamiento guiado')}${hecho ? `<span class="best ok">${t('COMPLETADO')}</span>` : ''}</div>
        <b>${m.n}</b><small>${t('Te guiamos paso a paso por toda la misión.')}</small></div>
      ${boton}
    </div>`;
}

/* Tarjeta de un contrato */
function tarjetaContrato(m0, n) {
  const m = aplicarDificultad(m0, dif), esta = enCurso && esLaMisma(partida, m.id, dif), mejor = marcas[m.id];
  return `<div class="mcard ${esta ? 'curso' : ''}">
      <i class="nivel" title="${t('Nivel {n} de 3', {n})}">${n}</i>
      <div class="mtx">
        <b>${m.n}</b>
        <p title="${m.goal}">${m.goal}</p>
        <div class="mdat"><span>$${fmt(m.budget)} MDD</span><span>${t('{p} meses', {p: m.deadline})}</span><span>${ORBS[m.orbit]}</span>
          ${esta ? `<span class="best curso">${t('EN CURSO')}</span>` : ''}${mejor ? `<span class="best">${t('MEJOR')} ${mejor.grade} · ${mejor.total}</span>` : ''}</div>
      </div>
      ${esta ? `<button class="btn" data-ir="taller">${t('CONTINUAR')}</button>` : `<button class="go" data-aceptar="${m.id}">${t('ACEPTAR')}</button>`}
    </div>`;
}

function pintar() {
  const selector = Object.keys(DIF).map(k => `<button class="${dif === k ? 'on' : ''}" data-dif="${k}" aria-pressed="${dif === k}">${DIF[k].n.toUpperCase()}</button>`).join('');
  const columnas = CATEGORIAS.map(c => `<section class="col">
      <div class="ccab">${ico(ICONO_CAT[c.id])}<div><h3>${c.n}</h3><p>${c.txt}</p></div></div>
      ${tarjetaEntrenamiento(c)}
      <div class="mlist"><div class="lbl">${t('Contratos')}</div>
        ${MISIONES.filter(m => m.cat === c.id && !m.tuto).map((m, i) => tarjetaContrato(m, i + 1)).join('')}</div>
    </section>`).join('');
  app.innerHTML = `<button class="back" data-ir="inicio">‹ ${t('INICIO')}</button>
    <div class="mis">
      <div class="mhead">
        <div><h2>${t('Elige tu misión')}</h2><p class="sub">${t('¿Primera vez? Empieza con un entrenamiento guiado.')}</p></div>
        <div class="difbox"><div class="lbl">${t('Dificultad de los contratos')}</div><div class="seg">${selector}</div><small>${DIF[dif].txt}</small></div>
      </div>
      ${enCurso ? `<div class="aviso">${ico('cohete')}<div><b>${t('Tienes una misión en curso: {n} ({d}).', {n: misionDe(partida).n, d: DIF[partida.dif].n})}</b> ${t('Si eliges otra, te preguntaremos antes de borrar tu diseño.')}</div>
        <button class="btn" data-ir="taller">${t('CONTINUAR')}</button></div>` : ''}
      <div class="cols">${columnas}</div>
    </div>`;
}

activarEnlaces();
/* Si hay una misión real en curso y se elige otra, pregunta antes de seguir */
async function confirmarCambio(id, d) {
  if (!enCurso || esLaMisma(partida, id, d)) return true;
  const actual = misionDe(partida), nueva = aplicarDificultad(MISIONES.find(m => m.id === id), d);
  return preguntar({
    titulo: t('¿Iniciar una misión nueva?'),
    texto: t('Tienes en curso <b>{a}</b> ({d}). Si inicias <b>{n}</b>, se borrará el diseño de tu taller.', {a: actual.n, d: DIF[partida.dif].n, n: nueva.n}),
    no: t('SEGUIR CON MI MISIÓN'), si: t('SÍ, INICIAR NUEVA'),
  });
}

app.addEventListener('click', async e => {
  const b = e.target.closest('[data-dif],[data-aceptar],[data-tuto]');
  if (!b) return;
  if (b.dataset.dif) { dif = b.dataset.dif; guardarDificultad(dif); pintar(); }
  else if (b.dataset.tuto) {
    const id = b.dataset.tuto, g = cargarGuia();
    if (b.dataset.seguir !== undefined) {                    // continuar: vuelve a encender la guía sin perder lo leído
      guardarGuia({id, vistos: g && g.id === id ? g.vistos : [], off: false});
      ir('taller');
    } else {                                                 // empezar o repetir: siempre desde cero y en Novato
      if (!await confirmarCambio(id, 'cad')) return;
      guardarGuia({id, vistos: [], off: false});
      guardarPendiente({id, dif: 'cad', nuevo: true, confirmado: true});
      ir('contexto');
    }
  }
  else {
    const id = b.dataset.aceptar;
    if (!await confirmarCambio(id, dif)) return;
    guardarPendiente({id, dif, confirmado: true});
    ir('contexto');
  }
});
pintar();
