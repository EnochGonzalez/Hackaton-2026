/* ============================================================
   NAVEGACIÓN entre módulos. Usa rutas relativas a la raíz del
   proyecto, así funciona igual en local y en Vercel.
   ============================================================ */
import {cargarPartida} from './estado.js';

const RAIZ = new URL('../', import.meta.url);
export const ruta = mod => mod === 'inicio' ? new URL('index.html', RAIZ).href : new URL(`modulos/${mod}/${mod}.html`, RAIZ).href;
export const ir = mod => { location.href = ruta(mod); };

/* Regresa a la página anterior; si no hay, al inicio */
export function volver() {
  if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) history.back();
  else ir('inicio');
}

/* Las páginas del juego necesitan una partida. Si no hay, manda a MISIONES.
   fase: 'diseno' | 'ops' | 'rep' exige además que la partida esté en ese punto. */
export function exigirPartida(fase) {
  const p = cargarPartida();
  if (!p) { ir('misiones'); return null; }
  if (fase === 'ops' && !p.ops) { ir('taller'); return null; }
  if (fase === 'rep' && !p.rep) { ir('taller'); return null; }
  return p;
}

/* Conecta todos los botones con data-ir="modulo" y data-volver */
export function activarEnlaces(raiz = document) {
  raiz.addEventListener('click', e => {
    const b = e.target.closest('[data-ir],[data-volver]');
    if (!b || b.disabled) return;
    if (b.dataset.volver !== undefined) volver(); else ir(b.dataset.ir);
  });
}
