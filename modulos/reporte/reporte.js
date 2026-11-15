/* REPORTE: nota, desglose de puntos, causa-efecto y pregunta opcional de la tabla de clasificación */
import {DIF} from '../../datos/dificultades.js';
import {guardarPartida, misionDe, reiniciarVuelo, cargarComandante, guardarComandante, agregarATabla} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {barra, limpio} from '../../compartido/componentes.js';
import {activarGuia} from '../../compartido/guia.js';
import {textoCausa} from '../../nucleo/puntuacion.js';
import {t, LOCALE} from '../../idioma/idioma.js';

const app = document.querySelector('#app');
const partida = exigirPartida('rep');
if (partida) {
  const M = misionDe(partida), r = partida.rep;
  const pintar = () => {
    let tabla = '';
    if (M.tuto) tabla = '';
    else if (!r.fail && partida.lb === 'si') tabla = `<div class="card lb"><b>${t('Partida agregada a la tabla de clasificación.')}</b><div class="row"><button class="btn" data-ir="marcador">${t('VER TABLA')}</button></div></div>`;
    else if (!r.fail && partida.lb !== 'no') tabla = `<div class="card lb"><b>${t('¿Deseas agregar tu partida a la tabla de clasificación?')}</b>
      <p>${t('Se guarda solo en este navegador, con tu nombre, la misión, la dificultad y tu puntuación.')}</p>
      <div class="row"><input class="fld" id="nombre" maxlength="18" placeholder="${t('Tu nombre')}" value="${limpio(cargarComandante())}"><button class="btn go2" id="si">${t('SÍ, AGREGAR')}</button><button class="btn light" id="no">${t('NO, GRACIAS')}</button></div></div>`;
    app.innerHTML = `<button class="back" data-ir="inicio">‹ ${t('INICIO')}</button>
      <div class="rep">
        <div class="grade"><small>${M.n}</small><div class="g">${r.grade}</div><div class="s">${r.total} / 1000</div><small>${t('Dificultad')} ${DIF[M.dif].n}</small>
          <button class="btn" id="redisenar">${t('REDISEÑAR')}</button><button class="btn light" data-ir="misiones">${t('MISIONES')}</button></div>
        <div class="der"><div class="card"><h3>${t('Reporte de misión')}</h3>
          ${r.parts.map(p => barra(t(p[0]), `${p[1]} / ${p[2]}`, p[1] / p[2] * 100, p[1] / p[2] > .75 ? 'ok' : p[1] / p[2] > .5 ? 'warn' : 'bad')).join('')}
          <div class="why">${r.why.map(w => `<div>${textoCausa(w)}</div>`).join('')}</div></div>${tabla}</div>
      </div>`;
  };
  activarEnlaces();
  app.addEventListener('click', e => {
    const id = e.target.id;
    if (id === 'redisenar') { reiniciarVuelo(partida); guardarPartida(partida); ir('taller'); }
    else if (id === 'no') { partida.lb = 'no'; guardarPartida(partida); pintar(); }
    else if (id === 'si') {
      const nombre = limpio(document.querySelector('#nombre').value.trim()) || t('Comandante');
      guardarComandante(nombre);
      agregarATabla({name: nombre, mid: M.id, mn: M.n, dif: M.dif, total: r.total, grade: r.grade, date: new Date().toLocaleDateString(LOCALE)});
      partida.lb = 'si'; guardarPartida(partida); pintar();
    }
  });
  pintar();
  activarGuia('reporte');
}
