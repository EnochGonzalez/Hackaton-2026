/* ============================================================
   NÚCLEO · Puntuación (1000 pts) y reporte causa-efecto (sin DOM)
   Ciencia 400 · Recursos 200 · Presupuesto 150 · Decisiones 150 · Equilibrio 100
   ============================================================ */
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

  const why = [];
  if (o.delivered < 1) why.push(`Perdiste ${Math.round((1 - o.delivered) * 100)}% de los datos: generabas ${o.dg.toFixed(1)} Mbps y la antena solo enviaba ${o.send}.`);
  if (ops.sci < o.M.sciTarget * .8) why.push(`La ciencia acumulada quedó en ${Math.round(ops.sci)} de ${o.M.sciTarget} puntos esperados: con sensores más capaces habría subido, a cambio de masa, energía y costo.`);
  if (o.massPct > 85) why.push(`El margen de masa fue bajo (${Math.round(o.massPct)}% de la capacidad del cohete).`);
  if (o.massPct < 40) why.push(`El cohete iba casi vacío (${Math.round(o.massPct)}% de su capacidad): uno más pequeño habría costado menos.`);
  if (o.enPct > 85) why.push(`El margen de energía fue bajo (${Math.round(o.enPct)}% de los watts).`);
  if (gasto > 100) why.push('Te pasaste del presupuesto, y eso costó puntos.');
  ops.log.forEach(l => why.push(`Mes ${l.m}, ${l.t}: ${l.c}`));
  if (!why.length) why.push('El diseño tuvo buenos márgenes y las decisiones no costaron nada.');
  return {total, grade: nota(total), why,
    parts: [['Ciencia', sci, 400], ['Recursos', res, 200], ['Presupuesto', pre, 150], ['Decisiones', dec, 150], ['Equilibrio del diseño', eq, 100]]};
}

export function reporteFalla() {
  return {total: 0, grade: 'D', fail: true,
    why: ['El cohete falló en el lanzamiento. Un buen diseño también puede fallar: en la vida real, los lanzamientos tienen riesgo. Sube la confiabilidad con pruebas en Tierra o elige una Fase 1 más confiable, y reintenta.'],
    parts: [['Ciencia', 0, 400], ['Recursos', 0, 200], ['Presupuesto', 0, 150], ['Decisiones', 0, 150], ['Equilibrio del diseño', 0, 100]]};
}
