/* ============================================================
   PASOS DE LA GUÍA de los entrenamientos (o0 y t0).
   La guía (compartido/guia.js) muestra, en cada página, el primer
   paso que todavía no está hecho, ilumina su objetivo y bloquea
   todo lo demás.

   Campos de un paso:
     id        identificador único dentro del entrenamiento
     pagina    contexto | taller | revision | lanzamiento | operaciones | reporte
     objetivo  selector CSS de lo que se ilumina (varios separados por coma:
               se usa el primero que esté visible)
     texto     lo que dice la guía (en español; se traduce con t())
     info      1 = solo se lee: se cierra con ENTENDIDO
     hecho     ({p}) => true cuando el jugador ya hizo la acción
     si        ({p}) => el paso solo aplica cuando esto es true
     paso/sub  en el taller: pestaña (0 BUS, 1 SENSORES, 2 SOPORTE, 3 COHETE)
               y parte del cohete (0 Fase 1, 1 Boosters, 2 Fase 2, 3 Cofia).
               Si el jugador está en otra, la guía lo lleva primero ahí.
   ============================================================ */
import {tx} from '../idioma/idioma.js';

const RECURSOS = '.resumen, .right';     // en teléfono las barras están arriba (.resumen)

/* Elegir una pieza en el taller */
const pieza = (cat, id, paso, texto, sub) => ({
  id: `${cat}-${id}`, pagina: 'taller', paso, sub, texto,
  objetivo: `.tile[data-cat="${cat}"][data-id="${id}"]`,
  hecho: ({p}) => Array.isArray(p.sel[cat]) ? p.sel[cat].includes(id) : p.sel[cat] === id,
});
const info = (id, pagina, objetivo, texto, extra) => ({id, pagina, objetivo, texto, info: 1, ...extra});

/* ---------- Pasos que comparten los dos entrenamientos ---------- */
const CONTEXTO = [
  info('c-contrato', 'contexto', '.ctx .chips', tx('Este es tu contrato: el dinero, el tiempo de construcción y la órbita a la que vas.')),
  info('c-requisito', 'contexto', '.ctx .row2', tx('Tu nave debe cumplir el requisito del contrato. Si no lo cumple, no podrá despegar.')),
  {id: 'c-ir', pagina: 'contexto', objetivo: '#iniciar', texto: tx('Toca el botón para ir al taller.')},
];
const TALLER_INICIO = [
  info('t-taller', 'taller', '.stage', tx('Este es tu taller. Aquí armas el satélite pieza por pieza y lo ves crecer.'), {paso: 0}),
  info('t-recursos', 'taller', RECURSOS, tx('Estos son tus recursos: peso, potencia, datos y presupuesto. Si una barra se pone roja, no despegas.'), {paso: 0}),
];
const COHETE_INICIO = info('t-cohete', 'taller', '.sub', tx('Ahora el cohete. Se arma de abajo hacia arriba y cada parte decide cuáles caben encima.'), {paso: 3, sub: 0});
const TALLER_FIN = {id: 't-revisar', pagina: 'taller', paso: 3, objetivo: '.nav [data-ir="revision"]', texto: tx('Nave y cohete listos. Toca REVISAR.')};

const REVISION_INICIO = info('r-semaforo', 'revision', '.rev', tx('Antes de lanzar, revisa el semáforo. Verde: bien. Amarillo: cuidado. Rojo: no puedes lanzar.'));
const REVISION_FIN = [
  {id: 'r-pruebas', pagina: 'revision', objetivo: '[data-prueba="basic"]', hecho: ({p}) => p.sel.tests === 'basic',
   texto: tx('Las pruebas en Tierra suben la confiabilidad a cambio de tiempo y dinero. Elige PRUEBAS BÁSICAS.')},
  {id: 'r-lanzar', pagina: 'revision', objetivo: '#lanzar', texto: tx('Ningún punto en rojo. ¡Toca LANZAR!')},
];
const VUELO = [
  {id: 'l-ops', pagina: 'lanzamiento', objetivo: '[data-ir="operaciones"]', texto: tx('¡Llegaste a la órbita! Toca INICIAR OPERACIÓN.')},
  info('o-barras', 'operaciones', '.opswrap .right', tx('La barra de Ciencia acumulada es tu meta. La Salud de la nave baja si algo sale mal.'), {si: ({p}) => p.ops && p.ops.month === 0}),
  {id: 'o-comenzar', pagina: 'operaciones', objetivo: '#avanzar', si: ({p}) => p.ops && p.ops.month === 0,
   texto: tx('Toca COMENZAR. Cada mes tu nave junta ciencia.')},
  {id: 'o-evento', pagina: 'operaciones', objetivo: '.opsmain > .card', si: ({p}) => p.ops && !!p.ops.ev,
   texto: tx('¡Un imprevisto! Lee la pregunta y elige una opción. Si dudas, toca PISTA.')},
  {id: 'o-avanzar', pagina: 'operaciones', objetivo: '#avanzar', si: ({p}) => p.ops && !p.ops.ev,
   texto: tx('Todo en orden. Toca AVANZAR UN MES.')},
  info('rp-nota', 'reporte', '.grade', tx('Esta es tu nota. Va de S, la mejor, a D.')),
  info('rp-porque', 'reporte', '.der > .card', tx('Aquí está el porqué: cada línea explica cómo una decisión cambió tu resultado.')),
  {id: 'rp-fin', pagina: 'reporte', objetivo: '.grade [data-ir="misiones"]', texto: tx('¡Entrenamiento completo! Toca MISIONES para aceptar tu primer contrato real.')},
];

export const GUIAS = {
  /* ---------- Ojo en la Tierra: CubeSat de incendios ---------- */
  o0: [
    ...CONTEXTO, ...TALLER_INICIO,
    pieza('chasis', 'cube', 0, tx('Empieza por el chasis, el cuerpo del satélite. Elige el CubeSat: pequeño y barato, justo para este contrato.')),
    pieza('energia', 'e60', 0, tx('Ahora la energía. Un CubeSat solo necesita paneles pequeños: elige los de 60 W.')),
    info('i-potencia', 'taller', RECURSOS, tx('Mira la barra de Potencia: tus paneles generan 60 W y el chasis ya usa una parte.'), {paso: 0}),
    pieza('instr', 'fire', 1, tx('El contrato pide detectar calor. Elige la cámara infrarroja compacta.')),
    pieza('termico', 'mli', 2, tx('La cámara funciona a 270 K. Las mantas MLI la mantienen a esa temperatura.')),
    pieza('adcs', 'mag', 2, tx('Para apuntar esta cámara a la Tierra bastan las barras magnéticas.')),
    pieza('comms', 'uhf', 2, tx('La antena UHF envía 15 Mbps y tu cámara genera menos. Es suficiente.')),
    pieza('prop', 'gas', 2, tx('El gas frío mantiene la órbita de un CubeSat. Barato y seguro.')),
    info('i-margen', 'taller', RECURSOS, tx('La potencia quedó casi llena: usas 59 de 60 W. Funciona, pero sin margen.'), {paso: 2}),
    COHETE_INICIO,
    pieza('f1', 'electron', 3, tx('Fase 1: el Electron es el cohete más barato y está hecho para CubeSats.'), 0),
    pieza('boosters', 'none', 3, tx('Tu satélite pesa unos 30 kg: no necesitas boosters.'), 1),
    pieza('etapa', 'curie', 3, tx('La etapa superior deja al satélite en su órbita exacta.'), 2),
    pieza('cofia', 'c12', 3, tx('Por último la cofia, la punta que protege al satélite durante el despegue.'), 3),
    TALLER_FIN,
    REVISION_INICIO,
    info('r-amarillo', 'revision', '[data-fila="3"]', tx('La potencia sale en amarillo: poco margen. Puedes lanzar, pero el reporte lo toma en cuenta.')),
    ...REVISION_FIN, ...VUELO,
  ],

  /* ---------- Telescopio Espacial: cazador de exoplanetas ---------- */
  t0: [
    ...CONTEXTO, ...TALLER_INICIO,
    pieza('chasis', 'explorer', 0, tx('Empieza por el chasis. El Explorer es ligero y está hecho para un telescopio en órbita baja.')),
    pieza('energia', 'e430', 0, tx('Ahora la energía. Con 430 W alcanza para las cámaras y lo demás.')),
    info('i-potencia', 'taller', RECURSOS, tx('Mira la barra de Potencia: cada pieza que agregues consume parte de esos 430 W.'), {paso: 0}),
    pieza('instr', 'tess', 1, tx('Elige las 4 cámaras de TESS: detectan planetas cuando pasan frente a su estrella.')),
    pieza('termico', 'rad', 2, tx('Las cámaras deben estar a 198 K. Los radiadores pasivos enfrían hasta 80 K: de sobra.')),
    pieza('adcs', 'inercial', 2, tx('Un telescopio no mira a la Tierra, mira estrellas. El apuntamiento inercial lo mantiene fijo en el cielo.')),
    pieza('comms', 'kaC', 2, tx('La antena Ka envía 100 Mbps cuando el telescopio pasa cerca de la Tierra.')),
    pieza('prop', 'hidra', 2, tx('La hidracina mantiene la altura de la órbita durante años.')),
    info('i-margen', 'taller', RECURSOS, tx('Todo en verde. Tu telescopio pesa unos 490 kg: el cohete debe poder subirlo.'), {paso: 2}),
    COHETE_INICIO,
    pieza('f1', 'minotaur', 3, tx('Fase 1: el Minotaur IV sube hasta 1 735 kg a órbita baja. Es el más barato que puede con tu telescopio.'), 0),
    pieza('boosters', 'none', 3, tx('El Minotaur no usa boosters. Elige Sin boosters.'), 1),
    pieza('etapa', 'orion', 3, tx('La etapa superior deja al telescopio en su órbita exacta.'), 2),
    pieza('cofia', 'c20', 3, tx('La cofia de 2 m: tu chasis mide 1.5 m, así que cabe.'), 3),
    TALLER_FIN,
    REVISION_INICIO,
    info('r-masa', 'revision', '[data-fila="2"]', tx('Tu telescopio usa menos de un tercio del cohete. Ningún cohete más pequeño llega, y uno más grande costaría más.')),
    ...REVISION_FIN, ...VUELO,
  ],
};
