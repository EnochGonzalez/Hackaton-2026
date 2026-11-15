/* ============================================================
   NÚCLEO · Validador previo al lanzamiento (semáforo de 8 filas)
   Cada fila: {k: nombre, st: 'ok' | 'warn' | 'bad', msg, ir}
   ir = dónde se corrige: {cat: 'energia'} (una categoría del taller)
        o 'pruebas' (las pruebas en Tierra, en la misma revisión).
   Si hay varios problemas, ir apunta al primero que se muestra.
   ============================================================ */
import {ORBS} from '../datos/misiones.js';
import {parteCohete} from '../datos/cohete.js';
import {razonBloqueo, fmt, nivel} from './calc.js';
import {t} from '../idioma/idioma.js';

/* Junta la lista de problemas en un mensaje: "primero (y N más)" */
const resumen = (lista, siOk) => lista.length ? lista[0].msg + (lista.length > 1 ? ' ' + t('(y {n} más)', {n: lista.length - 1}) : '') : siOk;

export function validar(o) {
  const {M, s, ins, ch} = o, filas = [];
  const problema = (cat, msg) => ({cat, msg});

  // 1. Compatibilidad de misión y órbita
  const p = [];
  const nombres = {chasis: t('el chasis'), energia: t('la energía'), adcs: t('el apuntamiento'), comms: t('las comunicaciones'), prop: t('la propulsión'), termico: t('el soporte térmico')};
  const falta = ['chasis', 'energia', 'adcs', 'comms', 'prop'].filter(k => !s[k]);
  if (!s.termico.length) falta.push('termico');
  if (falta.length) p.push(problema(falta[0], t('Falta elegir {lista}.', {lista: falta.map(k => nombres[k]).join(', ')})));
  o.sat.forEach(x => { const r = razonBloqueo(x, x.cat, M, s); if (r) p.push(problema(x.cat, `${x.n}: ${r}`)); });
  if (ch && ins.length > ch.slots) p.push(problema('instr', t('El chasis tiene {r} ranura(s) y elegiste {n} sensores.', {r: ch.slots, n: ins.length})));
  if (ch) ins.forEach(x => { if (x.m > ch.maxS) p.push(problema('instr', t('{n} pesa {m} kg y este chasis soporta sensores de hasta {max} kg.', {n: x.n, m: fmt(x.m), max: fmt(ch.maxS)}))); });
  if (!M.need(ins, s)) p.push(problema('instr', M.needTxt));
  if (o.ad) ins.forEach(x => { if (x.prec > o.ad.prec) p.push(problema('adcs', t('{n} exige un apuntamiento más preciso que {a}.', {n: x.n, a: o.ad.n}))); });
  if (o.pr && o.pr.minGen && o.gen < o.pr.minGen) p.push(problema('energia', t('{n} exige paneles de al menos {w} W.', {n: o.pr.n, w: fmt(o.pr.minGen)})));
  filas.push({k: t('Compatibilidad de misión y órbita'), st: p.length ? 'bad' : 'ok', ir: {cat: p.length ? p[0].cat : 'chasis'},
    msg: resumen(p, t('Todas las piezas sirven para el contrato y la órbita {o}.', {o: ORBS[M.orbit]}))});

  // 2. Cohete armado y cofia
  const c = [];
  if (!o.cohetCompleto) {
    const partes = {f1: t('Fase 1'), boosters: t('boosters'), etapa: t('etapa superior'), cofia: t('cofia')};
    const faltan = Object.keys(partes).filter(k => !s[k]);
    c.push(problema(faltan[0], t('Faltan partes del cohete: {lista}.', {lista: faltan.map(k => partes[k]).join(', ')})));
  } else {
    ['boosters', 'etapa', 'cofia'].forEach(k => { const r = razonBloqueo(parteCohete(k, s[k]), k, M, s); if (r) c.push(problema(k, `${parteCohete(k, s[k]).n}: ${r}`)); });
    if (!o.cap) {
      const sinBoosters = o.f1.caps[s.boosters] && Object.values(o.f1.caps[s.boosters]).every(v => !v);
      c.push(sinBoosters ? problema('boosters', t('{n} no despega sin boosters.', {n: o.f1.n})) : problema('f1', t('Este cohete no llega a la órbita {o}.', {o: ORBS[M.orbit]})));
    }
    if (ch && ch.diam > o.co.diam) c.push(problema('cofia', t('El chasis mide {d} m de diámetro y la cofia solo {c} m.', {d: ch.diam, c: o.co.diam})));
    if ((ch && ch.largo || ins.some(x => x.largo)) && !o.co.largo) c.push(problema('cofia', t('El telescopio plegado no cabe: exige la cofia gigante de 17 m.')));
  }
  filas.push({k: t('Cohete y cofia'), st: c.length ? 'bad' : 'ok', ir: {cat: c.length ? c[0].cat : 'f1'},
    msg: resumen(c, t('Cohete completo. El satélite cabe en la cofia de {d} m.', {d: o.co ? o.co.diam : 0}))});

  // 3. Masa contra cohete: si falta capacidad, se corrige con boosters o con otra Fase 1
  const msgMasa = o.massPct > 100 ? t('No despega: quita peso, agrega boosters o cambia la Fase 1.') : o.massPct > 85 ? t('Margen bajo.') : t('Hay margen.');
  filas.push({k: t('Masa contra cohete'), st: o.cap ? nivel(o.massPct) : 'bad', ir: {cat: o.cap && s.f1 ? 'boosters' : 'f1'},
    msg: o.cap ? t('{m} de {c} kg hacia {o}.', {m: fmt(o.mass), c: fmt(o.cap), o: ORBS[M.orbit]}) + ' ' + msgMasa : t('Arma un cohete que llegue a la órbita del contrato.')});

  // 4. Balance de potencia
  const msgPot = o.enPct > 100 ? t('Faltan watts.') : o.enPct > 85 ? t('Margen bajo.') : t('Hay margen.');
  filas.push({k: t('Balance de potencia'), st: o.en ? nivel(o.enPct) : 'bad', ir: {cat: 'energia'},
    msg: o.en ? t('Consumes {u} W y generas {g} W.', {u: fmt(o.use), g: fmt(o.gen)}) + ' ' + msgPot : t('Elige una fuente de energía.')});

  // 5. Requisito térmico
  const tm = [];
  ins.forEach(x => {
    if (x.temp && o.tempMin > x.temp) tm.push(problema('termico', o.tempMin === 999
      ? t('{n} exige {k} K y no tienes soporte térmico.', {n: x.n, k: x.temp})
      : t('{n} exige {k} K y tu soporte térmico solo llega a {min} K.', {n: x.n, k: x.temp, min: o.tempMin})));
    (x.needs || []).forEach(n => { if (!s.termico.includes(n)) tm.push(problema('termico', n === 'sun' ? t('{n} exige el parasol de 5 capas.', {n: x.n}) : t('{n} exige el lazo fluido activo.', {n: x.n}))); });
  });
  filas.push({k: t('Requisito térmico'), st: tm.length ? 'bad' : 'ok', ir: {cat: 'termico'},
    msg: resumen(tm, t('Todos los sensores están a su temperatura de operación.'))});

  // 6. Ancho de banda: se corrige con una antena más rápida
  filas.push({k: t('Ancho de banda de datos'), st: o.dataPct > 200 ? 'bad' : o.dataPct > 100 ? 'warn' : 'ok', ir: {cat: 'comms'},
    msg: t('Generas {g} Mbps promedio y envías hasta {e}.', {g: o.dg.toFixed(1), e: o.send}) + ' '
      + (o.dataPct > 100 ? t('Perderías {p}% de los datos.', {p: Math.round((1 - o.delivered) * 100)}) : t('Todo llega a Tierra.'))});

  // 7. Confiabilidad y construcción: las pruebas en Tierra están en la misma revisión
  filas.push({k: t('Confiabilidad y construcción'), st: o.rel < 75 || o.months > M.deadline * 1.2 ? 'bad' : (o.rel < 90 || o.months > M.deadline) ? 'warn' : 'ok', ir: 'pruebas',
    msg: t('Confiabilidad {r}% (meta: 90% o más). Construcción {m} de {d} meses.', {r: o.rel, m: o.months, d: M.deadline})});

  // 8. Presupuesto: lleva al paso donde se gastó más
  filas.push({k: t('Presupuesto'), st: nivel(o.costPct), ir: {cat: categoriaMasCara(o)},
    msg: t('${c} de ${b} millones de dólares (cohete: ${r} M).', {c: fmt(o.cost), b: fmt(M.budget), r: fmt(o.costCohete)})});
  return filas;
}

/* Categoría con más gasto (para saber dónde ahorrar) */
function categoriaMasCara(o) {
  const gasto = {};
  o.sat.forEach(x => { gasto[x.cat] = (gasto[x.cat] || 0) + x.c; });
  if (o.f1) gasto.f1 = o.costCohete;
  const [cat] = Object.entries(gasto).sort((a, b) => b[1] - a[1])[0] || ['chasis'];
  return cat;
}

export const puedeLanzar = o => o.rows.every(r => r.st !== 'bad');
