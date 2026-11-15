/* ============================================================
   state.js — estado global, generador aleatorio con semilla y
   almacenamiento local (guardar diseños y marcadores).
   ============================================================ */
var MC = globalThis.MC = globalThis.MC || {};

/* Generador pseudoaleatorio con semilla (mulberry32): misma semilla = misma "suerte" */
MC.makeRng = function (seed) {
  var a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

MC.defaultDesign = function () {
  return {
    launcher: 'light', orbit: 'leo',
    structure: 'light', solar: 'medium', battery: 'medium', antenna: 'medium', fuel: 'medium',
    instruments: [], stations: 1, team: 'medium'
  };
};

/* ---------- Almacenamiento (si el navegador no lo permite, no pasa nada) ---------- */
MC.store = {
  _get: function (k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } },
  _set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignorar */ } },
  saves: function () { return this._get('mc_saves'); },
  addSave: function (entry) { var l = this.saves(); l.unshift(entry); this._set('mc_saves', l.slice(0, 8)); },
  removeSave: function (i) { var l = this.saves(); l.splice(i, 1); this._set('mc_saves', l); },
  history: function () { return this._get('mc_history'); },
  addHistory: function (entry) { var l = this.history(); l.push(entry); this._set('mc_history', l.slice(-50)); },
  getPlayer: function () { try { return localStorage.getItem('mc_player') || ''; } catch (e) { return ''; } },
  setPlayer: function (n) { try { localStorage.setItem('mc_player', n); } catch (e) { /* ignorar */ } },
  seenTutorial: function () { try { return localStorage.getItem('mc_tutorial') === '1'; } catch (e) { return false; } },
  markTutorial: function () { try { localStorage.setItem('mc_tutorial', '1'); } catch (e) { /* ignorar */ } }
};

MC.newState = function () {
  return {
    screen: 'menu',
    player: MC.store.getPlayer(),
    missionName: '',
    difficulty: 'cadet',
    scenarioId: 'earth',
    design: MC.defaultDesign(),
    tab: 'launch',
    seed: 1,
    rng: null,
    launch: null,          // resultado del lanzamiento
    ops: null,
    result: null,
    glossTab: 'recursos',
    modal: null            // 'tutorial' | 'glossary' | null
  };
};
MC.S = MC.newState();

