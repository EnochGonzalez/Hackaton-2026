/* ============================================================
   NÚCLEO · Puntuación (1000 pts) y reporte causa-efecto (sin DOM)
   Ciencia 400 · Recursos 200 · Presupuesto 150 · Decisiones 150 · Equilibrio 100
   ============================================================ */
import {EV} from '../datos/eventos.js';
import {t, tx} from '../idioma/idioma.js';

export const nota = total => total >= 900 ? 'S' : total >= 800 ? 'A' : total >= 650 ? 'B' : total >= 500 ? 'C' : 'D';

export function puntuar(o, ops) {
  const uso = p => p > 100 ? 0 : p >= 40 ? 1 : p / 40;          // premia usar el recurso sin pasarse
  const sci = Math.round(400 * Math.min(1, ops.sci / o.M.sciTarget));
  const res = Math.round(200 * (uso(o.massPct) + uso(o.enPct) + uso(o.dataPct || 50)) / 3);
  const gasto = (o.cost + ops.spent) / o.M.budget * 100;
  const pre = Math.round(150 * (gasto > 100 ? 0 : gasto > 80 ? (100 - gasto) / 20 * .6 + .4 : 1));
  const dec = Math.round(150 * (ops.qs.length ? ops.qs.reduce((a, b) => a + b, 0) / ops.qs.length : .6) * (.6 + .4 * ops.hp / 100));
  const avisos = o.rows.filter(r => r.st === 'warn').length;
  const eq = Math.max(0, Math.round(Math.min(100, o.rel) - 12 * avisos));
  const total = sci + res + pre + dec + eq;

  /* Cada causa se guarda como {k: texto en español, v: variables}; se traduce al mostrarla */
  const why = [], causa = (k, v) => why.push({k, v});
  if (o.delivered < 1) causa(tx('Perdiste {p}% de los datos: generabas {g} Mbps y la antena solo enviaba {e}.'), {p: Math.round((1 - o.delivered) * 100), g: o.dg.toFixed(1), e: o.send});
  if (ops.sci < o.M.sciTarget * .8) causa(tx('La ciencia acumulada quedó en {s} de {m} puntos esperados: con sensores más capaces habría subido, a cambio de masa, energía y costo.'), {s: Math.round(ops.sci), m: o.M.sciTarget});
  if (o.massPct > 85) causa(tx('El margen de masa fue bajo ({p}% de la capacidad del cohete).'), {p: Math.round(o.massPct)});
  if (o.massPct < 40) causa(tx('El cohete iba casi vacío ({p}% de su capacidad): uno más pequeño habría costado menos.'), {p: Math.round(o.massPct)});
  if (o.enPct > 85) causa(tx('El margen de energía fue bajo ({p}% de los watts).'), {p: Math.round(o.enPct)});
  if (gasto > 100) causa(tx('Te pasaste del presupuesto, y eso costó puntos.'));
  ops.log.forEach(l => why.push({log: l}));
  if (!why.length) causa(tx('El diseño tuvo buenos márgenes y las decisiones no costaron nada.'));
  return {total, grade: nota(total), why, parts: partes([sci, res, pre, dec, eq])};
}

/* Las 5 partes de la nota: [nombre, puntos, máximo]. El nombre se traduce al mostrarlo. */
const partes = v => [[tx('Ciencia'), v[0], 400], [tx('Recursos'), v[1], 200], [tx('Presupuesto'), v[2], 150], [tx('Decisiones'), v[3], 150], [tx('Equilibrio del diseño'), v[4], 100]];

/* Texto de una entrada de la bitácora. Acepta el formato viejo ({t, c} con la frase ya escrita). */
export function textoBitacora(l) {
  if (l.c) return {t: l.t, c: l.c};
  const e = EV[l.ev], x = e.o[l.op];
  return {t: e.t, c: t('Elegiste "{n}".', {n: x.n}) + ' ' + (l.mal ? x.risk.msg : x.d)};
}

/* Texto de una causa del reporte, en el idioma actual (acepta frases viejas ya escritas) */
export function textoCausa(w) {
  if (typeof w === 'string') return w;
  if (w.log) { const b = textoBitacora(w.log); return t('Mes {m}, {t}: {c}', {m: w.log.m, t: b.t, c: b.c}); }
  return t(w.k, w.v);
}

export function reporteFalla() {
  return {total: 0, grade: 'D', fail: true,
    why: [{k: tx('El cohete falló en el lanzamiento. Un buen diseño también puede fallar: en la vida real, los lanzamientos tienen riesgo. Sube la confiabilidad con pruebas en Tierra o elige una Fase 1 más confiable, y reintenta.')}],
    parts: partes([0, 0, 0, 0, 0])};
}
