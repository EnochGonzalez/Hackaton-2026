/* ============================================================
   DIBUJOS SVG: el satélite cambia con las piezas elegidas y el
   cohete se arma por partes. Dan y Fer pueden reemplazar estos
   trazos por ilustraciones propias sin tocar la lógica.
   ============================================================ */
import {t} from '../idioma/idioma.js';
const TR = 'stroke="#cbd5e1" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
const TR2 = TR.replace('2.5', '2');
const FANTASMA = 'stroke="#94a3b8" stroke-opacity=".7" stroke-width="2" stroke-dasharray="7 6" fill="rgba(255,255,255,.08)"';

function hexagono(cx, cy, r) {
  const p = [];
  for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + Math.PI / 6; p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
  return p.join(' ');
}

/* Satélite: o = resultado de calc(); cx, cy = centro; k = escala */
export function sateliteSVG(o, cx, cy, k) {
  const s = o.s;
  const esc = {cube:.66, micro:.72, ls2:.78, ls3:.9, gsfc:1, a2100:1.05, explorer:.7, hubble:1.1, jwst:1.15}[s.chasis] || 1.05;
  const w = 70 * esc * k, h = 110 * esc * k;
  let g = '';
  // Parasol
  if (s.termico.includes('sun')) g += `<path d="M${cx - w * 1.9} ${cy + h * .62} L${cx - w * .5} ${cy + h * .32} H${cx + w * .5} L${cx + w * 1.9} ${cy + h * .62} Z" fill="#0e7490" fill-opacity=".75" ${TR}/>
    <path d="M${cx - w * 1.5} ${cy + h * .57}H${cx + w * 1.5}M${cx - w * 1.1} ${cy + h * .52}H${cx + w * 1.1}M${cx - w * .8} ${cy + h * .47}H${cx + w * .8}" stroke="#bfdbfe" stroke-width="1.5"/>`;
  // Paneles solares (su ancho depende de los watts)
  if (o.en) {
    const ww = (18 + Math.sqrt(o.en.gen) * 1.6) * k * esc;
    [-1, 1].forEach(d => {
      const x = d < 0 ? cx - w / 2 - ww : cx + w / 2;
      g += `<rect x="${x}" y="${cy - h * .22}" width="${ww}" height="${h * .44}" fill="#1d4ed8" ${TR}/>`;
      for (let i = 1; i < 4; i++) g += `<path d="M${x + ww * i / 4} ${cy - h * .22}V${cy + h * .22}" stroke="#bfdbfe" stroke-width="1.5"/>`;
      g += `<path d="M${x} ${cy}H${x + ww}" stroke="#bfdbfe" stroke-width="1.5"/>`;
    });
  } else g += `<rect x="${cx - w / 2 - 28 * k}" y="${cy - h * .2}" width="${28 * k}" height="${h * .4}" ${FANTASMA}/><rect x="${cx + w / 2}" y="${cy - h * .2}" width="${28 * k}" height="${h * .4}" ${FANTASMA}/>`;
  // Chasis
  g += `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="6" ${s.chasis ? `fill="#1e293b" ${TR}` : FANTASMA}/>`;
  // Apuntamiento
  if (s.adcs) g += `<circle cx="${cx}" cy="${cy + h * .15}" r="${9 * esc * k}" fill="none" ${TR}/><path d="M${cx - 9 * esc * k} ${cy + h * .15}h${18 * esc * k}M${cx} ${cy + h * .15 - 9 * esc * k}v${18 * esc * k}" stroke="#bfdbfe" stroke-width="1.5"/>`;
  // Espejo (telescopios)
  const espejo = (o.ins.find(x => x.espejo) || {}).espejo;
  const ey = cy - h / 2 - 26 * k;
  if (espejo === 'mono') g += `<circle cx="${cx}" cy="${ey}" r="${30 * esc * k}" fill="#fde68a" ${TR}/><circle cx="${cx}" cy="${ey}" r="${10 * esc * k}" fill="none" ${TR}/>`;
  else if (espejo === 'seg') {
    const r = 11 * esc * k, oy = ey - 8 * k, pts = [[0, 0]];
    for (let q = -2; q <= 2; q++) for (let rr = -2; rr <= 2; rr++) if (Math.abs(q + rr) <= 2 && !(q === 0 && rr === 0)) pts.push([q, rr]);
    pts.forEach(([q, rr]) => { g += `<polygon points="${hexagono(cx + r * 1.75 * (q + rr / 2), oy + r * 1.5 * rr, r)}" fill="#fbbf24" ${TR2}/>`; });
  } else if (o.M.cat === 'tel' && !o.ins.length) g += `<circle cx="${cx}" cy="${ey}" r="${26 * esc * k}" ${FANTASMA}/>`;
  // Instrumentos
  const n = o.ins.length;
  o.ins.forEach((it, i) => {
    const bw = Math.min(w * .8 / n, 28 * k), x = cx - (bw * n + 6 * (n - 1)) / 2 + i * (bw + 6);
    g += `<rect x="${x}" y="${cy - h * .38}" width="${bw}" height="${h * .2}" fill="#f59e0b" ${TR2}/><circle cx="${x + bw / 2}" cy="${cy - h * .28}" r="${Math.min(5 * k, bw / 3)}" fill="#0f172a"/>`;
  });
  if (!n) g += `<rect x="${cx - w * .36}" y="${cy - h * .38}" width="${w * .72}" height="${h * .2}" ${FANTASMA}/>`;
  // Antena
  if (o.cm) {
    const r = o.cm.mbps >= 300 ? 16 : 9, ax = cx + w / 2 + 16 * k, ay = cy - h * .3 - 12 * k;
    g += `<path d="M${cx + w / 2} ${cy - h * .3}l${14 * k} ${-10 * k}" ${TR}/><ellipse cx="${ax}" cy="${ay}" rx="${r * k}" ry="${r * .45 * k}" transform="rotate(-35 ${ax} ${ay})" fill="#e2e8f0" ${TR}/>`;
  }
  // Propulsión
  if (o.pr) g += `<path d="M${cx - 8 * k} ${cy + h / 2}l-5 ${14 * k}h${26 * k}l-5 ${-14 * k}z" fill="#475569" ${TR}/>`;
  return g;
}

export const naveSVG = o => `<svg viewBox="0 0 400 560">${sateliteSVG(o, 200, 320, 1.15)}</svg>`;

/* Cohete armado por partes. activo = parte que se está eligiendo (f1, boosters, etapa, cofia); etiquetas = mostrar los nombres */
export function coheteSVG(o, activo, etiquetas = true) {
  const K = 1.35, cx = 165, base = 596, {f1, bo, et, co} = o;      // K = escala del dibujo
  const cw = (f1 ? f1.ancho : 44) * K, chh = (f1 ? f1.alto : 230) * K, yCore = base - chh;
  const eh = 46 * K, ew = cw * .92, yEt = yCore - eh;
  const fw = co ? Math.max(cw * .8, (co.diam * 11 + 10) * K) : cw, fh = (co ? 46 + co.diam * 9 + (co.largo ? 40 : 0) : 80) * K, yCo = yEt - fh;
  let g = '';
  // Boosters
  if (bo && bo.num) {
    const porLado = bo.num <= 2 ? 1 : bo.num <= 4 ? 2 : 3, bw = bo.ancho * K, bh = bw >= 40 ? chh * .96 : chh * .6;
    [-1, 1].forEach(d => { for (let j = 0; j < porLado; j++) {
      const x = d < 0 ? cx - cw / 2 - (bw + 2) * (j + 1) : cx + cw / 2 + 2 + (bw + 2) * j;
      g += `<path d="M${x} ${base - bh + bw * .7}q${bw / 2} ${-bw * 1.4} ${bw} 0V${base}H${x}z" fill="#334155" ${TR2}/><path d="M${x + bw * .2} ${base}l${bw * .3} 9l${bw * .3} -9" fill="#f59e0b" stroke="#cbd5e1" stroke-width="1.5"/>`;
    } });
  } else if (!bo) g += `<rect x="${cx - cw / 2 - 16}" y="${base - chh * .55}" width="12" height="${chh * .55}" ${FANTASMA}/><rect x="${cx + cw / 2 + 4}" y="${base - chh * .55}" width="12" height="${chh * .55}" ${FANTASMA}/>`;
  // Fase 1
  if (f1) g += `<rect x="${cx - cw / 2}" y="${yCore}" width="${cw}" height="${chh}" fill="#1e293b" ${TR}/><path d="M${cx - cw / 2} ${yCore + chh * .35}H${cx + cw / 2}M${cx - cw / 2} ${yCore + chh * .7}H${cx + cw / 2}" stroke="#94a3b8" stroke-width="1.5"/>
    <path d="M${cx - cw / 2} ${base - 30}l${-cw * .3} 30h${cw * .3}zM${cx + cw / 2} ${base - 30}l${cw * .3} 30h${-cw * .3}z" fill="#475569" ${TR2}/><path d="M${cx - cw * .25} ${base}l${cw * .25} 16l${cw * .25} -16z" fill="#f59e0b" stroke="#cbd5e1" stroke-width="2"/>`;
  else g += `<rect x="${cx - cw / 2}" y="${yCore}" width="${cw}" height="${chh}" ${FANTASMA}/>`;
  // Etapa superior
  g += `<rect x="${cx - ew / 2}" y="${yEt}" width="${ew}" height="${eh}" ${et ? `fill="#27364f" ${TR}` : FANTASMA}/>`;
  if (et) g += `<path d="M${cx - ew / 2} ${yEt + eh - 10}H${cx + ew / 2}" stroke="#94a3b8" stroke-width="1.5"/>`;
  // Cofia
  const cofia = `M${cx - fw / 2} ${yEt}V${yCo + fh * .45}Q${cx - fw / 2} ${yCo} ${cx} ${yCo}Q${cx + fw / 2} ${yCo} ${cx + fw / 2} ${yCo + fh * .45}V${yEt}z`;
  g += `<path d="${cofia}" ${co ? `fill="#e2e8f0" fill-opacity=".9" ${TR}` : FANTASMA}/>`;
  if (co) g += `<path d="M${cx} ${yCo}V${yEt}" stroke="#64748b" stroke-width="1.5"/>`;
  // Etiquetas
  const et2 = (y, clave, texto, listo) => `<g><path d="M${cx + 84} ${y}H${cx + 108}" stroke="${activo === clave ? '#38bdf8' : '#64748b'}" stroke-width="1.5"/><text x="${cx + 114}" y="${y + 4}" font-size="12" font-weight="800" letter-spacing="1.5" fill="${activo === clave ? '#38bdf8' : listo ? '#e6ebf4' : '#8f9db4'}">${texto}${listo ? ' ✓' : ''}</text></g>`;
  if (etiquetas) g += et2(yCo + fh * .5, 'cofia', t('COFIA'), !!co) + et2(yEt + eh / 2, 'etapa', t('FASE 2'), !!et) + et2(yCore + chh * .4, 'f1', t('FASE 1'), !!f1) + et2(base - 26, 'boosters', t('BOOSTERS'), !!bo);
  return `<svg viewBox="${etiquetas ? '0 0 400 620' : '25 0 280 620'}" font-family="Nunito,sans-serif">${g}</svg>`;
}

/* Cohete del inicio (plano técnico). La llama lleva la clase "fl" para animarla. */
export function heroeSVG() {
  const L = 'stroke="#38bdf8" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
  const CUERPO = 'fill="url(#heroCuerpo)"', ALA = 'fill="url(#heroAla)"';
  return `<svg class="hero" viewBox="0 0 420 800">
   <defs>
    <linearGradient id="heroCuerpo" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#0c2038"/><stop offset=".45" stop-color="#143457"/><stop offset="1" stop-color="#0a1a2e"/></linearGradient>
    <linearGradient id="heroAla" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#11294a"/><stop offset="1" stop-color="#0a1626"/></linearGradient>
    <radialGradient id="heroVentana"><stop offset="0" stop-color="#bae6fd"/><stop offset=".55" stop-color="#38bdf8" stop-opacity=".55"/><stop offset="1" stop-color="#0c2038"/></radialGradient>
    <linearGradient id="heroLlama" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset=".5" stop-color="#fbbf24" stop-opacity=".85"/><stop offset="1" stop-color="#f97316" stop-opacity="0"/></linearGradient>
    <radialGradient id="heroBrillo"><stop offset="0" stop-color="#fbbf24" stop-opacity=".45"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></radialGradient>
   </defs>
   <ellipse cx="210" cy="700" rx="120" ry="70" fill="url(#heroBrillo)"/>
   <g class="fl"><path d="M170 680q40 120 80 0z" fill="url(#heroLlama)"/><path d="M190 680q20 62 40 0z" fill="#fef3c7" fill-opacity=".85"/></g>
   <g ${L}>
    <path d="M140 340q-58 24-68 118v156h68zM280 340q58 24 68 118v156h-68z" ${ALA}/>
    <path d="M140 566l-62 108h62zM280 566l62 108h-62z" ${ALA}/>
    <path d="M168 610h84l14 70H154z" ${CUERPO}/>
    <path d="M210 24q70 78 70 214v372H140V238Q140 102 210 24z" ${CUERPO}/>
    <path d="M140 238h140M140 470h140M140 520h140" fill="none"/>
    <path d="M210 24v214" fill="none" stroke-opacity=".45"/>
    <path d="M152 262v190" fill="none" stroke="#7dd3fc" stroke-opacity=".28" stroke-width="5"/>
    <circle cx="210" cy="330" r="30" fill="#0a1a2e"/><circle cx="210" cy="330" r="21" fill="url(#heroVentana)" stroke-opacity=".6"/>
    <circle cx="210" cy="410" r="13" fill="#0a1a2e"/><circle cx="210" cy="410" r="6" fill="#38bdf8" fill-opacity=".5" stroke="none"/>
   </g></svg>`;
}

