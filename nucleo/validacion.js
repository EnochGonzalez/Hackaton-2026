/* ============================================================
   NÚCLEO · Validador previo al lanzamiento (semáforo de 8 filas)
   Cada fila: {k: nombre, st: 'ok' | 'warn' | 'bad', msg}
   ============================================================ */
import {ORBS} from '../datos/misiones.js';
import {parteCohete} from '../datos/cohete.js';
import {razonBloqueo, fmt, nivel} from './calc.js';

export function validar(o) {
  const {M, s, ins, ch} = o, filas = [];

  // 1. Compatibilidad de misión y órbita
  const p = [];
  const falta = [['chasis','el chasis'],['energia','la energía'],['adcs','el apuntamiento'],['comms','las comunicaciones'],['prop','la propulsión']]
    .filter(([k]) => !s[k]).map(x => x[1]);
  if (!s.termico.length) falta.push('el soporte térmico');
  if (falta.length) p.push('Falta elegir ' + falta.join(', ') + '.');
  o.sat.forEach(x => { const r = razonBloqueo(x, x.cat, M, s); if (r) p.push(`${x.n}: ${r}`); });
  if (ch && ins.length > ch.slots) p.push(`El chasis tiene ${ch.slots} ranura(s) y elegiste ${ins.length} sensores.`);
  if (ch) ins.forEach(x => { if (x.m > ch.maxS) p.push(`${x.n} pesa ${fmt(x.m)} kg y este chasis soporta sensores de hasta ${fmt(ch.maxS)} kg.`); });
  if (!M.need(ins, s)) p.push(M.needTxt);
  if (o.ad) ins.forEach(x => { if (x.prec > o.ad.prec) p.push(`${x.n} exige un apuntamiento más preciso que ${o.ad.n}.`); });
  if (o.pr && o.pr.minGen && o.gen < o.pr.minGen) p.push(`${o.pr.n} exige paneles de al menos ${fmt(o.pr.minGen)} W.`);
  filas.push({k:'Compatibilidad de misión y órbita', st: p.length ? 'bad' : 'ok',
    msg: p.length ? p[0] + (p.length > 1 ? ` (y ${p.length - 1} más)` : '') : `Todas las piezas sirven para el contrato y la órbita ${ORBS[M.orbit]}.`});

  // 2. Cohete armado y cofia
  const c = [];
  if (!o.cohetCompleto) c.push('Faltan partes del cohete: ' + [['f1','Fase 1'],['boosters','boosters'],['etapa','etapa superior'],['cofia','cofia']].filter(([k]) => !s[k]).map(x => x[1]).join(', ') + '.');
  else {
    ['boosters','etapa','cofia'].forEach(k => { const r = razonBloqueo(parteCohete(k, s[k]), k, M, s); if (r) c.push(`${parteCohete(k, s[k]).n}: ${r}`); });
    if (!o.cap) c.push(o.f1.caps[s.boosters] && Object.values(o.f1.caps[s.boosters]).every(v => !v) ? `${o.f1.n} no despega sin boosters.` : `Este cohete no llega a la órbita ${ORBS[M.orbit]}.`);
    if (ch && ch.diam > o.co.diam) c.push(`El chasis mide ${ch.diam} m de diámetro y la cofia solo ${o.co.diam} m.`);
    if ((ch && ch.largo || ins.some(x => x.largo)) && !o.co.largo) c.push('El telescopio plegado no cabe: exige la cofia gigante de 17 m.');
  }
  filas.push({k:'Cohete y cofia', st: c.length ? 'bad' : 'ok', msg: c.length ? c[0] + (c.length > 1 ? ` (y ${c.length - 1} más)` : '') : `Cohete completo. El satélite cabe en la cofia de ${o.co.diam} m.`});

  // 3. Masa contra cohete
  filas.push({k:'Masa contra cohete', st: o.cap ? nivel(o.massPct) : 'bad',
    msg: o.cap ? `${fmt(o.mass)} de ${fmt(o.cap)} kg hacia ${ORBS[M.orbit]}. ${o.massPct > 100 ? 'No despega: quita peso, agrega boosters o cambia la Fase 1.' : o.massPct > 85 ? 'Margen bajo.' : 'Hay margen.'}` : 'Arma un cohete que llegue a la órbita del contrato.'});

  // 4. Balance de potencia
  filas.push({k:'Balance de potencia', st: o.en ? nivel(o.enPct) : 'bad',
    msg: o.en ? `Consumes ${fmt(o.use)} W y generas ${fmt(o.gen)} W. ${o.enPct > 100 ? 'Faltan watts.' : o.enPct > 85 ? 'Margen bajo.' : 'Hay margen.'}` : 'Elige una fuente de energía.'});

  // 5. Requisito térmico
  const t = [];
  ins.forEach(x => {
    if (x.temp && o.tempMin > x.temp) t.push(`${x.n} exige ${x.temp} K y tu soporte térmico solo llega a ${o.tempMin === 999 ? 'nada' : o.tempMin + ' K'}.`);
    (x.needs || []).forEach(n => { if (!s.termico.includes(n)) t.push(`${x.n} exige ${n === 'sun' ? 'el parasol de 5 capas' : 'el lazo fluido activo'}.`); });
  });
  filas.push({k:'Requisito térmico', st: t.length ? 'bad' : 'ok', msg: t.length ? t[0] + (t.length > 1 ? ` (y ${t.length - 1} más)` : '') : 'Todos los sensores están a su temperatura de operación.'});

  // 6. Ancho de banda
  filas.push({k:'Ancho de banda de datos', st: o.dataPct > 200 ? 'bad' : o.dataPct > 100 ? 'warn' : 'ok',
    msg: `Generas ${o.dg.toFixed(1)} Mbps promedio y envías hasta ${o.send}. ${o.dataPct > 100 ? `Perderías ${Math.round((1 - o.delivered) * 100)}% de los datos.` : 'Todo llega a Tierra.'}`});

  // 7. Confiabilidad y construcción
  filas.push({k:'Confiabilidad y construcción', st: o.rel < 75 || o.months > M.deadline * 1.2 ? 'bad' : (o.rel < 90 || o.months > M.deadline) ? 'warn' : 'ok',
    msg: `Confiabilidad ${o.rel}% (meta: 90% o más). Construcción ${o.months} de ${M.deadline} meses.`});

  // 8. Presupuesto
  filas.push({k:'Presupuesto', st: nivel(o.costPct), msg: `$${fmt(o.cost)} de $${fmt(M.budget)} millones de dólares (cohete: $${fmt(o.costCohete)} M).`});
  return filas;
}

export const puedeLanzar = o => o.rows.every(r => r.st !== 'bad');
