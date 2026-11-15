/* ============================================================
   IDIOMA: español (por defecto) o inglés.

   · Interfaz: los textos se escriben en español dentro del código con
     t(«Texto en español»). Si el idioma es inglés, t() busca su
     traducción en idioma/en.js. Si no la encuentra, deja el español.
     Variables: t(«Consumes {use} W.», {use: 59}) da «Consumes 59 W.»
   · Datos (piezas, misiones, eventos, glosario): cada archivo de
     datos/ llama a traducirLista() con su diccionario de idioma/en-datos.js,
     organizado por id. Así un cambio de redacción en español no rompe
     la traducción.

   Cambiar de idioma guarda la elección y recarga la página.
   Para revisar textos sin traducir: npm test (pruebas/idioma.test.js).
   ============================================================ */
import {EN} from './en.js';

const CLAVE = 'missionControl.idioma';

function leerIdioma() {
  if (typeof globalThis.MC_IDIOMA === 'string') return globalThis.MC_IDIOMA;       // para las pruebas en Node
  try { return localStorage.getItem(CLAVE) === 'en' ? 'en' : 'es'; } catch { return 'es'; }
}

export const IDIOMA = leerIdioma();
export const EN_INGLES = IDIOMA === 'en';
export const LOCALE = EN_INGLES ? 'en-US' : 'es-MX';

/* Textos pedidos en inglés que no tienen traducción (las pruebas los revisan) */
export const faltantes = new Set();

export function t(texto, vars) {
  let s = texto;
  if (EN_INGLES) {
    if (EN[texto] !== undefined) s = EN[texto];
    else faltantes.add(texto);
  }
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => vars[k] !== undefined ? vars[k] : m);
  return s;
}

/* Marca un texto que se traduce después, al mostrarlo con t(variable).
   No hace nada: solo sirve para que la prueba encuentre el texto. */
export const tx = texto => texto;

/* Copia los campos traducidos sobre una lista de objetos con id */
export function traducirLista(lista, dic) {
  if (!EN_INGLES) return;
  lista.forEach(x => { if (dic[x.id]) Object.assign(x, dic[x.id]); });
}
/* Igual, para un objeto organizado por clave ({sso: '...', leo: '...'}) */
export function traducirMapa(mapa, dic) {
  if (!EN_INGLES) return;
  Object.keys(dic).forEach(k => {
    mapa[k] = (typeof dic[k] === 'object' && typeof mapa[k] === 'object') ? Object.assign(mapa[k], dic[k]) : dic[k];
  });
}

export function cambiarIdioma(nuevo) {
  try { localStorage.setItem(CLAVE, nuevo); } catch { /* sin almacenamiento: no se puede cambiar */ }
  location.reload();
}

/* Botón ES | EN arriba a la derecha. Se pone fuera de #app para que
   no se borre cuando cada módulo vuelve a pintar su contenido. */
export function montarBotonIdioma() {
  if (typeof document === 'undefined' || document.querySelector('.idioma')) return;
  document.documentElement.lang = IDIOMA;
  document.title = t(document.title);
  const caja = document.createElement('div');
  caja.className = 'idioma';
  caja.setAttribute('role', 'group');
  caja.setAttribute('aria-label', t('Idioma'));
  caja.innerHTML = ['es', 'en'].map(l => `<button data-idioma="${l}" class="${l === IDIOMA ? 'on' : ''}" aria-pressed="${l === IDIOMA}">${l.toUpperCase()}</button>`).join('');
  caja.addEventListener('click', e => {
    const b = e.target.closest('[data-idioma]');
    if (b && b.dataset.idioma !== IDIOMA) cambiarIdioma(b.dataset.idioma);
  });
  document.body.appendChild(caja);
}
