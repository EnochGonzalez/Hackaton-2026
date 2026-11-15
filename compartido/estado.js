/* ============================================================
   ESTADO GUARDADO (localStorage). Todas las páginas leen y escriben aquí.
     missionControl.partida     misión en curso: {id, dif, sel, paso, sub, lanz, ops, rep, lb}
     missionControl.pendiente   misión aceptada pero aún no iniciada: {id, dif}
     missionControl.dificultad  última dificultad elegida
     missionControl.comandante  nombre del jugador
     missionControl.tabla       tabla de clasificación local
     missionControl.marcador    mejor resultado por misión
     missionControl.guia        avance de la guía del entrenamiento
   ============================================================ */
import {mision} from '../datos/misiones.js';
import {aplicarDificultad} from '../datos/dificultades.js';
import {nuevaSeleccion} from '../nucleo/calc.js';

const P = 'missionControl.';
const leer = (k, def) => { try { const v = localStorage.getItem(P + k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } };
const escribir = (k, v) => { try { v == null ? localStorage.removeItem(P + k) : localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) {} };

/* --- Partida --- */
export const cargarPartida = () => leer('partida', null);
export const guardarPartida = p => escribir('partida', p);
export const nuevaPartida = (id, dif) => ({id, dif, sel: nuevaSeleccion(), paso: 0, sub: 0, lanz: null, ops: null, rep: null, lb: null});
export const misionDe = p => p ? aplicarDificultad(mision(p.id), p.dif) : null;
/* Vuelve al taller conservando el diseño (para rediseñar o reintentar) */
export const reiniciarVuelo = p => { p.lanz = null; p.ops = null; p.rep = null; p.lb = null; return p; };
export function hayProgreso(p) {
  if (!p) return false;
  const s = p.sel;
  return !!(s.chasis || s.energia || s.adcs || s.comms || s.prop || s.f1 || s.instr.length || s.termico.length || s.tests !== 'none' || p.lanz || p.ops || p.rep);
}
export const esLaMisma = (p, id, dif) => !!p && p.id === id && p.dif === dif;
/* Los entrenamientos guiados no cuentan como progreso que se pierda */
export const esTutorial = p => !!p && !!(mision(p.id) || {}).tuto;

/* --- Guía de los entrenamientos: {id, vistos: [pasos informativos ya leídos], off} --- */
export const cargarGuia = () => leer('guia', null);
export const guardarGuia = g => escribir('guia', g);

/* --- Misión pendiente y dificultad --- */
export const cargarPendiente = () => leer('pendiente', null);
export const guardarPendiente = v => escribir('pendiente', v);
export const cargarDificultad = () => leer('dificultad', 'ing');
export const guardarDificultad = d => escribir('dificultad', d);

/* --- Comandante --- */
export const cargarComandante = () => leer('comandante', '');
export const guardarComandante = n => escribir('comandante', n);

/* --- Tabla de clasificación y mejores marcas --- */
export const cargarTabla = () => leer('tabla', []);
export function agregarATabla(fila) { const t = cargarTabla(); t.push(fila); escribir('tabla', t); }
export const cargarMarcador = () => leer('marcador', {});
export function guardarMejor(id, rep) {
  const b = cargarMarcador();
  if (!b[id] || b[id].total < rep.total) { b[id] = {total: rep.total, grade: rep.grade}; escribir('marcador', b); }
}
