/* ============================================================
   MISIONES: 2 categorías, 3 contratos cada una.
   Forma B: la órbita viene en el contrato, el jugador no la elige.
   need(instrumentos, seleccion) -> true si el diseño cumple el contrato.
   ============================================================ */
export const ORB  = {sso:'Heliosíncrona (SSO · 705 km)', leo:'Órbita baja (LEO · 540 km)', geo:'Geoestacionaria (GEO · 35 786 km)', l2:'Punto de Lagrange L2 (1.5 millones de km)'};
export const ORBS = {sso:'SSO', leo:'LEO', geo:'GEO', l2:'L2'};

export const CATEGORIAS = [
  {id:'ojo', n:'Ojo en la Tierra',    txt:'Satélites de observación terrestre inspirados en el sistema EOS de la NASA.'},
  {id:'tel', n:'Telescopio Espacial', txt:'Observatorios inspirados en TESS, Hubble, Roman y James Webb.'},
];

export const MISIONES = [
  {id:'o1',cat:'ojo',n:'Alerta rápida de incendios',orbit:'sso',budget:24,deadline:24,duty:.6,sciTarget:25,opsM:.15,cashUnit:.3,testBase:1.5,
   events:['fire','storm','comms','degr'],
   ctx:'Los incendios forestales de Norteamérica se propagan en horas. Un consorcio de bomberos quiere un satélite diminuto, tipo CubeSat, que detecte focos de calor desde una órbita que pase sobre la misma zona todos los días. Tienes poco dinero: cada gramo y cada dólar cuentan.',
   goal:'Detectar focos de calor con un satélite pequeño y barato.',
   need:i=>i.some(x=>x.calor), needTxt:'El contrato pide al menos un sensor que detecte focos de calor.',
   real:'Los CubeSats FireSat e Intuition-1, y la red EOS de la NASA.'},
  {id:'o2',cat:'ojo',n:'Mapa de salud del continente',orbit:'sso',budget:620,deadline:40,duty:.6,sciTarget:80,opsM:4,cashUnit:9,testBase:20,
   events:['fire','storm','comms','degr'],
   ctx:'Una agencia agrícola y ambiental necesita ver cómo cambian cultivos, bosques, agua y sequías en todo Norteamérica, cada día, con la misma luz. Necesitas varios instrumentos trabajando juntos, mantenerlos a su temperatura y una antena que baje todos esos datos sin saturarse.',
   goal:'Observar el continente con al menos dos instrumentos.',
   need:i=>i.length>=2, needTxt:'El contrato pide al menos dos instrumentos.',
   real:'Suomi NPP, Landsat 9, PACE y SWOT.'},
  {id:'o3',cat:'ojo',n:'Vigía geoestacionario',orbit:'geo',budget:720,deadline:48,duty:.6,sciTarget:60,opsM:6,cashUnit:12,testBase:30,
   events:['fire','storm','comms','degr'],
   ctx:'Un satélite polar ve un incendio solo cuando pasa por encima. Para vigilar 24 horas al día, el gobierno pide un satélite que se quede quieto sobre el continente, a casi 36 000 km. Es lejos: el cohete te deja a medio camino, así que necesitas un motor de apogeo que duplica tu peso y un cohete con boosters.',
   goal:'Vigilar el continente las 24 horas con un instrumento de alerta temprana.',
   need:i=>i.some(x=>x.id==='abi'), needTxt:'El contrato pide la cámara geoestacionaria ABI.',
   real:'GOES-16 a GOES-19, los satélites meteorológicos de la NOAA y la NASA.'},
  {id:'t1',cat:'tel',n:'Ventana al universo cercano',orbit:'leo',budget:1250,deadline:60,duty:.35,sciTarget:45,opsM:12,cashUnit:25,testBase:40,
   events:['micro','storm','comms','merge'],
   ctx:'Quieres un telescopio en órbita terrestre, sin la atmósfera que distorsiona la luz. Puedes ir por un cazador de exoplanetas ligero y barato, o por un observatorio con espejo de 2.4 m que fotografíe galaxias en luz visible y ultravioleta. Más ciencia cuesta más dinero y exige un apuntamiento mucho más fino.',
   goal:'Observar exoplanetas o galaxias desde órbita terrestre.',
   need:i=>i.length>0, needTxt:'El contrato pide al menos un instrumento astronómico.',
   real:'TESS (2018), Kepler y el Telescopio Espacial Hubble (1990).'},
  {id:'t2',cat:'tel',n:'Primeras estrellas en infrarrojo',orbit:'l2',budget:3300,deadline:110,duty:.35,sciTarget:60,opsM:30,cashUnit:50,testBase:100,
   events:['micro','storm','cryo','merge'],
   ctx:'La luz de las primeras galaxias llega estirada hasta el infrarrojo. Para verla necesitas sensores muy fríos, así que debes ir a L2, un punto a 1.5 millones de km donde la Tierra, la Luna y el Sol quedan del mismo lado. Allí no hay quién te repare, las antenas normales no alcanzan y la órbita es inestable.',
   goal:'Detectar luz infrarroja de galaxias lejanas desde L2.',
   need:i=>i.some(x=>x.ir), needTxt:'El contrato pide al menos un instrumento infrarrojo.',
   real:'El telescopio Nancy Grace Roman y el James Webb.'},
  {id:'t3',cat:'tel',n:'Observatorio de nueva generación',orbit:'l2',budget:4900,deadline:160,duty:.35,sciTarget:95,opsM:50,cashUnit:80,testBase:150,
   events:['micro','storm','cryo','merge'],
   ctx:'El máximo reto: un espejo de 6.5 m que se pliega como origami, un parasol de cinco capas, un criocooler de helio y varios instrumentos criogénicos. Cada decisión empuja los límites de masa, energía y confiabilidad, y solo una cofia extra larga puede llevarlo.',
   goal:'Explorar el universo temprano con el mayor poder científico posible.',
   need:i=>i.some(x=>x.id==='nircam')&&i.length>=2, needTxt:'El contrato pide el espejo origami de 6.5 m y al menos dos instrumentos.',
   real:'El Telescopio Espacial James Webb (JWST), lanzado en diciembre de 2021.'},
];

export const mision = id => MISIONES.find(m => m.id === id);
