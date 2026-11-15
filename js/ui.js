/* ============================================================
   ui.js — todas las pantallas y la interacción (v2).
   Una sola función render() dibuja la pantalla actual según S.screen.
   Los botones usan data-action="nombre" y se atienden en el objeto A.
   Principio de diseño: mostrar poca información por pantalla.
   ============================================================ */
var MC = globalThis.MC = globalThis.MC || {};

MC.ui = (function () {
  var S = MC.S, D = MC.data;

  /* ---------- utilidades ---------- */
  function f(n, d) { return Number(n).toFixed(d === undefined ? 0 : d); }
  function esc(s) { return String(s).replace(/"/g, '&quot;'); }
  function tip(key, label) {
    var g = D.glossary[key];
    return '<span class="tip" tabindex="0" data-tip="' + esc(g[1]) + '">' + (label || g[0]) + '</span>';
  }
  function sc() { return D.scenarios[S.scenarioId]; }
  function df() { return D.difficulties[S.difficulty]; }
  function metrics() { return MC.sim.metrics(S.design, sc(), df()); }
  function go(screen) { S.screen = screen; S._top = true; }
  function who() { return S.player && S.player.trim() ? S.player.trim() : 'Anónimo'; }
  function mname() { return S.missionName && S.missionName.trim() ? S.missionName.trim() : 'Misión sin nombre'; }

  /* ---------- íconos SVG (sin emojis) ---------- */
  var ICON = {
    logo: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3.6"/><ellipse cx="12" cy="12" rx="10.5" ry="4.4" transform="rotate(-28 12 12)" opacity=".7"/></svg>',
    earth: '<svg class="scen-ic" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="24" cy="24" r="13"/><ellipse cx="24" cy="24" rx="13" ry="5"/><path d="M24 11v26M11 24h26"/><ellipse cx="24" cy="24" rx="21" ry="7.5" transform="rotate(-28 24 24)" opacity=".55"/></svg>',
    telescope: '<svg class="scen-ic" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 29 28 13l5 7L12 36z"/><path d="M28 13l3-3 6 8-3 3"/><path d="M19 32l-5 11M22 31l6 12M26 29"/><circle cx="40" cy="8" r="1" fill="currentColor"/><circle cx="12" cy="9" r="1" fill="currentColor"/></svg>',
    eye: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/></svg>',
    rocket: '<svg viewBox="0 0 24 50" width="34"><path d="M12 1C18 10 18 26 16.5 36h-9C6 26 6 10 12 1z" fill="#e4eaf6"/><circle cx="12" cy="17" r="2.6" fill="#0a1630"/><path d="M7.5 28 2 40l5.5-3zM16.5 28 22 40l-5.5-3z" fill="#8793ae"/><path d="M9.5 36h5L12 49z" fill="#f2b84b"/></svg>'
  };


  /* íconos del glosario (trazos SVG de 24×24) */
  var GICON = {
    masa: '<path d="M6 9h12l2 11H4z"/><circle cx="12" cy="6" r="2.5"/>',
    potencia: '<path d="M13 2 5 14h6l-1 8 8-12h-6z"/>',
    datos: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    presupuesto: '<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-2.8.8-2.8 2s1.1 1.7 2.8 2 2.8.8 2.8 2-1.1 2-2.8 2c-1.4 0-2.5-.6-3-1.6"/>',
    ciencia: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9"/>',
    vida: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    eclipse: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6" fill="currentColor" fill-opacity=".35"/>',
    enlace: '<circle cx="12" cy="12" r="1.6" fill="currentColor"/><path d="M8 16a6 6 0 0 1 0-8M16 8a6 6 0 0 1 0 8M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14"/>',
    leo: '<circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/><circle cx="20" cy="12" r="1.4" fill="currentColor"/>',
    polar: '<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="3.5" ry="10" stroke-dasharray="2 3"/><circle cx="12" cy="2" r="1.4" fill="currentColor"/>',
    geo: '<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r="10" stroke-dasharray="2 3"/><circle cx="22" cy="12" r="1.4" fill="currentColor"/>',
    margen: '<path d="M4 17a8 8 0 0 1 16 0"/><path d="M12 17l4-6"/><circle cx="12" cy="17" r="1.2" fill="currentColor"/>',
    riesgo: '<path d="M12 3 2 20h20z"/><path d="M12 10v5M12 17.5v.5"/>'
  };
  function gicon(k) { return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + GICON[k] + '</svg>'; }

  /* ---------- encabezado ---------- */
  var STEPS = [['briefing', '1 Misión'], ['design', '2 Diseño'], ['review', '3 Revisión'],
               ['launch', '4 Lanzamiento'], ['ops', '5 Operación'], ['report', '6 Reporte']];
  function header() {
    var idx = STEPS.map(function (s) { return s[0]; }).indexOf(S.screen);
    var steps = S.screen === 'menu' ? '<div class="steps"></div>' :
      '<div class="steps">' + STEPS.map(function (s, i) {
        return '<span class="step ' + (i === idx ? 'on' : i < idx ? 'done' : '') + '">' + s[1] + '</span>';
      }).join('') + '</div>';
    return '<header class="top"><div class="top-in"><span class="logo" data-action="menu">' + ICON.logo + 'Mission Control</span>' + steps +
      '<button class="link-btn" data-action="glossary">Glosario</button><button class="link-btn" data-action="tutorial">Cómo jugar</button></div></header>';
  }

  /* ---------- barra de recursos (compacta; fija arriba en la pantalla de diseño) ---------- */
  function resBar(m, sticky) {
    var sr = m.sciPotential / m.sciMonthTarget;
    var items = [
      { k: 'masa', label: 'Masa', txt: f(m.mass) + ' / ' + (m.cap || '—') + ' kg', r: m.cap > 0 ? m.mass / m.cap : 2, w: m.cap > 0 ? m.mass / m.cap : 1 },
      { k: 'potencia', label: 'Energía', txt: f(m.powerReq) + ' / ' + f(m.powerAvail) + ' W', r: m.powerAvail > 0 ? m.powerReq / m.powerAvail : 2, w: m.powerReq / m.powerAvail },
      { k: 'datos', label: 'Datos', txt: m.dataGen.toFixed(1) + ' / ' + m.dataSend.toFixed(1) + ' GB', r: m.dataSend > 0 ? m.dataGen / m.dataSend : (m.dataGen > 0 ? 2 : 0), w: m.dataSend > 0 ? m.dataGen / m.dataSend : 0 },
      { k: 'presupuesto', label: 'Presupuesto', txt: f(m.cost) + ' / ' + m.budget + ' M$', r: m.costRatio, w: m.costRatio, g: 0.92 },
      { k: 'ciencia', label: 'Ciencia', txt: f(m.sciPotential) + ' / ' + m.sciMonthTarget, up: true, r: sr, w: sr }
    ];
    return '<div class="res-bar' + (sticky ? ' sticky' : '') + '">' + items.map(function (it) {
      var l = it.up ? (it.r >= 0.7 ? 'green' : it.r >= 0.35 ? 'yellow' : 'red')
                    : (it.g ? (it.r <= it.g ? 'green' : it.r <= 1 ? 'yellow' : 'red') : (it.r <= 0.9 ? 'green' : it.r <= 1 ? 'yellow' : 'red'));
      var w = Math.max(2, Math.min(100, it.w * 100));
      return '<div class="res"><div class="res-h"><span>' + tip(it.k, it.label) + '</span><b>' + it.txt + '</b></div>' +
        '<div class="bar"><i class="lv-' + l + '" style="width:' + w + '%"></i></div></div>';
    }).join('') + '</div>';
  }

  /* ---------- esquema de la nave (cambia con cada elección) ---------- */
  function shipSvg(d) {
    var sw = { small: 34, medium: 58, large: 90 }[d.solar];
    var dish = { basic: 9, medium: 15, high: 25 }[d.antenna];
    var tank = { small: 5, medium: 8, large: 11 }[d.fuel];
    var cells = { small: 1, medium: 2, large: 3 }[d.battery];
    var robust = d.structure === 'robust';
    var s = '<svg viewBox="0 0 320 210" width="100%" role="img" aria-label="Esquema de tu nave">';
    s += '<rect width="320" height="210" rx="8" fill="#141c33"/>';
    // paneles con cuadrícula
    [[130 - sw, sw], [190, sw]].forEach(function (p) {
      s += '<rect x="' + p[0] + '" y="86" width="' + p[1] + '" height="34" fill="#16335f" stroke="#5cc8ff" stroke-width="1"/>';
      for (var x = p[0] + 11; x < p[0] + p[1]; x += 11) s += '<line x1="' + x + '" y1="86" x2="' + x + '" y2="120" stroke="#2b5a92" stroke-width=".8"/>';
      s += '<line x1="' + p[0] + '" y1="103" x2="' + (p[0] + p[1]) + '" y2="103" stroke="#2b5a92" stroke-width=".8"/>';
    });
    s += '<line x1="' + (130 - sw) + '" y1="103" x2="130" y2="103" stroke="#5cc8ff" stroke-width="1.4"/><line x1="190" y1="103" x2="' + (190 + sw) + '" y2="103" stroke="#5cc8ff" stroke-width="1.4"/>';
    // cuerpo
    s += '<rect x="130" y="64" width="60" height="78" fill="#1a2438" stroke="#9fb0d6" stroke-width="' + (robust ? 2.6 : 1.2) + '"/>';
    if (robust) s += '<path d="M130 80h60M130 126h60" stroke="#9fb0d6" stroke-width="1"/>';
    // antena
    s += '<line x1="160" y1="64" x2="160" y2="46" stroke="#9fb0d6" stroke-width="1.6"/>';
    s += '<ellipse cx="160" cy="43" rx="' + dish + '" ry="' + (dish * 0.4) + '" fill="#f2b84b" opacity=".9"/>';
    if (d.antenna === 'high') s += '<path d="M150 43l10 -10 10 10" fill="none" stroke="#f2b84b" stroke-width="1"/>';
    // tanque de combustible
    s += '<circle cx="146" cy="124" r="' + tank + '" fill="none" stroke="#ef8f4f" stroke-width="1.6"/>';
    // baterías
    for (var c = 0; c < cells; c++) s += '<rect x="' + (166 + c * 7) + '" y="112" width="5" height="16" fill="#52d38a" opacity=".85"/>';
    // instrumentos
    var shapes = d.instruments.map(function (id) {
      if (id === 'radar') return { w: 42, h: 6, c: '#a78bfa' };
      if (id === 'optical' || id === 'xray' || id === 'uv') return { w: 12, h: 26, c: '#c4b5fd' };
      return { w: 14, h: 12, c: '#8b7be0' };
    });
    var total = shapes.reduce(function (t, x) { return t + x.w + 8; }, -8), x0 = 160 - total / 2;
    if (shapes.length) s += '<line x1="160" y1="142" x2="160" y2="150" stroke="#9fb0d6" stroke-width="1"/>';
    shapes.forEach(function (sp) { s += '<rect x="' + x0 + '" y="150" width="' + sp.w + '" height="' + sp.h + '" fill="' + sp.c + '" opacity=".9"/>'; x0 += sp.w + 8; });
    s += '<text x="160" y="198" fill="#8793ae" font-size="13" text-anchor="middle">' + d.instruments.length + (d.instruments.length === 1 ? ' instrumento' : ' instrumentos') + '</text>';
    return s + '</svg>';
  }

  /* ---------- componentes ---------- */
  function optCard(o) {
    var cls = 'opt' + (o.sel ? ' sel' : '') + (o.lock ? ' locked' : '');
    var attrs = o.lock ? ' disabled' : ' data-action="' + o.action + '" data-arg="' + o.arg + '"';
    return '<button class="' + cls + '"' + attrs + '><div class="t"><span>' + o.title + '</span>' + (o.val ? '<span class="val">' + o.val + '</span>' : '') + '</div>' +
      (o.desc ? '<div class="d">' + o.desc + '</div>' : '') + (o.spec ? '<div class="spec">' + o.spec + '</div>' : '') +
      (o.lock ? '<div class="lockmsg">' + o.lock + '</div>' : '') + '</button>';
  }
  /* fila de opciones compacta: items = [{id,name,key}] */
  function segRow(label, items, selId, action, prefix, note) {
    return '<div class="seg-row"><div class="seg-label">' + label + '</div><div class="seg-opts">' + items.map(function (it) {
      return '<button class="segbtn' + (String(it.id) === String(selId) ? ' sel' : '') + '" data-action="' + action + '" data-arg="' + prefix + it.id + '"><span class="n">' + it.name + '</span><span class="k">' + it.key + '</span></button>';
    }).join('') + '</div><div class="seg-note">' + (note || '') + '</div></div>';
  }
  function b(x) { return '<b>' + x + '</b>'; }

  /* =======================================================
     PANTALLAS
     ======================================================= */

  /* ---------- 0. Menú (mínimo) ---------- */
  function menu() {
    var saves = MC.store.saves();
    var hist = MC.store.history().slice().sort(function (a, b) { return b.score - a.score; }).slice(0, 8);
    var h = '<section class="intro"><div class="kicker acc">Simulador de misiones espaciales</div><h1>Mission Control</h1>' +
      '<p class="lead">Diseña una nave, lánzala y opera tu misión durante 12 meses. Cada decisión tiene un costo.</p>' +
      '<label class="field"><span>Tu nombre</span><input class="txt" id="playerName" maxlength="20" placeholder="Comandante" value="' + esc(S.player || '') + '" autocomplete="off"></label>' +
      '<div class="field"><span>Dificultad</span><div class="seg-opts">' + Object.keys(D.difficulties).map(function (k) {
        var d = D.difficulties[k];
        return '<button class="segbtn' + (S.difficulty === k ? ' sel' : '') + '" data-action="diff" data-arg="' + k + '"><span class="n">' + d.name + '</span><span class="k">' + d.cml + '</span></button>';
      }).join('') + '</div><div class="seg-note">' + df().desc + '</div></div>' +
      '<div class="row"><button class="btn" data-action="toBriefing">Comenzar</button><button class="btn sec" data-action="tutorial">Cómo se juega</button></div></section>';

    if (hist.length) {
      h += '<section class="panel"><div class="kicker">Marcador en este navegador</div><table><thead><tr><th>#</th><th>Misión</th><th>Comandante</th><th>Objetivo</th><th>Dificultad</th><th class="r">Nota</th><th class="r">Puntos</th></tr></thead><tbody>' +
        hist.map(function (x, i) {
          return '<tr class="' + ((x.player || '') === (S.player || '') && S.player ? 'me' : '') + '"><td>' + (i + 1) + '</td><td>' + (x.mission || '—') + '</td><td>' + (x.player || 'Anónimo') + '</td><td>' + x.scenario + '</td><td>' + x.difficulty + '</td><td class="r">' + x.grade + '</td><td class="r mono">' + x.score + '</td></tr>';
        }).join('') + '</tbody></table></section>';
    }
    if (saves.length) {
      h += '<details style="margin-top:12px"><summary>Diseños guardados (' + saves.length + ')</summary><div class="in">' + saves.map(function (s, i) {
        return '<div class="row spread" style="padding:6px 0;border-bottom:1px solid var(--line)"><span>' + (s.mission || s.name) + ' <span class="mut small">· ' + s.name + ' · ' + s.date + '</span></span>' +
          '<span class="row"><button class="btn sec" data-action="loadSave" data-arg="' + i + '">Cargar</button><button class="btn sec" data-action="delSave" data-arg="' + i + '">Borrar</button></span></div>';
      }).join('') + '</div></details>';
    }
    return h;
  }

  /* ---------- 1. Briefing ---------- */
  function briefing() {
    var h = '<div class="kicker acc">Paso 1</div><h2>Elige el objetivo de tu misión</h2><div class="grid g2" style="margin-top:14px">';
    Object.keys(D.scenarios).forEach(function (k) {
      var s = D.scenarios[k];
      h += '<div class="panel">' + ICON[k === 'earth' ? 'earth' : 'telescope'] + '<h2>' + s.name + '</h2><p class="mut">' + s.tagline + '</p>' +
        '<div class="spec">Presupuesto ' + b(Math.round(s.budget * df().budgetMult) + ' M$') + ' · Duración ' + b('12 meses') + '</div>' +
        '<div class="mt"><button class="btn" data-action="pick" data-arg="' + k + '">Elegir</button></div></div>';
    });
    return h + '</div><div class="mt"><button class="btn sec" data-action="menu">Volver</button></div>';
  }

  /* ---------- 2. Diseño (guiado, un paso a la vez) ---------- */
  var TABS = [['launch', 'Lanzamiento'], ['ship', 'Nave'], ['payload', 'Instrumentos'], ['ground', 'Tierra y equipo']];
  var ASK = {
    launch: 'Elige la órbita y el cohete que te llevará hasta allí.',
    ship: 'Ajusta los sistemas de la nave. Cada pieza pesa, cuesta y afecta la energía, los datos o la vida útil.',
    payload: 'Escoge los instrumentos que harán la ciencia. Cada uno pesa, consume energía y genera datos que hay que enviar.',
    ground: 'Define cuántas estaciones reciben tus datos y qué equipo los analiza.'
  };
  var WHY = {
    launch: 'La órbita decide cuánto tiempo hablas con la Tierra, cuánta sombra hay y cuánta radiación sufre la nave. El cohete decide cuánta masa puedes subir y cuánto dinero te queda.',
    ship: 'Los paneles y la batería dan la energía; la antena decide cuántos datos llegan a casa; el combustible y la estructura alargan la vida de la nave.',
    payload: 'Los instrumentos son lo que da ciencia, pero cada uno suma masa, consumo de energía, datos y costo. Más no siempre es mejor.',
    ground: 'Más estaciones significan más minutos de contacto (más datos recibidos) y un respaldo si una falla. El equipo científico define cuánto valor sacas de los datos.'
  };

  function launchTab() {
    var h = '<div class="seg-label">Órbita</div><div class="grid g3">';
    Object.keys(D.orbits).forEach(function (k) {
      var o = D.orbits[k], fit = sc().orbitFit[k];
      h += optCard({ sel: S.design.orbit === k, action: 'orbit', arg: k, title: o.name, desc: o.desc,
        spec: b(o.contact) + ' min de contacto/día · ' + b(Math.round(o.eclipse * 100) + '%') + ' en sombra' +
          (fit !== 1 ? ' · ciencia <b class="' + (fit > 1 ? 'good' : 'bad') + '">×' + fit + '</b>' : '') });
    });
    h += '</div><p class="small mut" style="margin:8px 0 18px">' + sc().orbitNote + '</p><div class="seg-label">Cohete</div><div class="grid g3">';
    Object.keys(D.launchers).forEach(function (k) {
      var l = D.launchers[k], cap = l.capacity[S.design.orbit];
      h += optCard({ sel: S.design.launcher === k, action: 'launcher', arg: k, title: l.name, desc: l.desc,
        spec: b(l.cost) + ' M$ · ' + b(f(l.risk * df().riskMult * 100) + '%') + ' de fallar · ' + (cap > 0 ? 'carga hasta ' + b(cap) + ' kg' : '<span class="bad">no llega a esta órbita</span>') });
    });
    return h + '</div>';
  }

  function partRow(label, cat, keyFn) {
    var parts = D.parts[cat], sel = parts[S.design[cat]];
    var items = Object.keys(parts).map(function (k) { return { id: k, name: parts[k].short, key: keyFn(parts[k]) }; });
    return segRow(label, items, S.design[cat], 'part', cat + '|',
      b(sel.mass + ' kg') + ' · ' + b(sel.cost + ' M$') + ' — ' + sel.desc);
  }
  function shipTab() {
    return partRow('Paneles solares', 'solar', function (p) { return p.watts + ' W'; }) +
      partRow('Batería', 'battery', function (p) { return Math.round(p.cover * 100) + '% sombra'; }) +
      partRow('Antena', 'antenna', function (p) { return p.rate + ' GB/min'; }) +
      partRow('Combustible', 'fuel', function (p) { return '+' + p.months + ' meses'; }) +
      partRow('Estructura', 'structure', function (p) { return 'vida ' + p.life + ' m'; }) +
      '<p class="small mut" style="margin-top:14px">Incluye siempre un sistema base: ' + D.base.mass + ' kg, ' + D.base.power + ' W, ' + D.base.cost + ' M$.</p>';
  }

  function payloadTab() {
    var h = '<div class="legend"><b>Ciencia</b> son los puntos que cada instrumento te da cada mes. Es lo que más cuenta en tu puntuación, pero solo se ganan si el instrumento tiene energía y sus datos llegan a la Tierra.<br>' +
      '<span class="mut">kg = lo que pesa · W = energía que gasta · M$ = lo que cuesta · GB/día = datos que genera.</span></div><div class="grid g2">';
    Object.keys(D.instruments).forEach(function (k) {
      var i = D.instruments[k], on = S.design.instruments.indexOf(k) >= 0, lock = MC.sim.instrumentLock(i, sc());
      h += optCard({ sel: on, action: 'inst', arg: k, title: i.name, val: lock ? '' : '+' + i.value + ' ciencia/mes', desc: i.purpose,
        spec: b(i.mass) + ' kg · ' + b(i.power) + ' W · ' + b(i.cost) + ' M$ · ' + b(i.data) + ' GB/día',
        lock: lock ? 'No disponible: no sirve para este objetivo.' : '' });
    });
    return h + '</div>';
  }

  function groundTab() {
    var an = D.parts.antenna[S.design.antenna], o = D.orbits[S.design.orbit];
    var st = Object.keys(D.stations).map(function (k) {
      var s = D.stations[k]; return { id: k, name: k + (k === '1' ? ' estación' : ' estaciones'), key: s.cost + ' M$' };
    });
    var tm = Object.keys(D.teams).map(function (k) { var t = D.teams[k]; return { id: k, name: t.short, key: '×' + t.mult }; });
    var gb = an.rate * o.contact * o.linkFactor * S.design.stations;
    return segRow('Estaciones terrestres', st, S.design.stations, 'stations', '',
      'Con tu antena y órbita podrías enviar unos ' + b(gb.toFixed(1) + ' GB/día') + '.') +
      segRow('Equipo científico', tm, S.design.team, 'team', '', b(D.teams[S.design.team].cost + ' M$') + ' — ' + D.teams[S.design.team].desc) +
      '<p class="small mut" style="margin-top:14px">Operar la misión cuesta ' + (D.opsMonthlyBase + D.opsMonthlyPerStation * S.design.stations).toFixed(1) + ' M$ al mes (ya incluido en el costo).</p>';
  }

  function design() {
    var m = metrics(), idx = TABS.map(function (t) { return t[0]; }).indexOf(S.tab);
    var h = '<div class="kicker acc">Paso 2 · ' + sc().name + ' · ' + df().name + '</div>' +
      '<div class="row spread" style="align-items:flex-end"><div class="namebox"><label for="missionName">Nombre de tu misión <span>(puedes cambiarlo)</span></label>' +
      '<div class="namefield"><input id="missionName" maxlength="28" value="' + esc(S.missionName) + '" placeholder="Escribe un nombre" autocomplete="off">' + ICON.pencil + '</div></div>' +
      '<button class="link-btn" data-action="glossary">¿Qué significa cada barra?</button></div>' + resBar(m, true);
    h += '<div class="tabs">' + TABS.map(function (t, i) {
      return '<button class="tab ' + (S.tab === t[0] ? 'on' : '') + '" data-action="tab" data-arg="' + t[0] + '"><span class="num">' + (i + 1) + '</span>' + t[1] + '</button>';
    }).join('') + '</div>';
    var body = S.tab === 'launch' ? launchTab() : S.tab === 'ship' ? shipTab() : S.tab === 'payload' ? payloadTab() : groundTab();
    var lifeCls = m.life >= D.months ? 'good' : m.life >= sc().minLife ? 'amber' : 'bad';
    var riskCls = m.launchRisk < 0.06 ? 'good' : m.launchRisk < 0.12 ? 'amber' : 'bad';
    h += '<div class="layout"><div><p class="lead-q">' + ASK[S.tab] + '</p><div style="margin-top:14px">' + body + '</div></div>' +
      '<aside class="side"><div class="panel">' + shipSvg(S.design) +
      '<div class="stat-line mt"><span class="mut">' + tip('vida', 'Vida útil') + '</span><b class="' + lifeCls + '">' + m.life + ' meses</b></div>' +
      '<div class="stat-line"><span class="mut">' + tip('riesgo', 'Riesgo de lanzamiento') + '</span><b class="' + riskCls + '">' + f(m.launchRisk * 100) + '%</b></div></div>' +
      '<details><summary>¿Por qué importa?</summary><div class="in">' + WHY[S.tab] + '</div></details></aside></div>';
    h += '<div class="row spread mt">' + (idx > 0 ? '<button class="btn sec" data-action="tab" data-arg="' + TABS[idx - 1][0] + '">Atrás</button>' : '<button class="btn sec" data-action="toBriefing">Cambiar objetivo</button>') +
      (idx < TABS.length - 1 ? '<button class="btn" data-action="tab" data-arg="' + TABS[idx + 1][0] + '">Siguiente: ' + TABS[idx + 1][1] + '</button>' : '<button class="btn" data-action="toReview">Revisar diseño</button>') + '</div>';
    return h;
  }

  /* ---------- 3. Revisión ---------- */
  function review() {
    var m = metrics(), checks = MC.sim.checks(m, S.design, sc());
    var reds = checks.filter(function (c) { return c.level === 'red'; }), yellows = checks.filter(function (c) { return c.level === 'yellow'; });
    var h = '<div class="kicker acc">Paso 3</div><h2>Revisión de diseño</h2><p class="mut">Así revisan los ingenieros un diseño antes de construirlo. Un punto rojo impide el lanzamiento.</p>';
    if (S._flash) { h += '<p class="green small">' + S._flash + '</p>'; S._flash = null; }
    h += resBar(m) + '<div class="layout"><div class="panel">' + checks.map(function (c) {
      return '<div class="check"><span class="light ' + c.level + '"></span><div style="flex:1"><div class="head"><b>' + c.label + '</b><span class="val">' + c.value + '</span></div>' +
        '<div>' + c.why + '</div>' + (c.tip && c.level !== 'green' ? '<div class="tipline">' + c.tip + '</div>' : '') + '</div></div>';
    }).join('') + '</div><aside class="side"><div class="panel">' + shipSvg(S.design) + '</div><details><summary>Desglose de costos</summary><div class="in">' +
      Object.keys(m.costParts).map(function (k) { return '<div class="stat-line"><span class="mut">' + k + '</span><b>' + f(m.costParts[k], 1) + ' M$</b></div>'; }).join('') +
      '<div class="stat-line"><span>Total</span><b>' + f(m.cost, 1) + ' / ' + m.budget + ' M$</b></div></div></details></aside></div>';
    h += '<div class="row spread mt"><div class="row"><button class="btn sec" data-action="toDesign">Volver a diseñar</button><button class="btn sec" data-action="save">Guardar diseño</button></div>' +
      '<div class="row">' + (reds.length ? '<span class="red small">Resuelve ' + reds.length + ' problema(s) para poder lanzar</span>' : yellows.length ? '<span class="amber small">Puedes lanzar, pero con riesgos</span>' : '<span class="green small">Todo en orden</span>') +
      '<button class="btn go" data-action="toLaunch"' + (reds.length ? ' disabled' : '') + '>Ir al lanzamiento</button></div></div>';
    return h;
  }

  /* ---------- 4. Lanzamiento ---------- */
  function launchScreen() {
    var m = metrics(), L = S.launch;
    var h = '<div class="kicker acc">Paso 4</div><h2>' + mname() + '</h2>';
    h += '<div class="pad"><div class="ground"></div><div class="rocket ' + (L ? (L.ok ? 'go' : 'boom') : '') + '" id="rocket">' + ICON.rocket + '</div><div class="count" id="count">' +
      (L ? (L.ok ? 'EN ÓRBITA' : 'FALLO') : '') + '</div></div>';
    if (!L) {
      h += '<div class="panel mt"><p>Riesgo de que este lanzamiento falle: <b class="' + (m.launchRisk < 0.06 ? 'green' : m.launchRisk < 0.12 ? 'amber' : 'red') + '">' + f(m.launchRisk * 100) + '%</b>. ' +
        'Incluso un buen diseño puede perderse: por eso la ingeniería real deja margen.</p>' +
        '<div class="row"><button class="btn sec" data-action="toReview">Revisar de nuevo</button><button class="btn go" id="cdbtn" data-action="countdown">Iniciar cuenta regresiva</button></div></div>';
    } else if (L.ok) {
      h += '<div class="panel mt"><h3 class="green">Lanzamiento exitoso</h3><p>Tu nave llegó a órbita. Ahora hay que operarla durante ' + D.months + ' meses.</p>' +
        '<button class="btn go" data-action="startOps">Comenzar operaciones</button></div>';
    } else {
      h += '<div class="panel mt"><h3 class="red">El cohete falló</h3><p>Había ' + f(L.risk * 100) + '% de probabilidad de fallar y ocurrió. Veamos qué se puede aprender.</p>' +
        '<button class="btn" data-action="failReport">Ver análisis</button></div>';
    }
    return h;
  }

  /* ---------- 5. Operaciones ---------- */
  function opsScreen() {
    var o = S.ops, m = o.m, rec = o.months[o.months.length - 1];
    var h = '<div class="row spread"><div><div class="kicker acc">Paso 5 · Mes ' + o.month + ' de ' + D.months + '</div><h2>' + mname() + '</h2></div></div>';
    h += '<div class="ops"><div class="grid"><div class="panel"><canvas id="orbit" width="320" height="250"></canvas>' +
      '<div class="small mut" style="margin-top:6px">' + D.orbits[S.design.orbit].name + ' · ' + S.design.stations + (S.design.stations === 1 ? ' estación' : ' estaciones') + '</div></div>';
    var hl = o.health >= 60 ? 'green' : o.health >= 30 ? 'yellow' : 'red';
    var rl = o.reserve >= 0 ? (o.reserve > 5 ? 'green' : 'yellow') : 'red';
    var delPct = o.genTotal > 0 ? o.delTotal / o.genTotal : 1;
    h += '<div class="panel"><div class="res-h"><span>Salud de la nave</span><b>' + f(o.health) + '%</b></div><div class="bar"><i class="lv-' + hl + '" style="width:' + Math.max(2, o.health) + '%"></i></div><div class="cap">Si llega a 0, la misión termina.</div>' +
      '<div class="res-h" style="margin-top:16px"><span>Dinero de reserva</span><b>' + f(o.reserve, 1) + ' M$</b></div><div class="bar"><i class="lv-' + rl + '" style="width:' + Math.max(2, Math.min(100, o.reserve / Math.max(1, m.budget) * 400)) + '%"></i></div><div class="cap">Sirve para imprevistos.</div>' +
      '<div class="res-h" style="margin-top:16px"><span>Datos que llegaron</span><b>' + f(delPct * 100) + '%</b></div><div class="bar"><i class="lv-' + (delPct > 0.9 ? 'green' : delPct > 0.7 ? 'yellow' : 'red') + '" style="width:' + Math.max(2, delPct * 100) + '%"></i></div>' +
      '<div class="res-h" style="margin-top:16px"><span>Ciencia acumulada</span><b>' + f(o.sciTotal) + ' puntos</b></div>' +
      '<div class="timeline">' + (function () {
        var max = Math.max(1, m.sciPotential), t = '';
        for (var i = 0; i < D.months; i++) {
          var r = o.months[i], hh = r ? Math.max(4, r.sci / max * 100) : 4, ev = o.decisions.some(function (d) { return d.month === i + 1; });
          t += '<div class="' + (r && r.dead ? 'dead' : '') + (ev ? ' ev' : '') + '" style="height:' + hh + '%;opacity:' + (r ? 1 : 0.18) + '" title="Mes ' + (i + 1) + '"></div>';
        }
        return t;
      })() + '</div><div class="small mut">Cada barra es la ciencia de un mes. La marca ámbar indica que hubo un imprevisto.</div></div></div>';

    h += '<div class="grid">' + (o.phase === 'event' ? eventCard(o) : summaryCard(o, rec));
    if (o.log.length) h += '<details><summary>Historial de decisiones (' + o.log.length + ')</summary><div class="in log">' + o.log.slice().reverse().map(function (l) { return '<div>' + l + '</div>'; }).join('') + '</div></details>';
    return h + '</div></div>';
  }

  function eventCard(o) {
    var ev = o.event, h = '<div class="event"><div class="kicker amber">Imprevisto · Mes ' + o.month + '</div><h2>' + ev.title + '</h2><p>' + ev.text + '</p>' +
      (o.ctx.showTip ? '<div class="tipbox"><b>Pista:</b> ' + ev.tip + '</div><button class="hint-btn" data-action="toggleTip">' + ICON.eye + 'Ocultar pista</button>'
                     : '<button class="hint-btn" data-action="toggleTip">' + ICON.eye + 'Ver pista</button>');
    h += ev.options.map(function (op, i) {
      var lock = MC.sim.optionAvailable(o, op);
      return '<button class="eopt" data-action="choose" data-arg="' + i + '"' + (lock ? ' disabled' : '') + '>' + op.label +
        '<span class="hint">' + op.hint + '</span>' + (lock ? '<span class="why-lock">No disponible: ' + lock.charAt(0).toLowerCase() + lock.slice(1) + '</span>' : '') + '</button>';
    }).join('');
    return h + '</div>';
  }

  function summaryCard(o, rec) {
    var ctx = o.ctx, h = '<div class="panel"><div class="kicker">Resumen del mes ' + rec.month + '</div>';
    if (ctx.chosen) {
      h += '<h3>' + o.event.title + '</h3><div class="small mut">Elegiste: ' + ctx.chosen.label + '</div><div class="outcome">' + ctx.outcome.text +
        '<div>' + MC.fxChips(ctx.outcome.fx).map(function (c) { return '<span class="pill ' + (c.bad ? 'bad' : 'good') + '">' + c.t + '</span>'; }).join('') + '</div></div>';
    } else if (!rec.dead) {
      h += '<p class="mut">Un mes tranquilo, sin imprevistos.</p>';
    }
    rec.notes.forEach(function (n) { h += '<p class="small amber">' + n + '</p>'; });
    h += '<div>' + pill('Ciencia ganada este mes: +' + f(rec.sci, 1), rec.sci > 0) + pill('Datos que llegaron a la Tierra: ' + f(rec.deliver * 100) + '%', rec.deliver > 0.9) +
      pill('Energía disponible: ' + f(rec.powerFactor * 100) + '%', rec.powerFactor > 0.97) + '<span class="pill">Salud de la nave: ' + f(rec.health) + '%</span>' +
      (rec.lostGB > 1 ? pill('Datos perdidos: ' + f(rec.lostGB) + ' GB', false) : '') + '</div>';
    if (o.ended && o.month < D.months) h += '<p class="red small mt">La misión terminó antes de tiempo.</p><div class="mt"><button class="btn" data-action="toReport">Ver reporte final</button></div>';
    else if (o.finished) h += '<div class="mt"><button class="btn go" data-action="toReport">Ver reporte final</button></div>';
    else h += '<div class="mt"><button class="btn" data-action="nextMonth">Siguiente mes</button></div>';
    return h + '</div>';
  }
  function pill(t, good) { return '<span class="pill ' + (good ? 'good' : 'bad') + '">' + t + '</span>'; }

  /* ---------- 6. Reporte ---------- */
  function reportScreen() {
    var r = S.result;
    var h = '<div class="kicker acc">Paso 6 · Reporte</div><h2>' + mname() + '</h2><p class="mut">Comandante ' + who() + ' · ' + sc().name + ' · ' + df().name + '</p>';
    h += '<div class="grid g2"><div class="panel"><div class="row" style="gap:22px"><div class="grade ' + r.grade + '">' + r.grade + '</div><div><div class="mono" style="font-size:2rem">' + r.total + '<span class="mut small"> / 1000</span></div>' +
      (r.launchFailed ? '<div class="red small">Misión perdida en el lanzamiento</div>' : '') + '</div></div>';
    r.parts.forEach(function (p) {
      var pct = p.pts / p.max, l = pct > 0.75 ? 'green' : pct > 0.45 ? 'yellow' : 'red';
      h += '<div class="pt-row"><div class="res-h"><span>' + p.label + '</span><b>' + p.pts + ' / ' + p.max + '</b></div><div class="bar"><i class="lv-' + l + '" style="width:' + Math.max(2, pct * 100) + '%"></i></div><div class="small mut" style="margin-top:3px">' + p.note + '</div></div>';
    });
    if (r.bonus) h += '<span class="pill good">Bono ahorrador +' + r.bonus + '</span>';
    h += '</div><div class="panel"><div class="kicker">Qué pasó y por qué</div>' + r.insights.map(function (i) {
      return '<div class="insight"><span class="tag">' + i.tag + '</span><span>' + i.text + '</span></div>';
    }).join('') + '</div></div>';

    if (r.months && r.months.length) {
      var max = Math.max.apply(null, r.months.map(function (x) { return x.sci; }).concat([1]));
      h += '<div class="panel mt"><div class="kicker">Ciencia por mes</div><div class="timeline">' + r.months.map(function (x) {
        var ev = r.decisions.some(function (d) { return d.month === x.month; });
        return '<div class="' + (x.dead ? 'dead' : '') + (ev ? ' ev' : '') + '" style="height:' + Math.max(4, x.sci / max * 100) + '%" title="Mes ' + x.month + ': ' + f(x.sci, 1) + ' pts"></div>';
      }).join('') + '</div><div class="small mut">Marca ámbar: mes con una decisión.</div></div>';
    }
    if (r.decisions && r.decisions.length) {
      h += '<details style="margin-top:12px"><summary>Tus decisiones y lo que enseñan (' + r.decisions.length + ')</summary><div class="in">' + r.decisions.map(function (d) {
        return '<div class="insight"><span class="tag">Mes ' + d.month + '</span><span><b>' + d.eventTitle + '.</b> Elegiste: ' + d.option + '. <i>' + d.text + '</i><br><span class="mut small">' + d.lesson + '</span></span></div>';
      }).join('') + '</div></details>';
    }
    h += '<p class="mut small mt">Tu misión se parece a ' + r.real + '</p>';
    if (S._prevBest != null) h += '<p class="small mut">Tu mejor puntuación anterior en este objetivo: <b>' + S._prevBest + '</b></p>';
    h += '<div class="row mt"><button class="btn" data-action="retryNew">Mismo diseño, nueva suerte</button><button class="btn sec" data-action="retrySame">Misma semilla</button>' +
      '<button class="btn sec" data-action="toDesign">Rediseñar</button><button class="btn sec" data-action="menu">Menú</button></div>';
    return h;
  }

  /* ---------- Modales ---------- */
  function modal() {
    if (S.modal === 'glossary') {
      var G = D.glossaryGroups, g = G[S.glossTab] || G.recursos;
      return '<div class="modal-bg" data-action="closeModal"><div class="modal"><h2>Glosario</h2><div class="seg-opts">' +
        Object.keys(G).map(function (k) { return '<button class="segbtn' + (S.glossTab === k ? ' sel' : '') + '" data-action="glossTab" data-arg="' + k + '"><span class="n">' + G[k].name + '</span></button>'; }).join('') +
        '</div><p class="mut" style="margin:12px 0 4px">' + g.intro + '</p>' +
        g.keys.map(function (k) { return '<div class="gitem"><span class="gic">' + gicon(k) + '</span><div><b>' + D.glossary[k][0] + '</b><div class="mut">' + D.glossary[k][1] + '</div></div></div>'; }).join('') +
        '<button class="btn mt" data-action="closeModal">Cerrar</button></div></div>';
    }
    return '<div class="modal-bg" data-action="closeModal"><div class="modal"><div class="kicker acc">Guía rápida</div><h2>Cómo se juega</h2><ol>' +
      '<li>Elige el objetivo de tu misión.</li>' +
      '<li>Diseña tu nave en 4 pasos. Ya hay opciones marcadas: cambia lo que quieras y mira cómo se mueven las barras. También puedes ponerle nombre a tu misión.</li>' +
      '<li>Revisa el semáforo y lanza.</li>' +
      '<li>Opera 12 meses y decide ante los imprevistos. Al final, el reporte explica qué pasó y por qué.</li></ol>' +
      '<p class="small mut">No existe un diseño perfecto: hay muchas combinaciones que funcionan.</p>' +
      '<button class="btn mt" data-action="closeModal">Entendido</button></div></div>';
  }

  /* =======================================================
     RENDER
     ======================================================= */
  function render() {
    if (MC.orbit) MC.orbit.stop();
    var y = window.scrollY;
    var screens = { menu: menu, briefing: briefing, design: design, review: review, launch: launchScreen, ops: opsScreen, report: reportScreen };
    var body = (screens[S.screen] || menu)();
    document.getElementById('app').innerHTML = header() + '<main class="wrap">' + body + '</main>' + (S.modal ? modal() : '');
    if (S.screen === 'ops') MC.orbit.start(document.getElementById('orbit'), S.design.orbit, S.design.stations);
    window.scrollTo(0, S._top ? 0 : y);
    S._top = false;
  }

  /* =======================================================
     ACCIONES
     ======================================================= */
  function newSeed() { return (Date.now() + Math.floor(Math.random() * 99999)) & 0xffffff; }
  function randomName() { var n = D.missionNames; return 'Misión ' + n[Math.floor(Math.random() * n.length)]; }

  var A = {
    menu: function () { go('menu'); render(); },
    diff: function (v) { S.difficulty = v; render(); },
    toBriefing: function () { go('briefing'); render(); },
    pick: function (id) {
      S.seed = newSeed(); S.scenarioId = id; S.design = MC.defaultDesign(); S.missionName = randomName();
      S.tab = 'launch'; S.launch = null; S.ops = null; S.result = null; go('design'); render();
    },
    tab: function (v) { S.tab = v; S._top = true; render(); },
    orbit: function (v) { S.design.orbit = v; render(); },
    launcher: function (v) { S.design.launcher = v; render(); },
    part: function (v) { var p = v.split('|'); S.design[p[0]] = p[1]; render(); },
    stations: function (v) { S.design.stations = +v; render(); },
    team: function (v) { S.design.team = v; render(); },
    inst: function (v) {
      var l = S.design.instruments, i = l.indexOf(v);
      if (i >= 0) l.splice(i, 1); else l.push(v);
      render();
    },
    toDesign: function () { S.launch = null; go('design'); render(); },
    toReview: function () { S.launch = null; go('review'); render(); },
    save: function () {
      MC.store.addSave({ mission: mname(), name: sc().name + ' · ' + df().name, date: new Date().toLocaleDateString('es-MX'), scenarioId: S.scenarioId, difficulty: S.difficulty, design: JSON.parse(JSON.stringify(S.design)) });
      S._flash = 'Diseño guardado. Lo encontrarás en el menú principal.'; render();
    },
    loadSave: function (i) {
      var s = MC.store.saves()[+i]; if (!s) return;
      S.scenarioId = s.scenarioId; S.difficulty = s.difficulty; S.design = JSON.parse(JSON.stringify(s.design)); S.missionName = s.mission || randomName();
      S.seed = newSeed(); S.tab = 'launch'; go('design'); render();
    },
    delSave: function (i) { MC.store.removeSave(+i); render(); },
    toLaunch: function () { S.rng = MC.makeRng(S.seed); S.launch = null; go('launch'); render(); },
    countdown: function () {
      var btn = document.getElementById('cdbtn'); if (btn) btn.disabled = true;
      var el = document.getElementById('count'), rocket = document.getElementById('rocket'), n = 3;
      el.textContent = n;
      var m = metrics();
      var t = setInterval(function () {
        n--;
        if (n > 0) { el.textContent = n; return; }
        clearInterval(t);
        var res = MC.sim.launch(m, S.rng);
        el.textContent = 'DESPEGUE';
        rocket.className = 'rocket go';
        setTimeout(function () {
          if (!res.ok) { rocket.className = 'rocket boom'; el.textContent = 'FALLO'; }
          setTimeout(function () { S.launch = res; render(); }, res.ok ? 400 : 900);
        }, res.ok ? 2600 : 1200);
      }, 800);
    },
    startOps: function () {
      S.ops = MC.sim.startOps({ m: metrics(), design: S.design, scenario: sc(), diff: df(), rng: S.rng });
      A._begin(); go('ops'); render();
    },
    _begin: function () { var ev = MC.sim.beginMonth(S.ops); if (!ev) MC.sim.finishMonth(S.ops); },
    nextMonth: function () { A._begin(); render(); },
    toggleTip: function () { S.ops.ctx.showTip = !S.ops.ctx.showTip; render(); },
    choose: function (i) { MC.sim.choose(S.ops, +i); MC.sim.finishMonth(S.ops); render(); },
    toReport: function () {
      var o = S.ops;
      while (!o.finished) { MC.sim.beginMonth(o); MC.sim.finishMonth(o); }   // si la misión terminó antes, se completan los meses
      S.result = MC.score.compute(o, MC.sim.goals(o.m));
      A._record(); go('report'); render();
    },
    failReport: function () {
      S.result = MC.score.compute_launchFail({ m: metrics(), design: S.design, scenario: sc() });
      A._record(); go('report'); render();
    },
    _record: function () {
      var h = MC.store.history().filter(function (x) { return x.scenarioId === S.scenarioId; });
      S._prevBest = h.length ? Math.max.apply(null, h.map(function (x) { return x.score; })) : null;
      MC.store.addHistory({ scenarioId: S.scenarioId, scenario: sc().name, difficulty: df().name, mission: mname(), player: S.player || '', score: S.result.total, grade: S.result.grade, date: new Date().toLocaleDateString('es-MX') });
    },
    retryNew: function () { S.seed = newSeed(); A.toLaunch(); },
    retrySame: function () { A.toLaunch(); },
    glossary: function () { S.modal = 'glossary'; S.glossTab = 'recursos'; render(); },
    glossTab: function (v) { S.glossTab = v; render(); },
    tutorial: function () { S.modal = 'tutorial'; render(); },
    closeModal: function () { S.modal = null; MC.store.markTutorial(); render(); }
  };

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-action]') : null;
      if (!t || t.disabled) return;
      if (t.classList.contains('modal-bg') && e.target !== t) return;   // clic dentro del cuadro: no cerrar
      var a = t.getAttribute('data-action');
      if (A[a]) A[a](t.getAttribute('data-arg'), t);
    });
    /* los nombres se guardan al escribir, sin volver a dibujar la pantalla */
    document.addEventListener('input', function (e) {
      var t = e.target;
      if (t.id === 'playerName') { S.player = t.value; MC.store.setPlayer(t.value); }
      else if (t.id === 'missionName') { S.missionName = t.value; }
    });
    S.seed = newSeed();
    if (!MC.store.seenTutorial()) S.modal = 'tutorial';
    render();
  }

  return { init: init, render: render, A: A };
})();
