/* LANZAMIENTO: cuenta regresiva en la plataforma, encendido, despegue entre
   estrellas con telemetría y sorteo. El resultado se guarda para que recargar
   la página no repita el sorteo. */
import {ORB, ORBS} from '../../datos/misiones.js';
import {calc} from '../../nucleo/calc.js';
import {puedeLanzar} from '../../nucleo/validacion.js';
import {nuevaOperacion} from '../../nucleo/operacion.js';
import {reporteFalla} from '../../nucleo/puntuacion.js';
import {guardarPartida, misionDe, reiniciarVuelo} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {coheteSVG, sateliteSVG} from '../../compartido/nave-svg.js';
import {iniciarEstrellas} from '../../compartido/estrellas.js';
import {activarGuia} from '../../compartido/guia.js';
import {efecto} from '../../compartido/audio.js';
import {t, LOCALE} from '../../idioma/idioma.js';

const app = document.querySelector('#app');
const partida = exigirPartida();
if (partida) {
  const M = misionDe(partida), o = calc(M, partida.sel);
  const campo = iniciarEstrellas({ritmo: 0});               // en la plataforma las estrellas están quietas
  const num = n => Math.round(n).toLocaleString(LOCALE);

  const resultado = () => {
    const L = partida.lanz;
    campo.velocidad(L.ok ? .5 : 0);
    app.innerHTML = `<div class="lau fin ${L.ok ? 'ok' : 'mal'}">
      ${L.ok ? `<div class="orbsat"><svg viewBox="0 0 440 400">${sateliteSVG(o, 220, 215, 1.2)}</svg></div>` : ''}
      <div class="box"><h2>${L.ok ? t('Lanzamiento exitoso') : t('Falla de lanzamiento')}</h2>
      ${L.ok ? t('La nave llegó a la órbita {o}. Tenías {p}% de probabilidad de éxito.', {o: ORBS[M.orbit], p: L.chance}) : t('Con {p}% de probabilidad, esta vez no salió bien. Sube la confiabilidad con pruebas en Tierra o usa una Fase 1 más confiable, y reintenta.', {p: L.chance})}
      <div class="acciones">${L.ok ? `<button class="btn go2" data-ir="operaciones">${t('INICIAR OPERACIÓN')}</button>` : `<button class="btn" id="reintentar">${t('VOLVER AL TALLER')}</button><button class="btn light" data-ir="reporte">${t('VER REPORTE')}</button>`}</div></div></div>`;
  };

  /* Telemetría: la altitud y la velocidad suben mientras el cohete asciende */
  function telemetria(ms) {
    const alt = document.querySelector('#alt'), vel = document.querySelector('#vel'), t0 = performance.now();
    const paso = ahora => {
      const k = Math.min(1, (ahora - t0) / ms), e = k * k;
      if (!alt.isConnected) return;
      alt.textContent = num(e * 120); vel.textContent = num(e * 27400);
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  activarEnlaces();
  app.addEventListener('click', e => { if (e.target.id === 'reintentar') { reiniciarVuelo(partida); guardarPartida(partida); ir('taller'); } });
  if (partida.lanz) resultado();
  else if (!puedeLanzar(o)) ir('revision');
  else {
    let n = 3;
    app.innerHTML = `<div class="lau" id="lau">
      <div class="lau-info"><b>${M.n}</b><small>${t('ÓRBITA')} · ${ORB[M.orbit]}</small></div>
      <div class="cd tic" id="cd">3</div>
      <div class="humo"></div>
      <div class="rk"><div class="tiembla">${coheteSVG(o, null, false, true)}</div></div>
      <div class="suelo"></div>
      <div class="tele"><span><small>${t('ALTITUD')}</small><b><i id="alt">0</i> km</b></span><span><small>${t('VELOCIDAD')}</small><b><i id="vel">0</i> km/h</b></span></div>
    </div>`;
    const lau = document.querySelector('#lau'), cd = document.querySelector('#cd');
    const marcar = texto => { cd.textContent = texto; cd.classList.remove('tic'); void cd.offsetWidth; cd.classList.add('tic'); };
    const tic = () => {
      n--;
      if (n > 0) { marcar(n); efecto('bip'); setTimeout(tic, 700); return; }
      /* Encendido: llamas y vibración; medio segundo después, asciende */
      marcar(t('¡DESPEGUE!')); cd.classList.add('fin');
      lau.classList.add('fuego');
      efecto('bipFinal'); efecto('despegue');
      setTimeout(() => { lau.classList.add('sube'); campo.acelerar(); telemetria(2600); }, 500);
      setTimeout(() => {
        const ok = M.tuto || Math.random() * 100 < o.chance;      // el entrenamiento no falla
        partida.lanz = {ok, chance: o.chance};
        if (ok) partida.ops = nuevaOperacion(); else partida.rep = reporteFalla();
        guardarPartida(partida); resultado();
        efecto(ok ? 'exito' : 'falla');
      }, 3300);
    };
    efecto('bip');
    setTimeout(tic, 700);
  }
  activarGuia('lanzamiento');
}
