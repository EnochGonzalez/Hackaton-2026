/* ============================================================
   CATÁLOGO DE PIEZAS DEL SATÉLITE (Partes 1 a 7)
   Fuente: "Catálogo Modular en 8 Partes" de Alarcón (NASA / ESA / NOAA).
   Para agregar una pieza, copia un renglón y cambia sus valores.

   Campos:
     cat      categoría: chasis | energia | instr | termico | adcs | comms | prop
     id       identificador único (se guarda en la partida)
     n        nombre que ve el jugador
     only     'ojo' o 'tel' si solo sirve en un tipo de misión
     orb      órbitas donde funciona: sso, leo, geo, l2 (sin campo = todas)
     m        masa en kg            w     consumo en W
     gen      potencia generada (W) mbps  datos generados o enviados (Mbps)
     c        costo en MDD          t     meses de construcción
     rel      puntos que suma o resta a la confiabilidad
     txt      texto que se muestra al pasar el cursor
   Solo chasis:   slots (instrumentos que caben), diam (m), maxS (kg máx. por instrumento)
   Solo instr:    sci (puntos de ciencia), temp (K que exige), prec (precisión de apuntamiento que exige, 1 a 4),
                  calor (detecta focos de calor), ir (infrarrojo), needs (soporte térmico obligatorio), largo (exige cofia extra larga)
   Solo termico:  tempMin (K que logra)
   Solo adcs:     prec (precisión que da, 1 a 4)
   Solo prop:     minGen (W mínimos de paneles)
   ============================================================ */
export const PIEZAS = [
  // ---------- PARTE 1: CHASIS ----------
  {cat:'chasis',id:'cube',n:'Chasis CubeSat 6U / 12U',only:'ojo',orb:['sso','leo'],m:8,w:5,c:1.5,t:3,slots:1,diam:.3,maxS:10,
   txt:'Muy barato y ligero. Solo admite un sensor miniatura en órbita baja. Misiones: FireSat, TROPICS, PREFIRE.'},
  {cat:'chasis',id:'micro',n:'Chasis Microsatélite BCP-100',only:'ojo',orb:['sso','leo'],m:65,w:25,c:12,t:6,slots:2,diam:1,maxS:60,
   txt:'Hasta 2 sensores ligeros. Ideal para presupuestos bajos. Misiones: CYGNSS, GPIM.'},
  {cat:'chasis',id:'ls2',n:'Chasis Estándar LEOStar-2',only:'ojo',orb:['sso','leo'],m:380,w:60,c:30,t:9,slots:2,diam:1.8,maxS:300,
   txt:'Dos sensores medianos. Estructura probada y económica para órbita polar. Misiones: EO-1, OCO-2.'},
  {cat:'chasis',id:'ls3',n:'Chasis Avanzado LEOStar-3',only:'ojo',orb:['sso','leo'],m:780,w:110,c:50,t:12,slots:3,diam:2.5,maxS:600,
   txt:'Hasta 3 sensores grandes. Soporta cámaras pesadas y lidares. Misiones: Landsat 8 y 9, ICESat-2, Suomi NPP.'},
  {cat:'chasis',id:'gsfc',n:'Chasis Modular NASA GSFC',only:'ojo',orb:['sso','leo'],m:1050,w:140,c:70,t:15,slots:3,diam:3.2,maxS:1300,
   txt:'Tres sensores, admite radar y antenas desplegables. Misiones: PACE, GPM, NISAR.'},
  {cat:'chasis',id:'a2100',n:'Chasis Geoestacionario A2100',only:'ojo',orb:['geo'],m:1450,w:180,c:100,t:18,slots:4,diam:3.8,maxS:600,
   txt:'Cuatro sensores pesados y redundancia total para 15 años en GEO. Misiones: GOES-16 a GOES-19.'},
  {cat:'chasis',id:'explorer',n:'Chasis Astronómico Explorer',only:'tel',orb:['leo'],m:160,w:40,c:45,t:10,slots:1,diam:1.5,maxS:500,
   txt:'Un paquete de cámaras. Un cazador de exoplanetas por una fracción del costo de un gran observatorio. Misión: TESS.'},
  {cat:'chasis',id:'hubble',n:'Chasis de Observatorio Rígido (Hubble / Roman)',only:'tel',orb:['leo','l2'],m:1850,w:220,c:170,t:18,slots:3,diam:4.2,maxS:1000,
   txt:'Cilindro rígido que protege un espejo de 2.4 m sin pliegues. Misiones: Hubble, Nancy Grace Roman.'},
  {cat:'chasis',id:'jwst',n:'Chasis Criogénico de Grafito (JWST)',only:'tel',orb:['l2'],m:1050,w:240,c:320,t:24,slots:4,diam:4.5,maxS:1200,largo:1,
   txt:'Compuesto que no se deforma a -233 °C. Va plegado: exige la cofia extra larga. Misión: James Webb.'},

  // ---------- PARTE 2: ENERGÍA ----------
  {cat:'energia',id:'e60',n:'Paneles CubeSat (60 W)',only:'ojo',gen:60,m:2.5,c:.5,t:2,
   txt:'Solo alimenta un CubeSat con una cámara compacta y radio de baja potencia.'},
  {cat:'energia',id:'e430',n:'Doble ala pequeña (430 W)',gen:430,m:18,c:5,t:4,
   txt:'Suficiente para las 4 cámaras de TESS o un satélite ligero.'},
  {cat:'energia',id:'e1000',n:'Paneles fijos en el cuerpo (1 000 W)',gen:1000,m:55,c:12,t:6,rel:2,
   txt:'Pegados al chasis, sin bisagras: es imposible que fallen al desplegarse. Suben la confiabilidad.'},
  {cat:'energia',id:'e1500',n:'Ala solar articulada (1 500 W)',only:'ojo',gen:1500,m:135,c:18,t:8,
   txt:'El estándar de Ojo en la Tierra: gira para seguir al Sol y soporta eclipses de 35 minutos. Landsat 9, ICESat-2, PACE.'},
  {cat:'energia',id:'e2000',n:'Ala solar Tail-Dragger (2 000 W)',only:'tel',orb:['l2'],gen:2000,m:150,c:28,t:10,
   txt:'Ala de 6 m en la cola del observatorio. En L2 nunca hay eclipses: 2 000 W continuos sin vibrar. James Webb.'},
  {cat:'energia',id:'e2400',n:'Paneles dobles simétricos (2 400 W)',gen:2400,m:190,c:26,t:9,
   txt:'Dos alas desplegables. Alimentan el radar KaRIn o un telescopio en órbita baja. Hubble, SWOT.'},
  {cat:'energia',id:'e4000',n:'Doble ala de alta potencia (4 000 W)',only:'ojo',gen:4000,m:290,c:38,t:12,
   txt:'Obligatoria para el radar SAR (2 100 W) o para satélites geoestacionarios con varios instrumentos. NISAR, GOES-R.'},

  // ---------- PARTE 3: SENSORES · Ojo en la Tierra ----------
  {cat:'instr',id:'fire',n:'Cámara infrarroja térmica compacta (FireSat)',only:'ojo',orb:['sso','leo'],m:4.5,w:18,mbps:15,c:3,t:4,sci:25,temp:270,prec:1,calor:1,
   txt:'Detecta focos de calor en franjas de 40 km desde un CubeSat. Las nubes densas la bloquean.'},
  {cat:'instr',id:'hyperion',n:'Espectrómetro hiperespectral Hyperion (EO-1)',only:'ojo',orb:['sso','leo'],m:49,w:78,mbps:105,c:22,t:7,sci:30,prec:2,
   txt:'220 bandas con 30 m de resolución. Detecta estrés hídrico en árboles antes de un incendio. Trae su enfriador integrado.'},
  {cat:'instr',id:'airs',n:'Sonda infrarroja atmosférica AIRS / CrIS',only:'ojo',m:165,w:125,mbps:2.5,c:65,t:12,sci:30,temp:150,prec:2,
   txt:'Mide en 3D temperatura, humedad, monóxido de carbono de incendios, metano y CO2.'},
  {cat:'instr',id:'modis',n:'Espectrorradiómetro MODIS (Terra / Aqua)',only:'ojo',orb:['sso','leo'],m:229,w:162.5,mbps:10.6,c:75,t:13,sci:45,temp:85,prec:2,calor:1,
   txt:'36 bandas y barrido de 2 330 km. Mapea todos los incendios activos del planeta cada 24 a 48 horas.'},
  {cat:'instr',id:'viirs',n:'Radiómetro multiespectral VIIRS (Suomi NPP)',only:'ojo',orb:['sso','leo'],m:252,w:200,mbps:12.5,c:85,t:14,sci:50,temp:80,prec:2,calor:1,
   txt:'22 bandas y barrido de 3 060 km sin huecos. Fotografía humo e incendios en plena noche.'},
  {cat:'instr',id:'oci',n:'Espectrómetro oceánico OCI (PACE)',only:'ojo',orb:['sso','leo'],m:272,w:236.5,mbps:35,c:110,t:16,sci:40,temp:208,prec:2,
   txt:'Del ultravioleta al infrarrojo: mide fitoplancton marino y aerosoles de humo.'},
  {cat:'instr',id:'karin',n:'Interferómetro radar KaRIn (SWOT)',only:'ojo',orb:['sso','leo'],m:294,w:550,mbps:360,c:150,t:19,sci:45,temp:290,prec:3,
   txt:'Despliega un mástil de 10 m para medir la altura del agua en ríos, embalses y océanos. Exige antena rápida.'},
  {cat:'instr',id:'atlas',n:'Altímetro láser ATLAS (ICESat-2)',only:'ojo',orb:['sso','leo'],m:298,w:300,mbps:220,c:145,t:18,sci:45,temp:293,prec:3,
   txt:'10 000 pulsos láser por segundo para medir el deshielo de glaciares y la biomasa de los bosques.'},
  {cat:'instr',id:'abi',n:'Cámara geoestacionaria ABI (GOES-R)',only:'ojo',orb:['geo'],m:338,w:470,mbps:66,c:140,t:18,sci:60,temp:60,prec:3,calor:1,
   txt:'Exige órbita GEO. Fotografía el continente cada 5 minutos y las zonas de incendio cada 30 segundos.'},
  {cat:'instr',id:'oli',n:'Cámaras OLI-2 + TIRS-2 (Landsat 9)',only:'ojo',orb:['sso','leo'],m:560,w:490,mbps:384,c:165,t:20,sci:50,temp:43,prec:3,
   txt:'15 a 30 m por píxel en visible e infrarrojo térmico: deforestación, sequía y uso de agua. Exige criocooler.'},
  {cat:'instr',id:'sar',n:'Radar de apertura sintética SAR (NISAR)',only:'ojo',orb:['sso','leo'],m:1200,w:2100,mbps:300,c:350,t:24,sci:55,temp:285,prec:2,needs:['loop'],
   txt:'Atraviesa nubes, lluvia y humo: inundaciones, deslaves y terremotos de día y de noche. Muy pesado y hambriento de energía.'},

  // ---------- PARTE 3: SENSORES · Telescopio Espacial ----------
  {cat:'instr',id:'tess',n:'4 cámaras CCD de campo amplio (TESS)',only:'tel',orb:['leo'],m:47,w:75,mbps:19,c:70,t:12,sci:30,temp:198,prec:3,
   txt:'Vigila 200 000 estrellas brillantes buscando caídas de luz cuando un exoplaneta pasa frente a su estrella.'},
  {cat:'instr',id:'kepler',n:'Fotómetro estelar de 95 megapíxeles (Kepler)',only:'tel',orb:['leo'],m:478,w:120,mbps:4.3,c:180,t:16,sci:35,temp:210,prec:3,
   txt:'Espejo de 1.4 m que vigila 150 000 estrellas para encontrar planetas rocosos del tamaño de la Tierra.'},
  {cat:'instr',id:'wfc3',n:'Espejo rígido 2.4 m + cámaras visible/UV (Hubble)',only:'tel',orb:['leo'],m:950,w:210,mbps:18,c:420,t:22,sci:55,temp:294,prec:4,espejo:'mono',
   txt:'Galaxias, nebulosas y planetas en luz visible y ultravioleta. No necesita criogenia extrema.'},
  {cat:'instr',id:'roman',n:'Espejo rígido 2.4 m + cámara infrarroja WFI (Roman)',only:'tel',orb:['l2'],m:736,w:280,mbps:500,c:550,t:26,sci:65,temp:95,prec:4,ir:1,espejo:'mono',
   txt:'Campo de visión 100 veces mayor que el del Hubble en infrarrojo cercano, con coronógrafo para fotografiar exoplanetas.'},
  {cat:'instr',id:'nircam',n:'Espejo origami 6.5 m + NIRCam / NIRSpec (James Webb)',only:'tel',orb:['l2'],m:1092,w:205,mbps:28,c:1600,t:32,sci:80,temp:40,prec:4,ir:1,rel:-8,needs:['sun'],largo:1,espejo:'seg',
   txt:'18 hexágonos de berilio y oro plegables. Ve las primeras estrellas tras el Big Bang. Exige parasol y cofia extra larga; el despliegue resta confiabilidad.'},
  {cat:'instr',id:'miri',n:'Cámara de infrarrojo medio MIRI (James Webb)',only:'tel',orb:['l2'],m:110,w:55,mbps:15,c:450,t:28,sci:30,temp:6.7,prec:4,ir:1,
   txt:'Ve a través de las nubes de polvo donde nacen los sistemas solares. Se ciega por completo sin el criocooler de helio.'},

  // ---------- PARTE 4: SOPORTE TÉRMICO (se pueden combinar) ----------
  {cat:'termico',id:'mli',n:'Mantas MLI + calentadores',m:10,w:15,c:1,t:2,tempMin:270,
   txt:'Mantiene de 270 a 300 K. Suficiente para cámaras ópticas simples, lidares y radares.'},
  {cat:'termico',id:'rad',n:'Radiadores pasivos + heat pipes',m:45,w:25,c:12,t:5,tempMin:80,
   txt:'Enfría hasta 80 K sin piezas móviles. Estándar para VIIRS, MODIS, OCI, AIRS, TESS y Roman.'},
  {cat:'termico',id:'loop',n:'Lazo fluido activo (NISAR)',only:'ojo',m:85,w:90,c:22,t:7,tempMin:270,
   txt:'Obligatorio con el radar SAR: sin él, la electrónica del radar se funde por su propio calor.'},
  {cat:'termico',id:'stirling',n:'Criocooler Stirling de 1 etapa',only:'ojo',m:22,w:120,c:28,t:9,tempMin:40,
   txt:'Enfría de 40 a 60 K. Obligatorio para las cámaras TIRS-2 (Landsat 9) y ABI (GOES-R).'},
  {cat:'termico',id:'sun',n:'Parasol desplegable de 5 capas (JWST)',only:'tel',orb:['l2'],m:350,w:0,c:500,t:30,tempMin:40,rel:-8,
   txt:'Enfría de +85 °C a -233 °C. Solo funciona en L2, donde el Sol, la Tierra y la Luna quedan del mismo lado. Su despliegue resta confiabilidad.'},
  {cat:'termico',id:'helio',n:'Criocooler de helio de ciclo cerrado (MIRI)',only:'tel',m:48,w:400,c:65,t:14,tempMin:6.7,
   txt:'Bombea helio ultrafrío hasta 6.7 K, cerca del cero absoluto. Obligatorio para MIRI.'},

  // ---------- PARTE 5: APUNTAMIENTO ----------
  {cat:'adcs',id:'mag',n:'Barras magnéticas + sensores solares',only:'ojo',orb:['sso','leo'],m:1.2,w:4,c:.6,t:2,prec:1,
   txt:'Usa el campo magnético de la Tierra. Precisión baja (±0.5° a ±2°).'},
  {cat:'adcs',id:'nadir',n:'ADCS Nadir estándar (3 ruedas)',only:'ojo',orb:['sso','leo'],m:22,w:45,c:9,t:5,prec:2,
   txt:'Mantiene las cámaras climáticas apuntando siempre al suelo (±0.01°).'},
  {cat:'adcs',id:'nadirP',n:'ADCS Nadir ultrapreciso (láser + GPS doble)',only:'ojo',orb:['sso','leo'],m:38,w:75,c:18,t:8,prec:3,
   txt:'Obligatorio para ATLAS, KaRIn y Landsat 9: sin él, los láseres o los píxeles de 15 m pierden su objetivo.'},
  {cat:'adcs',id:'geoA',n:'ADCS geoestacionario con aislamiento',only:'ojo',orb:['geo'],m:55,w:95,c:25,t:10,prec:3,
   txt:'Permite apuntar a un incendio de pocos kilómetros desde 35 786 km sin que las ruedas muevan la imagen.'},
  {cat:'adcs',id:'inercial',n:'Apuntamiento inercial (star trackers + 4 ruedas)',only:'tel',m:28,w:60,c:20,t:8,prec:3,
   txt:'En vez de mirar a la Tierra, mantiene el telescopio clavado en una constelación durante semanas. TESS, Kepler.'},
  {cat:'adcs',id:'fgs',n:'Sensor de Guía Fina + 6 ruedas aisladas',only:'tel',m:145,w:180,c:160,t:16,prec:4,
   txt:'Una millonésima de grado. Obligatorio para espejos de 2.4 m y 6.5 m: sin él, las galaxias salen borrosas.'},

  // ---------- PARTE 6: COMUNICACIONES ----------
  {cat:'comms',id:'uhf',n:'Antena parche UHF / Banda S',only:'ojo',orb:['sso','leo'],m:1.5,w:12,mbps:15,c:1.5,t:2,
   txt:'Hasta 15 Mbps. Suficiente solo para la cámara compacta o la sonda AIRS.'},
  {cat:'comms',id:'kaC',n:'Antena Banda Ka de corto alcance (TESS)',only:'tel',orb:['leo'],m:12,w:40,mbps:100,c:8,t:4,
   txt:'100 Mbps para descargar datos cuando el telescopio pasa cerca de la Tierra.'},
  {cat:'comms',id:'x',n:'Transmisor Banda X + grabadora 704 Gbit',only:'ojo',orb:['sso','leo','geo'],m:26,w:85,mbps:300,c:16,t:6,
   txt:'300 Mbps. El estándar de los satélites polares de la NASA.'},
  {cat:'comms',id:'xka',n:'Banda X/Ka + grabadora de 2.3 TB',only:'ojo',orb:['sso','leo','geo'],m:38,w:115,mbps:600,c:24,t:8,
   txt:'600 Mbps. Obligatorio para Landsat 9, KaRIn y SAR, que generan terabits cada día.'},
  {cat:'comms',id:'dsn',n:'Antena parabólica de espacio profundo (Ka)',only:'tel',orb:['l2'],m:42,w:110,mbps:500,c:35,t:8,
   txt:'Llega desde 1.5 millones de km hasta la Red del Espacio Profundo. Las antenas de órbita baja no tienen esa potencia.'},
  {cat:'comms',id:'laser',n:'Terminal óptica por láser (LCRD)',m:15,w:65,mbps:1200,c:30,t:7,rel:-2,
   txt:'1 200 Mbps con un rayo láser: pesa la mitad que una parabólica. Tecnología nueva: resta un poco de confiabilidad.'},

  // ---------- PARTE 7: PROPULSIÓN ----------
  {cat:'prop',id:'gas',n:'Propulsor de gas frío',only:'ojo',orb:['sso','leo'],m:3,w:5,c:.8,t:2,
   txt:'Seguro, barato y no tóxico. Mantiene la órbita de un CubeSat 1 a 2 años.'},
  {cat:'prop',id:'hidra',n:'Monopropelente de hidracina',orb:['sso','leo'],m:180,w:30,c:15,t:6,
   txt:'El más usado por la NASA en órbita baja: mantiene la altura 7 a 10 años y esquiva basura espacial.'},
  {cat:'prop',id:'hall',n:'Propulsor iónico de efecto Hall',only:'ojo',orb:['sso','leo'],m:95,w:100,c:22,t:8,minGen:1350,
   txt:'6 veces más eficiente que la hidracina: ahorra casi 100 kg. Exige paneles de al menos 1 350 W.'},
  {cat:'prop',id:'bimodal',n:'Propulsores bimodales para L2',only:'tel',orb:['l2'],m:320,w:35,c:45,t:10,
   txt:'Obligatorio en L2: la órbita es inestable y hay que encender motores cada 21 días para no salirse.'},
  {cat:'prop',id:'apogeo',n:'Motor bipropelente de apogeo',only:'ojo',orb:['geo'],m:2300,w:45,c:35,t:9,
   txt:'Obligatorio en GEO: el cohete te deja en una órbita elíptica y este motor la circulariza a 35 786 km. Duplica el peso.'},
];

/* Pruebas en Tierra (se eligen en la revisión) */
export const PRUEBAS = [
  {id:'none', n:'Sin pruebas extra', cMul:0, t:0, rel:0, txt:'No gastas meses ni dinero.'},
  {id:'basic',n:'Pruebas básicas',   cMul:1, t:3, rel:6, txt:'Vibración y pruebas térmicas esenciales.'},
  {id:'full', n:'Pruebas completas', cMul:3, t:9, rel:15,txt:'Vacío térmico y vibración: la forma de pasar de 90% de confiabilidad.'},
];

export const NOMBRE_CAT = {chasis:'Chasis',energia:'Energía',instr:'Sensores',termico:'Soporte térmico',adcs:'Apuntamiento',comms:'Comunicaciones',prop:'Propulsión',
  f1:'Fase 1 · Cuerpo principal',boosters:'Boosters laterales',etapa:'Fase 2 · Etapa superior',cofia:'Punta · Cofia'};

/* Pasos del taller y categorías que muestra cada uno */
export const PASOS = [
  {id:'bus',     n:'BUS',     cats:['chasis','energia'],            ayuda:'Elige el chasis y la fuente de energía.'},
  {id:'sensores',n:'SENSORES',cats:['instr'],                       ayuda:'Elige los instrumentos científicos. El chasis limita cuántos caben.'},
  {id:'soporte', n:'SOPORTE', cats:['termico','adcs','comms','prop'],ayuda:'Térmico (puedes combinar varios), apuntamiento, comunicaciones y propulsión.'},
  {id:'cohete',  n:'COHETE',  cats:['f1','boosters','etapa','cofia'],ayuda:'Arma el cohete por partes, de abajo hacia arriba.'},
];

export const pieza = id => PIEZAS.find(p => p.id === id);
