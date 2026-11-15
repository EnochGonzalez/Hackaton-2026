/* OPERACIONES: 12 meses. En los meses 2, 5, 8 y 11 ocurre un evento y hay que decidir. */
import {MESES_EVENTO} from '../../datos/eventos.js';
import {calc} from '../../nucleo/calc.js';
import {siguienteMes, elegir, eventoActual, textoBitacora} from '../../nucleo/operacion.js';
import {t} from '../../idioma/idioma.js';
import {guardarPartida, misionDe, guardarMejor} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {barra, barrasHTML, enlacesAyuda} from '../../compartido/componentes.js';
import {naveSVG} from '../../compartido/nave-svg.js';

const app = document.querySelector('#app');
const partida = exigirPartida('ops');
if (partida && partida.rep) ir('reporte');
else if (partida) {
  const M = misionDe(partida), o = calc(M, partida.sel), ops = partida.ops;
  const OJO = '<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const pintar = () => {
    const meses = Array.from({length: 12}, (_, i) => `<i class="${i + 1 <= ops.month ? 'past' : ''} ${i + 1 === ops.month ? 'now' : ''} ${MESES_EVENTO.includes(i + 1) ? 'evt' : ''}">${i + 1}</i>`).join('');
    const e = eventoActual(ops);
    const centro = e
      ? `<div class="card"><h3>${t('Mes {m}', {m: ops.month})}: ${e.t}</h3><p>${e.q}</p>
          ${e.o.map((x, i) => `<button class="opt" data-op="${i}"><b>${x.n}</b><span>${x.d}</span></button>`).join('')}
          <button class="eye" id="pista">${OJO} ${t('PISTA')}</button>
          ${ops.hint ? `<div class="hint">${e.o.map(x => `<div><b>${x.n}:</b> ${x.hint}</div>`).join('')}</div>` : ''}</div>`
      : `<div class="card"><h3>${t('Mes {m} de 12', {m: ops.month})}</h3><p>${ops.month === 0 ? t('La nave está en órbita. Avanza mes a mes: de vez en cuando ocurrirá algo que te obligará a decidir.') : t('Todo en orden este mes.')}</p>
          <button class="btn" id="avanzar">${ops.month === 0 ? t('COMENZAR') : t('AVANZAR UN MES')} ›</button></div>`;
    app.innerHTML = `<button class="back" data-ir="inicio">‹ ${t('INICIO')}</button>
      <div class="top"><span class="mname">${M.n} · ${t('Operación')}</span></div>
      <div class="opswrap">
        <div class="opsmain"><div class="mon">${meses}</div>${centro}
          <div class="card"><h3 style="font-size:18px">${t('Bitácora')}</h3><div class="log">${ops.log.length ? ops.log.map(l => `<div><b>${t('Mes {m}', {m: l.m})}:</b> ${textoBitacora(l).c}</div>`).join('') : `<div style="opacity:.7">${t('Sin eventos todavía.')}</div>`}</div></div></div>
        <div class="right">${barrasHTML(o, ops)}
          ${barra(t('Salud de la nave'), ops.hp + '%', ops.hp, ops.hp > 60 ? 'ok' : ops.hp > 30 ? 'warn' : 'bad')}
          ${barra(t('Ciencia acumulada'), Math.round(ops.sci) + ' / ' + M.sciTarget, ops.sci / M.sciTarget * 100, 'ok')}
          <div class="shipbox">${naveSVG(o)}</div></div>
      </div>${enlacesAyuda()}`;
  };
  const trasAccion = () => {
    if (ops.done) { partida.rep = ops.rep; guardarMejor(partida.id, ops.rep); guardarPartida(partida); ir('reporte'); }
    else { guardarPartida(partida); pintar(); }
  };
  activarEnlaces();
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-op],#avanzar,#pista');
    if (!b) return;
    if (b.id === 'avanzar') { siguienteMes(o, ops); trasAccion(); }
    else if (b.id === 'pista') { ops.hint = !ops.hint; pintar(); }
    else { elegir(o, ops, +b.dataset.op); trasAccion(); }
  });
  pintar();
}
