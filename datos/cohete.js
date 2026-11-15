/* ============================================================
   COHETE POR PARTES (Parte 8 dividida en 4 secciones)
   Fuente: catálogo de Alarcón, secciones 1, 5, 6 y 7.
   Se arma de abajo hacia arriba: Fase 1 -> Boosters -> Etapa superior -> Cofia.
   La Fase 1 decide qué boosters, etapas y cofias son compatibles.

   caps: capacidad en kg hacia cada órbita, según los boosters elegidos.
   ============================================================ */
export const FASE1 = [
  {id:'electron',n:'Cuerpo Rocket Lab Electron',c:5,rel:.94,alto:150,ancho:26,
   caps:{none:{sso:200,leo:300,geo:0,l2:0}},etapas:['curie'],cofias:['c12'],
   txt:'9 motores Rutherford. El más barato y rápido, exclusivo para CubeSats. CAPSTONE, PREFIRE, TROPICS.'},
  {id:'minotaur',n:'Cuerpo sólido Minotaur IV',c:28,rel:.98,alto:190,ancho:34,
   caps:{none:{sso:1100,leo:1735,geo:0,l2:0}},etapas:['orion'],cofias:['c20'],
   txt:'Tres etapas de combustible sólido. Sin tanques criogénicos: listo en pocos meses. Para microsatélites.'},
  {id:'delta2',n:'Cuerpo Delta II 7000',c:38,rel:.989,alto:220,ancho:36,
   caps:{none:{sso:900,leo:2700,geo:0,l2:0},gem3:{sso:1500,leo:3500,geo:900,l2:0},gem4:{sso:2100,leo:4200,geo:1100,l2:0},gem9:{sso:3180,leo:6100,geo:1800,l2:0}},
   etapas:['deltak'],cofias:['c30'],
   txt:'El cohete clásico de Ojo en la Tierra: lanzó Terra, Aqua, Suomi NPP e ICESat-2. Gana capacidad con boosters GEM-40.'},
  {id:'falcon9',n:'Cuerpo Falcon 9 Block 5',c:45,rel:.995,alto:260,ancho:44,
   caps:{none:{sso:15000,leo:17500,geo:8300,l2:4200},fh2:{sso:30000,leo:63800,geo:26700,l2:16800}},
   etapas:['merlin'],cofias:['c54'],
   txt:'9 motores Merlin, reutilizable. La mejor relación costo/masa. Con 2 núcleos laterales se convierte en Falcon Heavy.'},
  {id:'atlas',n:'Cuerpo Atlas V / Vulcan',c:65,rel:.995,alto:250,ancho:46,
   caps:{none:{sso:8900,leo:9800,geo:3800,l2:3400},aj2:{sso:11200,leo:14000,geo:6500,l2:4700},aj4:{sso:13500,leo:17400,geo:8290,l2:6000}},
   etapas:['centaur'],cofias:['c40','c54'],
   txt:'Permite graduar el empuje con 0, 2 o 4 boosters sólidos. Landsat 8 y 9, GOES-16/17/18.'},
  {id:'ariane',n:'Cuerpo central Ariane 5',c:75,rel:.985,alto:240,ancho:60,
   caps:{none:{sso:0,leo:0,geo:0,l2:0},eap2:{sso:18000,leo:21000,geo:10800,l2:6600}},
   etapas:['esca'],cofias:['c54','c54L'],
   txt:'Especializado en cargas de gran diámetro hacia órbitas altas y L2. No despega sin sus 2 boosters gigantes. James Webb.'},
  {id:'delta4',n:'Cuerpo criogénico Delta IV',c:85,rel:.98,alto:260,ancho:56,
   caps:{none:{sso:7500,leo:9400,geo:4200,l2:3000},cbc2:{sso:23000,leo:28790,geo:14220,l2:10000}},
   etapas:['dcss'],cofias:['c54'],
   txt:'Hidrógeno líquido. Para misiones pesadas en GEO y espacio profundo. GOES-N/O/P, Parker Solar Probe.'},
];

export const BOOSTERS = [
  {id:'none',n:'Sin boosters',c:0,num:0,txt:'La capacidad base de la Fase 1. Landsat 9, SWOT y PACE despegaron así.'},
  {id:'gem3',n:'3 × GEM-40',c:7.5,num:3,ancho:9,txt:'Sólidos para Delta II (7320). Los usó OCO-2.'},
  {id:'gem4',n:'4 × GEM-40',c:10,num:4,ancho:9,txt:'Sólidos para Delta II (7420). Los usó ICESat-2.'},
  {id:'gem9',n:'9 × GEM-40',c:22.5,num:9,ancho:9,txt:'Sólidos para Delta II (7920). Los usaron Suomi NPP y Aqua.'},
  {id:'aj2',n:'2 × AJ-60A',c:14,num:2,ancho:13,txt:'Sólidos para Atlas V. Suben la capacidad hacia GEO.'},
  {id:'aj4',n:'4 × AJ-60A',c:28,num:4,ancho:13,txt:'Configuración Atlas V 541: la que llevó los GOES a órbita geoestacionaria.'},
  {id:'eap2',n:'2 × EAP P241',c:35,num:2,ancho:28,txt:'Boosters gigantes del Ariane 5: dan 90% del empuje al despegue. Obligatorios.'},
  {id:'fh2',n:'2 × núcleos Falcon Heavy',c:45,num:2,ancho:44,txt:'Dos núcleos de Falcon 9 a los lados. Lanzó GOES-19 y lanzará el Roman.'},
  {id:'cbc2',n:'2 × núcleos CBC',c:140,num:2,ancho:56,txt:'Configuración Delta IV Heavy. Lanzó Parker Solar Probe.'},
];

export const ETAPAS = [
  {id:'curie',n:'Curie / Photon',c:2.5,isp:310,txt:'Etapa de Electron. Coloca CubeSats en su órbita exacta.'},
  {id:'orion',n:'Etapa sólida Orion 38',c:6,isp:289,txt:'Etapa sólida simple y económica para satélites pequeños.'},
  {id:'deltak',n:'Delta-K hipergólica',c:12,isp:319,txt:'Combustible almacenable que se reenciende varias veces en órbita polar.'},
  {id:'merlin',n:'Merlin 1D Vacuum',c:15,isp:348,txt:'Altísimo empuje y bajo costo. SWOT, PACE, TESS.'},
  {id:'centaur',n:'Centaur criogénica',c:30,isp:450,txt:'Máxima precisión de inyección gracias a su motor RL10.'},
  {id:'esca',n:'ESC-A criogénica',c:40,isp:446,txt:'Su inyección en L2 fue tan exacta que duplicó la vida útil del James Webb.'},
  {id:'dcss',n:'DCSS / ICPS',c:55,isp:462,txt:'El mayor impulso específico químico en servicio.'},
];

export const COFIAS = [
  {id:'c12',n:'Cofia compacta 1.2 m',c:.8,diam:1.2,txt:'Solo admite CubeSats o microsatélites compactos.'},
  {id:'c20',n:'Cofia ligera 2.0 m',c:2.2,diam:2,txt:'Para microsatélites y buses pequeños.'},
  {id:'c30',n:'Cofia compuesta 3.0 m',c:3.5,diam:3,txt:'Para satélites medianos con un instrumento grande. ICESat-2, OCO-2.'},
  {id:'c40',n:'Cofia estándar 4.0 m',c:5,diam:4,txt:'Estándar para plataformas medianas y pesadas. Landsat 8 y 9, Terra.'},
  {id:'c54',n:'Cofia ancha 5.4 m',c:7.5,diam:5.4,txt:'Para radares con antenas desplegables, satélites geoestacionarios y telescopios rígidos.'},
  {id:'c54L',n:'Cofia gigante 5.4 × 17 m',c:10,diam:5.4,largo:1,txt:'La única con altura suficiente para el James Webb y su parasol plegados.'},
];

export const PARTES_COHETE = {f1:FASE1, boosters:BOOSTERS, etapa:ETAPAS, cofia:COFIAS};
export const ORDEN_COHETE = ['f1','boosters','etapa','cofia'];
export const parteCohete = (cat, id) => (PARTES_COHETE[cat] || []).find(x => x.id === id) || null;

/* Capacidad en kg del cohete armado hacia una órbita (0 si falta algo o no llega) */
export function capacidad(sel, orbita) {
  const f1 = parteCohete('f1', sel.f1);
  if (!f1 || !sel.boosters || !sel.etapa) return 0;
  const caps = f1.caps[sel.boosters];
  return caps ? caps[orbita] || 0 : 0;
}
