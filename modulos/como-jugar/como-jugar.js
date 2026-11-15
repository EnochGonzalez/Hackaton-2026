/* CÓMO JUGAR: pasos, puntuación y dificultades, todo en cuadros */
import {DIF} from '../../datos/dificultades.js';
import {activarEnlaces} from '../../compartido/nav.js';

const PASOS = [
  ['Elige dificultad y contrato', 'En MISIONES escoges dificultad y una de las seis misiones. Cada contrato trae su presupuesto, su plazo y su órbita.'],
  ['Lee el contexto', 'Te explica qué problema resuelve la misión, qué debe cumplir tu nave y qué misiones reales la inspiran.'],
  ['Diseña el satélite', 'BUS, SENSORES y SOPORTE. Pasa el cursor sobre una pieza para ver sus datos. Las casillas punteadas no sirven para este contrato.'],
  ['Arma el cohete por partes', 'De abajo hacia arriba: Fase 1, boosters, etapa superior y cofia. La Fase 1 decide qué partes son compatibles y cuánta masa llega a tu órbita.'],
  ['Revisa y lanza', 'El semáforo debe quedar sin rojos. Las pruebas en Tierra suben la confiabilidad a cambio de meses y dinero. Puedes fallar aun con buen diseño.'],
  ['Opera 12 meses', 'Cada pocos meses ocurre un evento y debes decidir. El botón de pista te orienta sin revelar la mejor opción.'],
];
const PUNTOS = [
  ['400', 'Ciencia', 'Lo que observó tu nave durante los 12 meses. Depende de los sensores y de cuántos datos llegan a la Tierra.'],
  ['200', 'Recursos', 'Qué tan bien usaste el peso, la potencia y el ancho de banda: sin pasarte y sin desperdiciar.'],
  ['150', 'Presupuesto', 'Cuánto dinero te sobró al terminar. Pasarte del límite da cero.'],
  ['150', 'Decisiones', 'Qué tan buenas fueron tus respuestas a los eventos y cuánta salud conservó la nave.'],
  ['100', 'Equilibrio del diseño', 'Confiabilidad alta y pocas alertas amarillas en la revisión.'],
  ['S · A · B · C · D', 'Notas', 'S desde 900 puntos, A desde 800, B desde 650, C desde 500 y D por debajo.'],
];
document.querySelector('#app').innerHTML = `<button class="back" data-volver>‹ VOLVER</button>
  <div class="page paper"><h2>Cómo jugar</h2><div class="sub">Diseña, lanza y opera una misión espacial administrando recursos limitados.</div>
    <div class="how">${PASOS.map((p, i) => `<div class="hw"><i>${i + 1}</i><b>${p[0]}</b><span>${p[1]}</span></div>`).join('')}</div>
    <div class="lbl">Puntuación · 1000 puntos</div>
    <div class="how">${PUNTOS.map(p => `<div class="hw"><i class="pt">${p[0]}</i><b>${p[1]}</b><span>${p[2]}</span></div>`).join('')}</div>
    <div class="lbl">Dificultades</div>
    <div class="how">${Object.values(DIF).map(d => `<div class="hw"><b>${d.n}</b><span>${d.txt}</span></div>`).join('')}</div>
  </div>`;
activarEnlaces();
