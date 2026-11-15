/* ============================================================
   AUDIO 8-BIT. No usa archivos: todo se genera con Web Audio
   (ondas cuadradas y triangulares + ruido, como una consola vieja).

   · Una pista por sección (ver PISTA_DE): principal, misiones,
     taller y órbita. Se repite en bucle y, al cambiar de página
     dentro de la misma sección, sigue donde se quedó.
   · Efectos: efecto('despegue' | 'bip' | 'bipFinal' | 'exito' | 'falla').
   · Botón de sonido junto al de idioma; la elección se recuerda.
   · Los navegadores no dejan sonar nada hasta que el jugador toca
     o teclea algo: si aún no se puede, la música espera ese gesto.

   Para cambiar una melodía: edita PISTAS. Cada compás son 16 pasos
   separados por espacio:  nota (C5, F#4, Bb3) · "-" alarga · "." silencio.
   ============================================================ */
import {t} from '../idioma/idioma.js';

const CLAVE = 'missionControl.sonido';        // 'off' = silenciado
const SESION = 'missionControl.audio';        // {pista, paso}: para continuar entre páginas

/* ---------- Qué pista suena en cada página ---------- */
const PISTA_DE = {
  inicio: 'principal', glosario: 'principal', 'como-jugar': 'principal', marcador: 'principal', reporte: 'principal',
  misiones: 'misiones', contexto: 'misiones',
  taller: 'taller', revision: 'taller',
  lanzamiento: 'orbita', operaciones: 'orbita',
};

/* ---------- Acordes (3 notas, de grave a agudo) ---------- */
const AC = {
  C: ['C4', 'E4', 'G4'], Am: ['A3', 'C4', 'E4'], F: ['F3', 'A3', 'C4'], G: ['G3', 'B3', 'D4'],
  Dm: ['D4', 'F4', 'A4'], Bb: ['Bb3', 'D4', 'F4'], A: ['A3', 'C#4', 'E4'],
  Em: ['E4', 'G4', 'B4'], D: ['D4', 'F#4', 'A4'],
};

/* ---------- Pistas ----------
   acordes: uno por compás · lead: melodía, un texto por compás
   arp: 16 pasos con la nota del acorde (0,1,2; 3 = la primera una octava arriba) o null
   bajo: 16 pasos: 1 = nota grave, 2 = una octava arriba, 0 = nada, '-' = alarga
   bombo / caja / hat: pasos (0 a 15) en los que suenan */
const PISTAS = {
  /* Menú principal y pantallas de información: tranquila y heroica */
  principal: {
    bpm: 100, onda: 'square', vol: {lead: .075, arp: .035, bajo: .16},
    acordes: ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'G'],
    lead: [
      'E5 - - - G5 - - - C6 - - - G5 - E5 -',
      'A5 - - - E5 - - - C5 - - - E5 - - -',
      'F5 - - - A5 - - - C6 - - - A5 - F5 -',
      'G5 - - - D5 - - - B4 - D5 - G5 - - -',
      'C6 - - - B5 - C6 - E6 - - - C6 - - -',
      'A5 - - - C6 - - - E6 - D6 - C6 - A5 -',
      'F5 - A5 - C6 - - - F6 - - - E6 - C6 -',
      'D6 - - - B5 - - - G5 - - - . . . .',
    ],
    arp: [0, null, 1, null, 2, null, 1, null, 0, null, 1, null, 2, null, 1, null],
    bajo: [1, '-', '-', '-', '-', '-', 0, 0, 1, '-', '-', '-', 0, 0, 2, '-'],
    bombo: [], caja: [], hat: [4, 12],
  },
  /* Elegir misión: sala de mando, algo de tensión */
  misiones: {
    bpm: 108, onda: 'square', vol: {lead: .07, arp: .03, bajo: .17},
    acordes: ['Dm', 'Dm', 'Bb', 'C', 'Dm', 'Dm', 'Bb', 'A'],
    lead: [
      'D5 - - F5 - - A5 - - - G5 - F5 - E5 -',
      'F5 - - - D5 - - - . . D5 E5 F5 - A5 -',
      'Bb5 - - A5 - - F5 - - - D5 - F5 - - -',
      'E5 - - G5 - - C6 - - - Bb5 - G5 - E5 -',
      'D5 - - F5 - - A5 - - - D6 - C6 - A5 -',
      'A5 - - - F5 - - - . . F5 G5 A5 - D6 -',
      'D6 - - C6 - - Bb5 - - - A5 - G5 - F5 -',
      'E5 - - - C#5 - - - A4 - - - . . . .',
    ],
    arp: [0, null, 2, null, 1, null, 2, null, 0, null, 2, null, 1, null, 2, null],
    bajo: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 0],
    bombo: [0, 8], caja: [4, 12], hat: [2, 6, 10, 14],
  },
  /* Taller: alegre y con ritmo, para armar la nave */
  taller: {
    bpm: 126, onda: 'square', vol: {lead: .07, arp: .03, bajo: .17},
    acordes: ['G', 'Em', 'C', 'D', 'G', 'Em', 'C', 'D'],
    lead: [
      'G5 . B5 . D6 . B5 . G5 . B5 D6 - . . .',
      'E5 . G5 . B5 . G5 . E5 . G5 B5 - . . .',
      'C5 . E5 . G5 . C6 . B5 . G5 E5 - . . .',
      'D5 . F#5 . A5 . D6 . C6 . A5 F#5 - . . .',
      'D6 - B5 G5 - . B5 . D6 - E6 D6 - . B5 .',
      'E6 - B5 G5 - . B5 . E6 - D6 B5 - . G5 .',
      'C6 - G5 E5 - . G5 . C6 - D6 E6 - . C6 .',
      'D6 - A5 F#5 - . A5 . D6 . . D6 D6 . . .',
    ],
    arp: [null, null, 0, null, null, null, 2, null, null, null, 1, null, null, null, 2, null],
    bajo: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 2],
    bombo: [0, 8, 10], caja: [4, 12], hat: [2, 6, 10, 14],
  },
  /* Lanzamiento y 12 meses en órbita: espacial, lenta y con eco */
  orbita: {
    bpm: 84, onda: 'triangle', eco: true, vol: {lead: .16, arp: .028, bajo: .15},
    acordes: ['Em', 'C', 'G', 'D', 'Em', 'C', 'G', 'D'],
    lead: [
      'B5 - - - - - - - G5 - - - E5 - - -',
      'E5 - - - - - G5 - C6 - - - - - - -',
      'D6 - - - - - - - B5 - - - G5 - - -',
      'A5 - - - - - F#5 - D5 - - - - - - -',
      'E6 - - - - - - - B5 - - - G5 - B5 -',
      'C6 - - - - - E6 - G6 - - - - - E6 -',
      'D6 - - - - - B5 - G5 - - - B5 - D6 -',
      'F#6 - - - - - D6 - A5 - - - - - - -',
    ],
    arp: [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 1],
    bajo: [1, '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 0, 0],
    bombo: [0], caja: [], hat: [8],
  },
};

/* ---------- Notas a frecuencia ---------- */
const SEMI = {C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11};
function hz(nota, octavas = 0) {
  const m = /^([A-G][#b]?)(\d)$/.exec(nota);
  return 440 * Math.pow(2, (SEMI[m[1]] + (+m[2] + octavas - 4) * 12 - 9) / 12);
}

/* ---------- Estado ---------- */
let ctx = null, salida = null, musica = null, ruidoBuf = null;
let pista = null, nombrePista = null, paso = 0, cuando = 0, reloj = null;
let silencio = false;
try { silencio = localStorage.getItem(CLAVE) === 'off'; } catch { /* sin almacenamiento */ }

function crearContexto() {
  if (ctx) return true;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return false;
  ctx = new AudioCtx();
  const limite = ctx.createDynamicsCompressor();          // evita que se sature si coinciden muchos sonidos
  salida = ctx.createGain(); salida.gain.value = .7;
  salida.connect(limite); limite.connect(ctx.destination);
  musica = ctx.createGain(); musica.connect(salida);
  ruidoBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = ruidoBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return true;
}

/* ---------- Voces ---------- */
function tono(destino, f, t0, dur, onda, vol) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = onda; o.frequency.setValueAtTime(f, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + .008);
  g.gain.linearRampToValueAtTime(vol * .55, t0 + dur * .7);
  g.gain.linearRampToValueAtTime(0, t0 + dur);
  o.connect(g); g.connect(destino); o.start(t0); o.stop(t0 + dur + .02);
  return o;
}
function ruido(destino, t0, dur, vol, tipo, f0, f1) {
  const s = ctx.createBufferSource(), fil = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = ruidoBuf; s.loop = true;
  fil.type = tipo; fil.frequency.setValueAtTime(f0, t0);
  if (f1) fil.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
  s.connect(fil); fil.connect(g); g.connect(destino); s.start(t0); s.stop(t0 + dur + .02);
}
function bombo(destino, t0) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(160, t0); o.frequency.exponentialRampToValueAtTime(45, t0 + .12);
  g.gain.setValueAtTime(.22, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + .16);
  o.connect(g); g.connect(destino); o.start(t0); o.stop(t0 + .18);
}

/* ---------- Secuenciador ---------- */
function preparar(nombre) {
  const p = PISTAS[nombre];
  if (!p.pasos) {                                         // se calcula una sola vez
    p.pasos = p.lead.flatMap(c => c.trim().split(/\s+/));
    p.seg = 60 / p.bpm / 4;                               // duración de un paso (semicorchea)
  }
  return p;
}
const largo = (lista, i, tope) => { let n = 1; while (n < tope && lista[(i + n) % lista.length] === '-') n++; return n; };

function tocarPaso(i, t0) {
  const p = pista, s = p.seg, enCompas = i % 16, acorde = AC[p.acordes[Math.floor(i / 16) % p.acordes.length]];
  const dest = p.eco ? p.entradaEco : musica;
  const n = p.pasos[i];
  if (n !== '-' && n !== '.') tono(dest, hz(n), t0, s * largo(p.pasos, i, 16) * .95, p.onda, p.vol.lead);
  const a = p.arp[enCompas];
  if (a !== null) tono(dest, a === 3 ? hz(acorde[0], 1) : hz(acorde[a]), t0, s * (p.eco ? 1.6 : 1.8), 'square', p.vol.arp);
  const b = p.bajo[enCompas];
  if (b === 1 || b === 2) {
    let d = 1; while (enCompas + d < 16 && p.bajo[enCompas + d] === '-') d++;
    tono(musica, hz(acorde[0], b === 1 ? -1 : 0), t0, s * d * .92, 'triangle', p.vol.bajo);
  }
  if (p.bombo.includes(enCompas)) bombo(musica, t0);
  if (p.caja.includes(enCompas)) ruido(musica, t0, .11, .09, 'bandpass', 1800);
  if (p.hat.includes(enCompas)) ruido(musica, t0, .04, .035, 'highpass', 7000);
}

function programar() {
  if (!ctx || ctx.state !== 'running' || !pista) return;
  if (cuando < ctx.currentTime) cuando = ctx.currentTime + .06;
  while (cuando < ctx.currentTime + .18) {
    tocarPaso(paso, cuando);
    cuando += pista.seg;
    paso = (paso + 1) % pista.pasos.length;
  }
}

function arrancar() {
  if (silencio || !nombrePista || !crearContexto()) return;
  if (!pista) {
    pista = preparar(nombrePista);
    if (pista.eco && !pista.entradaEco) {                 // eco sencillo para la pista de órbita
      const entrada = ctx.createGain(), eco = ctx.createDelay(1), vuelta = ctx.createGain();
      eco.delayTime.value = pista.seg * 3; vuelta.gain.value = .32;
      entrada.connect(musica); entrada.connect(eco); eco.connect(vuelta); vuelta.connect(eco); vuelta.connect(musica);
      pista.entradaEco = entrada;
    }
    try {                                                 // misma sección que la página anterior: continúa
      const g = JSON.parse(sessionStorage.getItem(SESION));
      if (g && g.pista === nombrePista) paso = Math.floor(g.paso / 4) * 4 % pista.pasos.length;
    } catch { /* empieza desde el inicio */ }
    musica.gain.setValueAtTime(0, ctx.currentTime);
    musica.gain.linearRampToValueAtTime(1, ctx.currentTime + .6);
  }
  ctx.resume().catch(() => {});
  if (!reloj) reloj = setInterval(programar, 25);
}

function detener() {
  if (reloj) { clearInterval(reloj); reloj = null; }
  if (ctx) ctx.suspend().catch(() => {});
}

/* ---------- Efectos ---------- */
const EFECTOS = {
  /* Cohete que despega: rugido que sube + silbido ascendente */
  despegue(t0) {
    ruido(salida, t0, 1.9, .34, 'lowpass', 180, 3200);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(55, t0); o.frequency.exponentialRampToValueAtTime(620, t0 + 1.7);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.09, t0 + .25); g.gain.linearRampToValueAtTime(0, t0 + 1.8);
    o.connect(g); g.connect(salida); o.start(t0); o.stop(t0 + 1.85);
    musica.gain.cancelScheduledValues(t0);                // la música baja mientras ruge el cohete
    musica.gain.setValueAtTime(musica.gain.value, t0);
    musica.gain.linearRampToValueAtTime(.25, t0 + .2);
    musica.gain.linearRampToValueAtTime(1, t0 + 2.2);
  },
  bip(t0) { tono(salida, 660, t0, .13, 'square', .1); },
  bipFinal(t0) { tono(salida, 990, t0, .4, 'square', .1); },
  exito(t0) { ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => tono(salida, hz(n), t0 + i * .11, i === 3 ? .45 : .12, 'square', .1)); },
  falla(t0) { ['E4', 'Eb4', 'D4', 'C#4'].forEach((n, i) => tono(salida, hz(n), t0 + i * .16, i === 3 ? .5 : .17, 'square', .1)); },
};

export function efecto(nombre) {
  if (silencio || typeof window === 'undefined' || !crearContexto()) return;
  const sonar = () => EFECTOS[nombre](ctx.currentTime + .02);
  if (ctx.state === 'running') return sonar();
  /* Aún bloqueado por el navegador: solo suena si se desbloquea enseguida
     (así un efecto no sale tarde, fuera de lugar) */
  const t0 = performance.now();
  ctx.resume().then(() => { if (performance.now() - t0 < 400) sonar(); }).catch(() => {});
}

/* ---------- Botón de sonido y arranque ---------- */
const ICONO = on => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4 9v6h4l5 4V5L8 9H4z"/>${on ? '<path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>' : '<path d="M17 9.5l5 5M22 9.5l-5 5"/>'}</svg>`;

function pintarBoton(b) {
  b.innerHTML = ICONO(!silencio);
  b.setAttribute('aria-pressed', String(!silencio));
  b.title = silencio ? t('Activar sonido') : t('Silenciar');
  b.setAttribute('aria-label', b.title);
  b.classList.toggle('off', silencio);
}

/* Lo llama nav.js en todas las páginas, después de poner el botón de idioma */
export function montarAudio() {
  if (typeof document === 'undefined' || document.querySelector('.snd')) return;
  const mod = /\/modulos\/([\w-]+)\//.exec(location.pathname);
  nombrePista = PISTA_DE[mod ? mod[1] : 'inicio'] || 'principal';

  const caja = document.querySelector('.idioma'), b = document.createElement('button');
  b.className = 'snd'; b.type = 'button';
  pintarBoton(b);
  b.addEventListener('click', () => {
    silencio = !silencio;
    try { localStorage.setItem(CLAVE, silencio ? 'off' : 'on'); } catch { /* no se recuerda */ }
    pintarBoton(b);
    if (silencio) detener(); else arrancar();
  });
  if (caja) caja.prepend(b); else document.body.appendChild(b);

  /* Intenta sonar ya; si el navegador lo bloquea, espera al primer toque o tecla */
  arrancar();
  const gesto = () => { if (!silencio) arrancar(); };
  addEventListener('pointerdown', gesto, true);
  addEventListener('keydown', gesto, true);

  addEventListener('pagehide', () => {
    try { sessionStorage.setItem(SESION, JSON.stringify({pista: nombrePista, paso})); } catch { /* sin continuidad */ }
  });
  addEventListener('pageshow', e => { if (e.persisted && !silencio) arrancar(); });      // regreso con Atrás
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) detener(); else if (!silencio) arrancar();
  });
}

/* Solo para pruebas: da acceso al contexto y a la salida */
export const estadoAudio = () => ({ctx, salida, nombrePista, paso});
