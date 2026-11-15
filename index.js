/* INICIO: menú principal. Al tocar MISIONES el cohete despega y luego se abre la lista. */
import {cargarPartida, cargarComandante, guardarComandante, misionDe} from './compartido/estado.js';
import {ir, activarEnlaces} from './compartido/nav.js';
import {ico, limpio} from './compartido/componentes.js';
import {heroeSVG} from './compartido/nave-svg.js';
import {efecto} from './compartido/audio.js';
import {t, tx} from './idioma/idioma.js';

const partida = cargarPartida();
const tarjeta = (attr, icono, titulo, sub, apagada) =>
  `<button class="icon" ${attr} ${apagada ? 'disabled' : ''}>${ico(icono)}<div><span>${t(titulo)}</span><small>${sub}</small></div></button>`;

document.querySelector('#app').innerHTML = `
  ${heroeSVG()}
  <div class="brand"><b>MISSION CONTROL</b><small>${t('Simulador de diseño de misiones espaciales')}</small></div>
  <div class="menu">
  <div class="hl">
    ${tarjeta('id="btnMisiones"', 'libro', tx('MISIONES'), t('Elige dificultad y contrato'))}
    ${tarjeta('data-ir="taller"', 'cohete', tx('TALLER'), partida ? misionDe(partida).n : t('Diseña y equipa tu nave'), !partida)}
    ${tarjeta('data-ir="marcador"', 'copa', tx('CLASIFICACIÓN'), t('Mejores partidas locales'))}
  </div>
  <div class="hr">
    ${tarjeta('data-ir="glosario"', 'lupa', tx('GLOSARIO'), t('Términos de la misión'))}
    ${tarjeta('data-ir="como-jugar"', 'ayuda', tx('CÓMO JUGAR'), t('Guía rápida'))}
    <div class="whoc"><label for="nm">${t('COMANDANTE')}</label><input class="fld" id="nm" maxlength="18" placeholder="${t('Tu nombre')}" value="${limpio(cargarComandante())}"></div>
  </div>
  </div>
  ${partida ? '' : `<div class="tip">${t('Toca MISIONES para despegar hacia tu primer contrato.')}</div>`}`;

activarEnlaces();
document.querySelector('#nm').addEventListener('input', e => guardarComandante(e.target.value));

let despegando = false;
document.querySelector('#btnMisiones').addEventListener('click', () => {
  if (despegando) return;
  despegando = true;
  document.querySelector('.hero').classList.add('launch');
  efecto('despegue');
  setTimeout(() => ir('misiones'), 1700);
});
/* Si el jugador regresa con el botón Atrás del navegador, el cohete vuelve a su sitio */
window.addEventListener('pageshow', () => { despegando = false; document.querySelector('.hero').classList.remove('launch'); });
