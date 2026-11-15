/* ============================================================
   scoring.js — puntuación (sobre 1000), calificación y el
   análisis post-misión que explica POR QUÉ pasó lo que pasó.
   ============================================================ */
var MC = globalThis.MC = globalThis.MC || {};

MC.score = {
  MAX: { science: 400, resources: 200, budget: 150, decisions: 150, team: 100 },

  grade: function (t) { return t >= 900 ? 'S' : t >= 800 ? 'A' : t >= 650 ? 'B' : t >= 500 ? 'C' : 'D'; },

  clamp: function (x, a, b) { return Math.max(a, Math.min(b, x)); },

  realMission: function (design, scenario) {
    var R = MC.data.realMissions, has = function (id) { return design.instruments.indexOf(id) >= 0; };
    if (scenario.id === 'earth') return has('radar') ? R.radar : has('ir_cam') ? R.ir_cam : R.earthAny;
    return has('xray') ? R.xray : has('optical') ? R.optical : has('uv') ? R.uv : R.teleAny;
  },

  /* Misión perdida en el lanzamiento */
  compute_launchFail: function (ctx) {
    var m = ctx.m, why = [];
    why.push({ tag: 'Lanzamiento', text: 'El lanzador falló. Tenía ' + Math.round(m.launchRisk * 100) + '% de riesgo de fallar' +
      (m.massMargin >= 0 && m.massMargin < 0.10 ? ' (parte de ese riesgo vino de ir muy justo de masa).' : '.') +
      ' Incluso un buen diseño puede perderse: por eso los equipos reales dejan margen.' });
    return {
      launchFailed: true, total: 0, grade: 'D',
      parts: [], insights: why, decisions: [],
      real: this.realMission(ctx.design, ctx.scenario), months: []
    };
  },

  compute: function (ops, goalsOk) {
    var m = ops.m, M = this.MAX, c = this.clamp, parts = [], insights = [];
    var months = MC.data.months;

    // 1) Ciencia
    var sciPct = c(ops.sciTotal / (m.sciMonthTarget * months), 0, 1);
    parts.push({ id: 'science', label: 'Valor científico', pts: Math.round(sciPct * M.science), max: M.science,
      note: 'Lograste ' + Math.round(sciPct * 100) + '% de la ciencia objetivo.' });

    // 2) Recursos: datos entregados, energía usada y diseño no sobredimensionado
    var delFrac = ops.genTotal > 0 ? ops.delTotal / ops.genTotal : 0;
    var powerAvg = ops.activeMonths > 0 ? ops.powerSum / ops.activeMonths : 0;
    var over = function (r) { return c(1 - Math.max(0, r - 0.5) / 0.5, 0, 1); };       // penaliza exceso de margen
    var util = (over(m.massMargin) + over(m.powerRatio - 1)) / 2;
    var resPct = 0.5 * delFrac + 0.3 * powerAvg + 0.2 * util;
    parts.push({ id: 'resources', label: 'Uso eficiente de recursos', pts: Math.round(resPct * M.resources), max: M.resources,
      note: Math.round(delFrac * 100) + '% de los datos llegó a la Tierra · energía al ' + Math.round(powerAvg * 100) + '%.' });

    // 3) Presupuesto
    var res = ops.reserve, budgetPts;
    if (res < 0) budgetPts = M.budget * c(1 + res / (0.2 * m.budget), 0, 1) * 0.66;
    else budgetPts = M.budget * (0.66 + 0.34 * c(res / (0.15 * m.budget), 0, 1));
    parts.push({ id: 'budget', label: 'Presupuesto', pts: Math.round(budgetPts), max: M.budget,
      note: res < 0 ? 'Terminaste en números rojos (' + res.toFixed(1) + ' M$).' : 'Terminaste con ' + res.toFixed(1) + ' M$ de reserva.' });

    // 4) Decisiones en eventos
    var dec = ops.decisions, qAvg = dec.length ? dec.reduce(function (s, d) { return s + d.q; }, 0) / dec.length : 0.8;
    parts.push({ id: 'decisions', label: 'Decisiones ante imprevistos', pts: Math.round(qAvg * M.decisions), max: M.decisions,
      note: dec.length ? 'Tomaste ' + dec.length + ' decisiones; la calidad media fue ' + Math.round(qAvg * 100) + '%.' : 'No hubo imprevistos esta vez.' });

    // 5) Equilibrio del diseño (4 criterios de buena ingeniería)
    var LBL = { economy: 'costo y riesgo bajo control', margins: 'margen de masa y de energía', science: 'potencial científico alto', data: 'todos los datos llegan a la Tierra' };
    var okKeys = Object.keys(goalsOk).filter(function (k) { return goalsOk[k]; });
    var missing = Object.keys(goalsOk).filter(function (k) { return !goalsOk[k]; }).map(function (k) { return LBL[k]; });
    parts.push({ id: 'balance', label: 'Equilibrio del diseño', pts: Math.round(okKeys.length / 4 * M.team), max: M.team,
      note: okKeys.length + ' de 4 criterios' + (missing.length ? '. Faltó: ' + missing.join(', ') + '.' : '.') });

    var total = parts.reduce(function (s, p) { return s + p.pts; }, 0);

    // Bono ahorrador
    var bonus = 0;
    if (m.cost <= 0.6 * m.budget && sciPct >= 0.7) { bonus = 30; }
    total = Math.min(1000, total + bonus);

    // ---- Por qué pasó lo que pasó (causa → efecto) ----
    if (ops.ended && ops.ended.why === 'health') insights.push({ tag: 'Salud', text: 'La nave dejó de funcionar en el mes ' + ops.ended.month + ' porque su salud llegó a 0. La radiación de la órbita y los eventos mal resueltos la fueron desgastando.' });
    if (ops.ended && ops.ended.why === 'life') insights.push({ tag: 'Vida útil', text: 'La nave se quedó sin vida útil en el mes ' + ops.ended.month + ': con esta estructura, combustible y órbita solo duraba ' + m.life + ' meses.' });
    if (powerAvg < 0.97 && ops.activeMonths) insights.push({ tag: 'Energía', text: 'Faltó energía: los instrumentos trabajaron al ' + Math.round(powerAvg * 100) + '% porque consumían ' + Math.round(m.powerReq) + ' W y solo había ' + Math.round(m.powerAvail) + ' W. Más paneles/batería o menos instrumentos lo habrían resuelto.' });
    if (delFrac < 0.97 && ops.genTotal > 0) insights.push({ tag: 'Datos', text: 'Perdiste ' + Math.round((1 - delFrac) * 100) + '% de los datos: tus instrumentos generaban ' + m.dataGen.toFixed(1) + ' GB/día pero tu enlace solo permitía ' + m.dataSend.toFixed(1) + ' GB/día.' });
    if (m.sciPotential < 0.7 * m.sciMonthTarget) insights.push({ tag: 'Ciencia', text: 'Tu potencial científico fue bajo: con estos instrumentos solo podías llegar a ' + Math.round(m.sciPotential / m.sciMonthTarget * 100) + '% del objetivo mensual.' });
    if (res < 0) insights.push({ tag: 'Presupuesto', text: 'Los imprevistos se comieron la reserva porque tu diseño ya usaba ' + Math.round(m.costRatio * 100) + '% del presupuesto.' });
    if (m.massMargin >= 0 && m.massMargin > 0.6) insights.push({ tag: 'Lanzador', text: 'Usaste un lanzador demasiado grande (sobraba ' + Math.round(m.massMargin * 100) + '% de capacidad): pagaste por masa que no usaste.' });
    if (dec.some(function (d) { return d.q <= 0.3; })) insights.push({ tag: 'Decisiones', text: 'Algunas decisiones fueron apuestas arriesgadas. Aunque salgan bien, la puntuación considera la calidad de la decisión, no solo la suerte.' });
    if (bonus) insights.push({ tag: 'Bono', text: 'Bono ahorrador: lograste mucha ciencia gastando menos del 60% del presupuesto.' });
    if (!insights.length) insights.push({ tag: 'Balance', text: 'Tu diseño estuvo muy equilibrado: energía, datos, presupuesto y riesgo bajo control.' });

    return {
      launchFailed: false, total: total, grade: this.grade(total), bonus: bonus,
      parts: parts, insights: insights, decisions: dec, months: ops.months,
      real: this.realMission(ops.design, ops.scenario)
    };
  }
};
