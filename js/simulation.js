/* ============================================================
   simulation.js — el "cerebro" del juego (sin nada de interfaz).
   1) metrics()   calcula masa, energía, datos, costo, vida y riesgo
   2) checks()    semáforo de revisión (estilo Laboratorio de Diseño NASA)
   3) goals()     objetivos personales de cada rol
   4) launch()    sorteo del lanzamiento
   5) startOps / beginMonth / choose / finishMonth   operación mensual
   ============================================================ */
var MC = globalThis.MC = globalThis.MC || {};

MC.sim = {

  /* ---------- 1) Métricas del diseño ---------- */
  metrics: function (design, scenario, diff) {
    var D = MC.data;
    var L = D.launchers[design.launcher], O = D.orbits[design.orbit];
    var st = D.parts.structure[design.structure], so = D.parts.solar[design.solar],
        ba = D.parts.battery[design.battery], an = D.parts.antenna[design.antenna],
        fu = D.parts.fuel[design.fuel], gs = D.stations[design.stations], tm = D.teams[design.team];
    var insts = design.instruments.map(function (id) { return D.instruments[id]; });
    var sum = function (arr, k) { return arr.reduce(function (s, x) { return s + x[k]; }, 0); };

    var mass = D.base.mass + st.mass + so.mass + ba.mass + an.mass + fu.mass + sum(insts, 'mass');
    var cap = L.capacity[O.id];

    var powerReq = D.base.power + an.power + sum(insts, 'power');
    var powerAvail = so.watts * ((1 - O.eclipse) + O.eclipse * ba.cover);

    var dataGen = sum(insts, 'data');
    var dataSend = an.rate * O.contact * O.linkFactor * gs.n;

    var opsMonthly = D.opsMonthlyBase + D.opsMonthlyPerStation * gs.n;
    var costParts = {
      'Lanzador': L.cost,
      'Nave y sus sistemas': D.base.cost + st.cost + so.cost + ba.cost + an.cost + fu.cost,
      'Instrumentos': sum(insts, 'cost'),
      'Estaciones terrestres': gs.n ? gs.cost : 0,
      'Equipo científico': tm.cost,
      'Operaciones (12 meses)': Math.round(opsMonthly * D.months * 10) / 10
    };
    var cost = 0; for (var k in costParts) cost += costParts[k];
    var budget = Math.round(scenario.budget * diff.budgetMult);

    var massMargin = cap > 0 ? (cap - mass) / cap : -1;
    var risk = L.risk * diff.riskMult;
    if (massMargin >= 0 && massMargin < 0.10) risk += 0.04 * diff.riskMult;
    risk = Math.min(0.6, risk);

    var orbitFit = (scenario.orbitFit && scenario.orbitFit[O.id]) || 1;
    var sciPotential = sum(insts, 'value') * tm.mult * orbitFit;

    return {
      mass: mass, cap: cap, massMargin: massMargin,
      powerReq: powerReq, powerAvail: powerAvail, powerRatio: powerReq > 0 ? powerAvail / powerReq : 99,
      dataGen: dataGen, dataSend: dataSend, dataRatio: dataGen > 0 ? dataSend / dataGen : 99,
      cost: cost, costParts: costParts, budget: budget, costRatio: cost / budget,
      life: st.life + fu.months - O.radPenalty,
      launchRisk: risk, sciPotential: sciPotential, orbitFit: orbitFit, sciMonthTarget: scenario.targetPerMonth,
      nInst: insts.length,
      usefulInst: insts.filter(function (i) { return i.goals.indexOf(scenario.id) >= 0; }).length
    };
  },

  /* ¿Este instrumento sirve para el escenario? */
  instrumentLock: function (inst, scenario) {
    if (inst.goals.indexOf(scenario.id) >= 0) return null;
    return 'No sirve para «' + scenario.objective.toLowerCase() + '». Está pensado para: ' + inst.purpose.toLowerCase();
  },

  /* ---------- 2) Semáforo de revisión ---------- */
  checks: function (m, design, scenario) {
    var pct = function (x) { return Math.round(x * 100) + '%'; };
    var list = [];
    var add = function (id, label, level, value, why, tip) {
      list.push({ id: id, label: label, level: level, value: value, why: why, tip: tip });
    };

    // Masa
    var lvlM = m.cap <= 0 ? 'red' : m.massMargin < 0 ? 'red' : m.massMargin < 0.10 ? 'yellow' : 'green';
    add('mass', 'Masa', lvlM,
      Math.round(m.mass) + ' kg de ' + m.cap + ' kg',
      m.cap <= 0 ? 'Este lanzador no llega a esa órbita.'
        : m.massMargin < 0 ? 'La nave pesa más de lo que el lanzador puede subir a esta órbita.'
        : m.massMargin < 0.10 ? 'Vas muy justo de masa (margen ' + pct(m.massMargin) + '): el lanzamiento será más arriesgado.'
        : 'Tienes margen de masa (' + pct(m.massMargin) + ').',
      m.cap <= 0 ? 'Prueba otro lanzador u otra órbita.' : m.massMargin < 0 ? 'Quita instrumentos o combustible, o usa un lanzador más potente.' : '');

    // Energía
    var lvlP = m.powerRatio >= 1.05 ? 'green' : m.powerRatio >= 0.8 ? 'yellow' : 'red';
    add('power', 'Energía', lvlP,
      Math.round(m.powerReq) + ' W necesarios / ' + Math.round(m.powerAvail) + ' W disponibles',
      lvlP === 'green' ? 'Hay energía de sobra para todos los instrumentos.'
        : lvlP === 'yellow' ? 'Falta algo de energía: los instrumentos trabajarán a ~' + pct(m.powerRatio) + ' de su capacidad.'
        : 'Falta mucha energía: los instrumentos casi no podrán trabajar.',
      lvlP === 'green' ? '' : 'Más paneles, mejor batería, o menos instrumentos que consuman tanto.');

    // Datos
    var lvlD = m.dataGen === 0 ? 'yellow' : m.dataRatio >= 1 ? 'green' : m.dataRatio >= 0.7 ? 'yellow' : 'red';
    add('data', 'Datos y comunicaciones', lvlD,
      m.dataGen.toFixed(1) + ' GB/día generados / ' + m.dataSend.toFixed(1) + ' GB/día enviables',
      m.dataGen === 0 ? 'Aún no generas datos (no hay instrumentos).'
        : m.dataRatio >= 1 ? 'Podrás mandar a la Tierra todo lo que generen.'
        : m.dataRatio >= 0.7 ? 'Perderás parte de los datos: la antena no alcanza (' + pct(m.dataRatio) + ').'
        : 'Perderás la mayoría de los datos: el enlace es muy pequeño para tus instrumentos.',
      m.dataRatio >= 1 ? '' : 'Mejor antena, más estaciones terrestres, otra órbita con más contacto, o instrumentos que generen menos.');

    // Ciencia por mes
    var sr = m.sciPotential / m.sciMonthTarget;
    add('science', 'Ciencia por mes', sr >= 0.7 ? 'green' : 'yellow',
      Math.round(m.sciPotential) + ' de ' + m.sciMonthTarget + ' puntos al mes',
      sr >= 0.7 ? 'Tus instrumentos pueden dar mucha ciencia (siempre que tengan energía y sus datos lleguen).'
        : m.nInst === 0 ? 'Aún no has elegido instrumentos.'
        : 'Con estos instrumentos y esta órbita ganarías pocos puntos de ciencia al mes.',
      sr >= 0.7 ? '' : 'Agrega instrumentos de más valor, un equipo científico mayor o una órbita que favorezca tu objetivo.');

    // Presupuesto
    var lvlB = m.costRatio <= 0.92 ? 'green' : m.costRatio <= 1 ? 'yellow' : 'red';
    add('budget', 'Presupuesto', lvlB,
      m.cost.toFixed(1) + ' M$ de ' + m.budget + ' M$',
      lvlB === 'green' ? 'Te queda reserva para imprevistos.'
        : lvlB === 'yellow' ? 'Casi no te queda reserva: un imprevisto te dejaría en números rojos.'
        : 'Te pasaste del presupuesto.',
      lvlB === 'green' ? '' : 'Un lanzador más barato, menos instrumentos o un equipo más pequeño.');

    // Riesgo
    var lvlR = m.launchRisk < 0.06 ? 'green' : m.launchRisk < 0.12 ? 'yellow' : 'red';
    add('risk', 'Riesgo de lanzamiento', lvlR,
      pct(m.launchRisk) + ' de fallar',
      lvlR === 'green' ? 'Riesgo bajo.' : lvlR === 'yellow' ? 'Riesgo medio. Puede salir mal.' : 'Riesgo alto: es probable perder la misión.',
      lvlR === 'green' ? '' : 'Un lanzador más fiable o más margen de masa reducen el riesgo.');

    // Requisitos de misión
    var reqProblems = [];
    if (m.usefulInst < scenario.minInstruments) reqProblems.push('necesitas al menos ' + scenario.minInstruments + ' instrumento útil para el objetivo');
    if (m.life < scenario.minLife) reqProblems.push('la vida útil (' + m.life + ' meses) es menor al mínimo de ' + scenario.minLife);
    var lvlQ = reqProblems.length ? 'red' : m.life < MC.data.months ? 'yellow' : 'green';
    add('req', 'Requisitos de misión', lvlQ,
      m.usefulInst + ' instrumentos útiles · vida ' + m.life + ' meses',
      reqProblems.length ? 'No cumples: ' + reqProblems.join('; ') + '.'
        : m.life < MC.data.months ? 'Cumples lo mínimo, pero la nave no durará los 12 meses: perderás ciencia al final.'
        : 'Cumples todos los requisitos.',
      reqProblems.length || m.life < MC.data.months ? 'Revisa instrumentos, estructura, combustible y órbita (la radiación acorta la vida).' : '');

    return list;
  },

  /* ---------- 3) Criterios de equilibrio del diseño (se usan en la puntuación) ---------- */
  goals: function (m) {
    return {
      economy: m.costRatio <= 0.92 && m.launchRisk <= 0.06,
      margins: m.massMargin >= 0.10 && m.powerRatio >= 1.05 && m.life >= MC.data.months,
      science: m.sciPotential >= 0.7 * m.sciMonthTarget,
      data:    m.dataGen > 0 && m.dataRatio >= 1
    };
  },

  /* ---------- 4) Lanzamiento ---------- */
  launch: function (m, rng) {
    var roll = rng();
    return { ok: roll >= m.launchRisk, risk: m.launchRisk, roll: roll };
  },

  /* ---------- 5) Operación mensual ---------- */
  startOps: function (ctx) {
    return {
      m: ctx.m, design: ctx.design, scenario: ctx.scenario, diff: ctx.diff, rng: ctx.rng,
      orbit: MC.data.orbits[ctx.design.orbit],
      month: 0, health: 100, reserve: ctx.m.budget - ctx.m.cost,
      modifiers: [], delayed: [], usedEvents: [],
      event: null, ctx: null, phase: 'idle',
      months: [], decisions: [], log: [],
      sciTotal: 0, genTotal: 0, delTotal: 0, powerSum: 0, activeMonths: 0,
      ended: null, finished: false
    };
  },

  applyEffects: function (ops, ctx, fx) {
    if (!fx) return;
    if (fx.health) ops.health = Math.min(100, ops.health + fx.health);
    if (fx.money) ops.reserve += fx.money;
    if (fx.sci) ctx.sci += fx.sci;
    if (fx.send) ctx.send = Math.max(0, ctx.send * (1 + fx.send));
    if (fx.modifier) ops.modifiers.push({ sci: fx.modifier.sci, months: fx.modifier.months, label: fx.modifier.label });
    if (fx.delayed) ops.delayed.push({ due: ops.month + fx.delayed.in, effects: fx.delayed.fx, text: fx.delayed.text });
  },

  /* Empieza un mes: aplica desgaste, consecuencias pendientes y sortea un evento */
  beginMonth: function (ops) {
    var self = this;
    ops.month++;
    var ctx = { sci: 0, send: 1, notes: [], outcome: null, chosen: null };
    ops.ctx = ctx;

    ops.health = Math.max(0, ops.health - ops.orbit.healthDecay);

    ops.delayed = ops.delayed.filter(function (d) {
      if (d.due <= ops.month) { self.applyEffects(ops, ctx, d.effects); ctx.notes.push(d.text); return false; }
      return true;
    });

    ops.event = null;
    if (!ops.ended && ops.month >= 2 && ops.rng() < ops.diff.eventChance) {
      var pool = MC.events.filter(function (e) { return ops.usedEvents.indexOf(e.id) < 0; });
      if (pool.length) {
        ops.event = pool[Math.floor(ops.rng() * pool.length)];
        ops.usedEvents.push(ops.event.id);
      }
    }
    ops.phase = ops.event ? 'event' : 'calm';
    return ops.event;
  },

  optionAvailable: function (ops, opt) {
    return opt.req ? opt.req(ops.design) : null;   // null = disponible; texto = motivo de bloqueo
  },

  /* El jugador (o el equipo) elige una opción del evento */
  choose: function (ops, index) {
    var ev = ops.event, opt = ev.options[index], ctx = ops.ctx;
    var r = ops.rng(), acc = 0, out = opt.outcomes[opt.outcomes.length - 1];
    for (var i = 0; i < opt.outcomes.length; i++) {
      acc += opt.outcomes[i].p;
      if (r < acc) { out = opt.outcomes[i]; break; }
    }
    this.applyEffects(ops, ctx, out.fx);
    ctx.outcome = out;
    ctx.chosen = opt;
    ops.decisions.push({ month: ops.month, eventId: ev.id, eventTitle: ev.title, option: opt.label,
                         q: opt.q, text: out.text, fx: out.fx, lesson: ev.lesson });
    ops.log.push('Mes ' + ops.month + ' · ' + ev.title + ': ' + opt.label + ' → ' + out.text);
    return out;
  },

  /* Cierra el mes: calcula ciencia, datos, desgaste */
  finishMonth: function (ops) {
    var m = ops.m, ctx = ops.ctx, rec;
    var D = MC.data;

    if (!ops.ended) {
      if (ops.health <= 0) ops.ended = { month: ops.month, why: 'health' };
      else if (ops.month > m.life) ops.ended = { month: ops.month, why: 'life' };
    }

    if (ops.ended) {
      rec = { month: ops.month, sci: 0, deliver: 0, powerFactor: 0, health: ops.health, genGB: 0, lostGB: 0, dead: true,
              notes: ctx.notes.concat([ops.ended.why === 'health' ? 'La nave quedó inutilizable.' : 'La nave llegó al final de su vida útil.']) };
    } else {
      var powerFactor = Math.min(1, m.powerRatio);
      var gen = m.dataGen * powerFactor;
      var send = m.dataSend * ctx.send;
      var deliver = gen > 0 ? Math.min(1, send / gen) : 0;
      var healthF = 0.4 + 0.6 * Math.max(0, ops.health) / 100;
      var modSum = ops.modifiers.reduce(function (s, x) { return s + x.sci; }, 0);
      var mult = Math.max(0, 1 + modSum + ctx.sci);
      var sci = m.sciPotential * powerFactor * deliver * healthF * mult;
      rec = { month: ops.month, sci: sci, deliver: deliver, powerFactor: powerFactor, health: ops.health,
              genGB: gen * 30, lostGB: gen * 30 * (1 - deliver), dead: false, notes: ctx.notes.slice() };
      ops.sciTotal += sci;
      ops.genTotal += gen;
      ops.delTotal += gen * deliver;
      ops.powerSum += powerFactor;
      ops.activeMonths++;
    }

    ops.modifiers.forEach(function (x) { x.months--; });
    ops.modifiers = ops.modifiers.filter(function (x) { return x.months > 0; });

    ops.months.push(rec);
    ops.phase = 'summary';
    if (ops.month >= D.months) ops.finished = true;
    return rec;
  }
};
