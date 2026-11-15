/* REPORTE: nota, desglose de puntos, causa-efecto y pregunta opcional de la tabla de clasificación */
import {DIF} from '../../datos/dificultades.js';
import {guardarPartida, misionDe, reiniciarVuelo, cargarComandante, guardarComandante, agregarATabla} from '../../compartido/estado.js';
import {ir, exigirPartida, activarEnlaces} from '../../compartido/nav.js';
import {barra, limpio} from '../../compartido/componentes.js';

const app = document.querySelector('#app');
const partida = exigirPartida('rep');
if (partida) {
  const M = misionDe(partida), r = partida.rep;
  const pintar = () => {
    let tabla = '';
    if (!r.fail && partida.lb === 'si') tabla = `<div class="card lb"><b>Partida agregada a la tabla de clasificación.</b><div class="row"><button class="btn" data-ir="marcador">VER TABLA</button></div></div>`;
    else if (!r.fail && partida.lb !== 'no') tabla = `<div class="card lb"><b>¿Deseas agregar tu partida a la tabla de clasificación?</b>
      <p>Se guarda solo en este navegador, con tu nombre, la misión, la dificultad y tu puntuación.</p>
      <div class="row"><input class="fld" id="nombre" maxlength="18" placeholder="Tu nombre" value="${limpio(cargarComandante())}"><button class="btn go2" id="si">SÍ, AGREGAR</button><button class="btn light" id="no">NO, GRACIAS</button></div></div>`;
    app.innerHTML = `<button class="back" data-ir="inicio">‹ INICIO</button>
      <div class="rep">
        <div class="grade"><small>${M.n}</small><div class="g">${r.grade}</div><div class="s">${r.total} / 1000</div><small>Dificultad ${DIF[M.dif].n}</small>
          <button class="btn" id="redisenar">REDISEÑAR</button><button class="btn light" data-ir="misiones">MISIONES</button></div>
        <div class="der"><div class="card"><h3>Reporte de misión</h3>
          ${r.parts.map(p => barra(p[0], `${p[1]} / ${p[2]}`, p[1] / p[2] * 100, p[1] / p[2] > .75 ? 'ok' : p[1] / p[2] > .5 ? 'warn' : 'bad')).join('')}
          <div class="why">${r.why.map(w => `<div>${w}</div>`).join('')}</div></div>${tabla}</div>
      </div>`;
  };
  activarEnlaces();
  app.addEventListener('click', e => {
    const id = e.target.id;
    if (id === 'redisenar') { reiniciarVuelo(partida); guardarPartida(partida); ir('taller'); }
    else if (id === 'no') { partida.lb = 'no'; guardarPartida(partida); pintar(); }
    else if (id === 'si') {
      const nombre = limpio(document.querySelector('#nombre').value.trim()) || 'Comandante';
      guardarComandante(nombre);
      agregarATabla({name: nombre, mid: M.id, mn: M.n, dif: M.dif, total: r.total, grade: r.grade, date: new Date().toLocaleDateString('es-MX')});
      partida.lb = 'si'; guardarPartida(partida); pintar();
    }
  });
  pintar();
}
