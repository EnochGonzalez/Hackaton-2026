/* ============================================================
   NÚCLEO · Cálculo del diseño (sin DOM)
   calc(M, sel) junta las piezas elegidas y devuelve totales y porcentajes.
   ============================================================ */
import {PIEZAS, PRUEBAS, pieza} from '../datos/piezas.js';
import {PARTES_COHETE, ORDEN_COHETE, parteCohete, capacidad} from '../datos/cohete.js';
import {ORBS} from '../datos/misiones.js';
import {validar} from './validacion.js';

export const suma = (lista, campo) => lista.reduce((s, x) => s + (x[campo] || 0), 0);
export const fmt  = n => Math.round(n).toLocaleString('es-MX');
export const nivel = (pct, aviso = 85, tope = 100) => pct > tope ? 'bad' : pct > aviso ? 'warn' : 'ok';

/* Selección vacía de una partida nueva */
export const nuevaSeleccion = () => ({chasis:null, energia:null, instr:[], termico:[], adcs:null, comms:null, prop:null,
  f1:null, boosters:null, etapa:null, cofia:null, tests:'none'});

/* Categorías donde se pueden elegir varias piezas */
export const MULTI = ['instr', 'termico'];
export const esCohete = cat => ORDEN_COHETE.includes(cat);

/* Lista de opciones que se muestran en una categoría para una misión */
export function opciones(cat, M) {
  if (esCohete(cat)) return PARTES_COHETE[cat];
  return PIEZAS.filter(p => p.cat === cat && (!p.only || p.only === M.cat));
}

/* Devuelve por qué una pieza no se puede usar (o null si sí se puede) */
export function razonBloqueo(it, cat, M, sel) {
  if (esCohete(cat)) {
    const paso = ORDEN_COHETE.indexOf(cat);
    if (paso > 0 && !sel[ORDEN_COHETE[paso - 1]]) return 'Primero elige la parte anterior del cohete.';
    const f1 = parteCohete('f1', sel.f1);
    if (cat === 'boosters' && !(it.id in f1.caps)) return `No se acopla a ${f1.n}.`;
    if (cat === 'etapa' && !f1.etapas.includes(it.id)) return `No es compatible con ${f1.n}.`;
    if (cat === 'cofia' && !f1.cofias.includes(it.id)) return `No se monta sobre ${f1.n}.`;
    return null;
  }
  if (it.only && it.only !== M.cat) return 'No es compatible con este tipo de misión.';
  if (it.orb && !it.orb.includes(M.orbit)) return `No funciona en la órbita del contrato (${ORBS[M.orbit]}).`;
  return null;
}

export function calc(M, s) {
  const g = id => id ? pieza(id) : null;
  const ch = g(s.chasis), en = g(s.energia), ad = g(s.adcs), cm = g(s.comms), pr = g(s.prop);
  const ins = s.instr.map(pieza), ter = s.termico.map(pieza);
  const f1 = parteCohete('f1', s.f1), bo = parteCohete('boosters', s.boosters), et = parteCohete('etapa', s.etapa), co = parteCohete('cofia', s.cofia);
  const ts = PRUEBAS.find(x => x.id === s.tests) || PRUEBAS[0];
  const sat = [ch, en, ad, cm, pr].filter(Boolean).concat(ins, ter);   // piezas del satélite
  const cohete = [f1, bo, et, co].filter(Boolean);

  const o = {M, s, ch, en, ad, cm, pr, ins, ter, f1, bo, et, co, ts, sat, cohete};
  o.mass = suma(sat, 'm');
  o.cap  = capacidad(s, M.orbit);
  o.use  = suma(sat, 'w');
  o.gen  = en ? en.gen : 0;
  o.dg   = suma(ins, 'mbps') * M.duty;          // datos promedio generados
  o.send = cm ? cm.mbps : 0;                    // datos que la antena puede enviar
  o.costCohete = suma(cohete, 'c');
  o.cost = suma(sat, 'c') + o.costCohete + ts.cMul * M.testBase;
  o.months = Math.ceil(suma(sat, 't') * .5) + ts.t;   // las piezas se construyen en paralelo
  o.rel  = Math.max(0, Math.min(99, 92 + suma(sat, 'rel') + ts.rel));
  o.tempMin = ter.length ? Math.min(...ter.map(x => x.tempMin)) : 999;
  o.sciPot = Math.min(100, suma(ins, 'sci'));
  o.delivered = o.dg ? Math.min(1, o.send / o.dg) : 0;
  o.cohetCompleto = cohete.length === 4;

  o.massPct = o.cap ? o.mass / o.cap * 100 : (o.mass && o.cohetCompleto ? 999 : 0);
  o.enPct   = o.gen ? o.use / o.gen * 100 : (o.use ? 999 : 0);
  o.dataPct = o.send ? o.dg / o.send * 100 : (o.dg ? 999 : 0);
  o.costPct = o.cost / M.budget * 100;
  o.chance  = o.cohetCompleto ? Math.min(99, Math.round(f1.rel * o.rel * (M.lch || 1))) : 0;
  o.rows = validar(o);
  return o;
}
