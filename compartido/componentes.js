/* ============================================================
   COMPONENTES HTML reutilizables (devuelven texto HTML)
   ============================================================ */
import {fmt, nivel} from '../nucleo/calc.js';
import {t} from '../idioma/idioma.js';

/* --- Íconos de línea (SVG 48x48). Para cambiar uno, edita su trazo. --- */
const IC = {
  chasis:'<rect x="12" y="10" width="24" height="30" rx="2"/><path d="M12 20h24M12 30h24"/>',
  energia:'<rect x="4" y="16" width="14" height="16"/><rect x="30" y="16" width="14" height="16"/><path d="M18 24h12M11 16v16M37 16v16"/>',
  instr:'<rect x="8" y="14" width="32" height="22" rx="3"/><circle cx="24" cy="25" r="7"/><path d="M16 14l3-5h10l3 5"/>',
  espejo:'<path d="M24 8l7 4v8l-7 4-7-4v-8zM17 20l-7 4v8l7 4 7-4v-8zM31 20l7 4v8l-7 4-7-4v-8z"/>',
  mono:'<circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="6"/>',
  sar:'<path d="M6 34L24 12l18 22zM24 12v-6M14 22l-8-4M34 22l8-4"/>',
  termico:'<path d="M8 14h32M8 22h32M8 30h32M12 38h24"/>',
  sun:'<path d="M6 38l12-24h12l12 24z"/><path d="M12 30h24M16 22h16"/>',
  adcs:'<circle cx="24" cy="24" r="14"/><path d="M24 10v28M10 24h28"/>',
  comms:'<path d="M8 36q16-6 24-24"/><path d="M8 36l8 4M24 22l10-8"/><circle cx="35" cy="13" r="3"/>',
  prop:'<path d="M18 8h12v14l8 18H10l8-18z"/><path d="M20 40l4 6 4-6"/>',
  orbita:'<circle cx="24" cy="24" r="7"/><ellipse cx="24" cy="24" rx="19" ry="9" transform="rotate(-25 24 24)"/>',
  f1:'<rect x="17" y="6" width="14" height="34" rx="2"/><path d="M17 30h14M19 40l-3 5h16l-3-5"/>',
  boosters:'<rect x="19" y="6" width="10" height="34" rx="2"/><path d="M12 16q3-6 6 0v24h-6zM30 16q3-6 6 0v24h-6z"/>',
  etapa:'<rect x="14" y="12" width="20" height="18" rx="2"/><path d="M20 30l-3 9h14l-3-9"/>',
  cofia:'<path d="M12 40V24Q12 8 24 4q12 4 12 20v16z"/><path d="M24 4v36"/>',
  tests:'<path d="M18 6h12M20 6v14L10 40h28L28 20V6"/><path d="M15 32h18"/>',
  cohete:'<path d="M24 4c6 6 8 14 8 22H16c0-8 2-16 8-22z"/><path d="M16 26l-6 10 8-3M32 26l6 10-8-3M21 34l3 10 3-10"/><circle cx="24" cy="16" r="3"/>',
  libro:'<path d="M10 6h24a4 4 0 0 1 4 4v32H14a4 4 0 0 1-4-4z"/><path d="M10 38a4 4 0 0 1 4-4h24M18 14h12M18 20h12"/>',
  copa:'<path d="M14 8h20v10a10 10 0 0 1-20 0zM14 12H7v3a7 7 0 0 0 7 7M34 12h7v3a7 7 0 0 1-7 7M24 28v8M16 40h16"/>',
  lupa:'<circle cx="21" cy="21" r="12"/><path d="M30 30l11 11M16 21h10M21 16v10"/>',
  ayuda:'<circle cx="24" cy="24" r="18"/><path d="M18 19a6 6 0 1 1 8 5.6c-1.4.7-2 1.6-2 3.4M24 34v1"/>',
};
export const ico = nombre => `<svg class="ico" viewBox="0 0 48 48" aria-hidden="true">${IC[nombre] || IC.chasis}</svg>`;
/* Ícono que le toca a una pieza */
export const icoPieza = (it, cat) => ico(it.espejo === 'seg' ? 'espejo' : it.espejo === 'mono' ? 'mono' : it.id === 'sar' ? 'sar' : it.id === 'sun' ? 'sun' : cat);

/* --- Barra de recurso --- */
export function barra(etiqueta, valor, pct, estado) {
  return `<div class="bar"><div class="t"><span>${etiqueta}</span><b class="mono">${valor}</b></div><div class="trk"><div class="fill ${estado}" style="width:${Math.min(100, Math.max(2, pct))}%"></div></div></div>`;
}

/* Las 4 barras de siempre. Con ops, el presupuesto incluye el gasto de operación. */
export function barrasHTML(o, ops) {
  const gasto = ops ? o.cost + ops.spent : o.cost, pctGasto = gasto / o.M.budget * 100;
  return barra(t('Peso'), `${fmt(o.mass)} / ${o.cap ? fmt(o.cap) : '–'} kg`, o.massPct, nivel(o.massPct))
    + barra(t('Potencia'), `${fmt(o.use)} / ${fmt(o.gen)} W`, o.enPct, nivel(o.enPct))
    + barra(t('Datos'), `${o.dg.toFixed(0)} / ${o.send} Mbps`, o.dataPct, o.dataPct > 200 ? 'bad' : o.dataPct > 100 ? 'warn' : 'ok')
    + barra(t('Presupuesto'), `$${fmt(gasto)} / ${fmt(o.M.budget)} M`, pctGasto, nivel(pctGasto));
}

export const indicadoresHTML = o => `<div class="ind">
  <div class="${o.rel >= 90 ? 'ok' : o.rel >= 75 ? 'warn' : 'bad'}"><small>${t('Confiabilidad')}</small><b>${o.rel}%</b></div>
  <div class="${o.months > o.M.deadline ? 'bad' : 'ok'}"><small>${t('Construcción')}</small><b>${o.months}/${o.M.deadline} m</b></div></div>`;

export const enlacesAyuda = () => `<div class="mini"><button data-ir="glosario">${t('GLOSARIO')}</button><button data-ir="como-jugar">${t('CÓMO JUGAR')}</button></div>`;
export const limpio = txt => String(txt).replace(/[<>"&]/g, '');
