/* Dificultades: multiplican los límites del contrato y el riesgo */
import {traducirMapa} from '../idioma/idioma.js';
import {EN_DATOS} from '../idioma/en-datos.js';

export const DIF = {
  cad:{n:'Novato',   txt:'Presupuesto y plazo holgados, menos imprevistos. Para aprender cómo se conectan las piezas.',budget:1.3,dead:1.25,risk:.7, lch:1.03,sci:.85},
  ing:{n:'Conocedor',txt:'El contrato tal como lo pide la agencia.',budget:1,dead:1,risk:1,lch:1,sci:1},
  dir:{n:'Experto',  txt:'Presupuesto y plazo ajustados, más riesgo en lanzamiento y en eventos, y metas de ciencia más altas. Hay que usar cada recurso con precisión.',budget:.8,dead:.85,risk:1.3,lch:.96,sci:1.15},
};
traducirMapa(DIF, EN_DATOS.dif);   // inglés: nombre y texto de cada dificultad
export const ORDEN_DIF = {dir:3, ing:2, cad:1};

export function aplicarDificultad(M, dif) {
  const D = DIF[dif] || DIF.ing;
  return {...M,
    budget: Math.round(M.budget * D.budget),
    deadline: Math.round(M.deadline * D.dead),
    sciTarget: Math.round(M.sciTarget * D.sci),
    risk: D.risk, lch: D.lch, dif};
}
