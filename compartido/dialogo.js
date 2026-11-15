/* ============================================================
   VENTANA DE CONFIRMACIÓN propia del juego (sin confirm() del navegador).
   const ok = await preguntar({titulo, texto, si, no});
   · El botón seguro (no) recibe el foco: Enter no borra nada por accidente.
   · Esc o tocar fuera de la ventana = no.
   · El texto puede llevar <b> para resaltar nombres.
   Estilos en compartido/base.css (sección "Ventana de confirmación").
   ============================================================ */
import {ico} from './componentes.js';

export function preguntar({titulo, texto, si, no, icono = 'cohete'}) {
  return new Promise(resolver => {
    const previo = document.activeElement;
    const fondo = document.createElement('div');
    fondo.className = 'modal-fondo';
    fondo.innerHTML = `<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="modal-t" aria-describedby="modal-p">
        <div class="modal-ico">${ico(icono)}</div>
        <h3 id="modal-t">${titulo}</h3>
        <p id="modal-p">${texto}</p>
        <div class="modal-acc"><button class="btn light" data-r="no">${no}</button><button class="btn" data-r="si">${si}</button></div>
      </div>`;
    document.body.appendChild(fondo);
    requestAnimationFrame(() => fondo.classList.add('on'));
    const botones = [...fondo.querySelectorAll('button')];
    botones[0].focus();

    function cerrar(respuesta) {
      document.removeEventListener('keydown', teclas, true);
      fondo.classList.remove('on');
      setTimeout(() => fondo.remove(), 180);
      if (previo && previo.focus) previo.focus();
      resolver(respuesta);
    }
    function teclas(e) {
      if (e.key === 'Escape') { e.preventDefault(); cerrar(false); }
      else if (e.key === 'Tab') {                         // el foco no sale de la ventana
        e.preventDefault();
        const i = botones.indexOf(document.activeElement);
        botones[(i + (e.shiftKey ? -1 : 1) + botones.length) % botones.length].focus();
      }
    }
    document.addEventListener('keydown', teclas, true);
    fondo.addEventListener('click', e => {
      const b = e.target.closest('[data-r]');
      if (b) cerrar(b.dataset.r === 'si');
      else if (e.target === fondo) cerrar(false);
    });
  });
}
