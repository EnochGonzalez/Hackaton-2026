/* OPERACIONES: 12 meses. En los meses 2, 5, 8 y 11 ocurre un evento y hay que decidir.
   Tres columnas: recursos, la nave en su órbita y la decisión del mes con la bitácora. */
import {MESES_EVENTO} from '../../datos/eventos.js';
import {ORB} from '../../datos/misiones.js';
import {calc} from '../../nucleo/calc.js';
import {siguienteMes, elegir, eventoActual, textoBitacora, cienciaMensual} from '../../nucleo/operacion.js';
import {activarGuia} from '../../compartido/guia.js';
import {t} from '../../idioma/idioma.js';
import {guardarPartida, misionDe, guardarMejor} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {barra, barrasHTML, enlacesAyuda} from '../../compartido/componentes.js';
import {sateliteSVG} from '../../compartido/nave-svg.js';
import {iniciarEstrellas} from '../../compartido/estrellas.js';

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
    /* Escena: la nave flota sobre el planeta (cerca en SSO y LEO, lejos en GEO, diminuto desde L2).
       El retraso negativo hace que la animación siga donde iba al volver a pintar. */
    const fase = -((performance.now() / 1000) % 6).toFixed(2);
    const ritmo = cienciaMensual(o) * (ops.hp / 100);
    const estado = e ? `<span class="alerta">${t('ALERTA · Decisión pendiente')}</span>`
      : ops.month === 0 ? `<span>${t('En órbita · Lista para operar')}</span>`
      : `<span class="ok">${t('+{n} de ciencia por mes', {n: ritmo.toFixed(1)})}</span>`;
    const escena = `<div class="escena orb-${M.orbit} ${e ? 'alerta' : ''}">
        <div class="planeta"></div>
        ${M.cat === 'ojo' ? '<div class="haz"></div>' : ''}
        <div class="sat" style="animation-delay:${fase}s"><svg viewBox="0 0 440 400">${sateliteSVG(o, 220, 215, 1.2)}</svg></div>
        <div class="esc-dato izq"><small>${t('ÓRBITA')}</small><b>${ORB[M.orbit]}</b></div>
        <div class="esc-dato der"><small>${t('MES')}</small><b>${ops.month}<i> / 12</i></b></div>
        <div class="esc-estado">${estado}</div>
      </div>`;
    app.innerHTML = `<button class="back" data-ir="inicio">‹ ${t('INICIO')}</button>
      <div class="top"><span class="mname">${M.n} · ${t('Operación')}</span></div>
      <div class="opswrap">
        <div class="mon">${meses}</div>
        <div class="right">${barrasHTML(o, ops)}
          ${barra(t('Salud de la nave'), ops.hp + '%', ops.hp, ops.hp > 60 ? 'ok' : ops.hp > 30 ? 'warn' : 'bad')}
          ${barra(t('Ciencia acumulada'), Math.round(ops.sci) + ' / ' + M.sciTarget, ops.sci / M.sciTarget * 100, 'ok')}</div>
        ${escena}
        <div class="opsmain">${centro}
          <div class="card bitacora"><h3>${t('Bitácora')}</h3><div class="log">${ops.log.length ? ops.log.map(l => `<div><b>${t('Mes {m}', {m: l.m})}:</b> ${textoBitacora(l).c}</div>`).join('') : `<div style="opacity:.7">${t('Sin eventos todavía.')}</div>`}</div></div></div>
      </div>${enlacesAyuda()}`;
  };
  const trasAccion = () => {
    if (ops.done) { partida.rep = ops.rep; guardarMejor(partida.id, ops.rep); guardarPartida(partida); ir('reporte'); }
    else { guardarPartida(partida); pintar(); }
  };
  iniciarEstrellas({ritmo: .3, lateral: true});          // las estrellas pasan de lado: la nave va en órbita
  activarEnlaces();
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-op],#avanzar,#pista');
    if (!b) return;
    if (b.id === 'avanzar') { siguienteMes(o, ops); trasAccion(); }
    else if (b.id === 'pista') { ops.hint = !ops.hint; pintar(); }
    else { elegir(o, ops, +b.dataset.op); trasAccion(); }
  });
  pintar();
  activarGuia('operaciones');
}
