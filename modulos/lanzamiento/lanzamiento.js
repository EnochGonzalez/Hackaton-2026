/* LANZAMIENTO: cuenta regresiva, despegue del cohete armado y sorteo.
   El resultado se guarda para que recargar la página no repita el sorteo. */
import {ORBS} from '../../datos/misiones.js';
import {calc} from '../../nucleo/calc.js';
import {puedeLanzar} from '../../nucleo/validacion.js';
import {nuevaOperacion} from '../../nucleo/operacion.js';
import {reporteFalla} from '../../nucleo/puntuacion.js';
import {guardarPartida, misionDe, reiniciarVuelo} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {coheteSVG} from '../../compartido/nave-svg.js';
import {activarGuia} from '../../compartido/guia.js';
import {t} from '../../idioma/idioma.js';

const app = document.querySelector('#app');
const partida = exigirPartida();
if (partida) {
  const M = misionDe(partida), o = calc(M, partida.sel);
  const resultado = () => {
    const L = partida.lanz;
    app.innerHTML = `<div class="lau"><div class="box"><h2>${L.ok ? t('Lanzamiento exitoso') : t('Falla de lanzamiento')}</h2>
      ${L.ok ? t('La nave llegó a la órbita {o}. Tenías {p}% de probabilidad de éxito.', {o: ORBS[M.orbit], p: L.chance}) : t('Con {p}% de probabilidad, esta vez no salió bien. Sube la confiabilidad con pruebas en Tierra o usa una Fase 1 más confiable, y reintenta.', {p: L.chance})}
      <div class="acciones">${L.ok ? `<button class="btn go2" data-ir="operaciones">${t('INICIAR OPERACIÓN')}</button>` : `<button class="btn" id="reintentar">${t('VOLVER AL TALLER')}</button><button class="btn light" data-ir="reporte">${t('VER REPORTE')}</button>`}</div></div></div>`;
  };
  activarEnlaces();
  app.addEventListener('click', e => { if (e.target.id === 'reintentar') { reiniciarVuelo(partida); guardarPartida(partida); ir('taller'); } });
  if (partida.lanz) resultado();
  else if (!puedeLanzar(o)) ir('revision');
  else {
    let n = 3;
    app.innerHTML = `<div class="lau"><div class="cd" id="cd">3</div></div>`;
    const tic = () => {
      n--;
      if (n > 0) { document.querySelector('#cd').textContent = n; setTimeout(tic, 600); return; }
      app.innerHTML = `<div class="lau"><div class="rk">${coheteSVG(o, null, false)}</div><div class="cd">${t('¡DESPEGUE!')}</div></div>`;
      setTimeout(() => {
        const ok = M.tuto || Math.random() * 100 < o.chance;      // el entrenamiento no falla
        partida.lanz = {ok, chance: o.chance};
        if (ok) partida.ops = nuevaOperacion(); else partida.rep = reporteFalla();
        guardarPartida(partida); resultado();
      }, 2000);
    };
    setTimeout(tic, 600);
  }
  activarGuia('lanzamiento');
}
