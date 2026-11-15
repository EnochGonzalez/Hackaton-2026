/* ============================================================
   NÚCLEO · Operación de 12 meses con eventos (sin DOM)
   ============================================================ */
import {EV, MESES_EVENTO} from '../datos/eventos.js';
import {puntuar} from './puntuacion.js';

export const nuevaOperacion = () => ({month:0, sci:0, hp:100, spent:0, log:[], ev:null, hint:false, done:false, qs:[], rep:null});
export const cienciaMensual = o => o.sciPot * o.delivered / 12;
export const eventoActual = ops => ops.ev ? EV[ops.ev] : null;

/* Avanza un mes. Si toca evento, lo deja pendiente en ops.ev */
export function siguienteMes(o, ops) {
  if (ops.ev || ops.done) return;
  ops.month++; ops.hint = false;
  ops.sci += cienciaMensual(o) * (ops.hp / 100);
  ops.spent += o.M.opsM;
  const i = MESES_EVENTO.indexOf(ops.month);
  if (i >= 0) ops.ev = o.M.events[i];
  else if (ops.month >= 12) terminar(o, ops);
}

/* Aplica la opción i del evento pendiente */
export function elegir(o, ops, i, azar = Math.random) {
  const e = EV[ops.ev], x = e.o[i], mes = cienciaMensual(o);
  let resultado = x.d, salioMal = false;
  ops.sci += (x.sci || 0) * mes; ops.hp += x.hp || 0; ops.spent += (x.cash || 0) * o.M.cashUnit;
  if (x.risk && azar() < x.risk.p * (o.M.risk || 1)) {
    ops.hp += x.risk.hp || 0; ops.sci += (x.risk.sci || 0) * mes; resultado = x.risk.msg; salioMal = true;
  }
  ops.sci = Math.max(0, ops.sci); ops.hp = Math.max(0, Math.min(100, ops.hp));
  ops.qs.push(salioMal ? Math.max(0, x.q - .4) : x.q);
  ops.log.push({m: ops.month, t: e.t, c: `Elegiste "${x.n}". ${resultado}`});
  ops.ev = null; ops.hint = false;
  if (ops.month >= 12) terminar(o, ops);
}

function terminar(o, ops) { ops.done = true; ops.rep = puntuar(o, ops); }
