/* ============================================================
   data.js — TODOS los números del juego viven aquí.
   Para balancear el juego solo hay que editar este archivo.
   (Valores simplificados con fines educativos, no reales.)
   ============================================================ */
var MC = globalThis.MC = globalThis.MC || {};

MC.data = {
  months: 12,

  /* Dificultad ≈ niveles de madurez conceptual (CML) de la NASA */
  difficulties: {
    cadet:    { id: 'cadet',    name: 'Cadete',    cml: 'CML 1', budgetMult: 1.25, riskMult: 0.4, eventChance: 0.4,
                desc: 'Más presupuesto y riesgos bajos. Ideal para aprender.' },
    engineer: { id: 'engineer', name: 'Ingeniero', cml: 'CML 2', budgetMult: 1.0,  riskMult: 1.0, eventChance: 0.5,
                desc: 'Presupuesto ajustado y riesgos reales.' },
    director: { id: 'director', name: 'Director',  cml: 'CML 3', budgetMult: 0.85, riskMult: 1.5, eventChance: 0.65,
                desc: 'Poco dinero, mucho riesgo y más imprevistos.' },
    sandbox:  { id: 'sandbox',  name: 'Sandbox',   cml: '—',     budgetMult: 10,   riskMult: 0.2, eventChance: 0.4,
                desc: 'Casi sin límite de presupuesto. Para experimentar.' }
  },

  /* Escenarios (objetivo científico) */
  scenarios: {
    earth: {
      id: 'earth', name: 'Ojo en la Tierra',
      tagline: 'Vigila incendios, clima y superficie desde el espacio.',
      objective: 'Observar la Tierra',
      budget: 110, targetPerMonth: 95, minLife: 6, minInstruments: 1,
      orbitFit: { leo: 1.0, polar: 1.2, geo: 0.9 },
      orbitNote: 'La órbita polar cubre toda la Tierra con el tiempo (+20% de ciencia). Desde la geoestacionaria ves siempre la misma zona (−10%).',
      intro: 'Los científicos necesitan datos frescos sobre incendios forestales y cambio climático. ' +
             'Diseña un satélite de observación de la Tierra que funcione 12 meses.',
      reqs: ['Al menos 1 instrumento útil', 'Vida útil de 6 meses o más (ideal: 12)', 'No pasarte del presupuesto']
    },
    telescope: {
      id: 'telescope', name: 'Telescopio espacial',
      tagline: 'Observa galaxias lejanas en luz visible, UV y rayos X.',
      objective: 'Observar el universo lejano',
      budget: 175, targetPerMonth: 110, minLife: 6, minInstruments: 1,
      orbitFit: { leo: 0.85, polar: 0.85, geo: 1.15 },
      orbitNote: 'Cerca de la Tierra, el planeta tapa parte del cielo (−15% de ciencia). Desde la geoestacionaria puedes observar sin interrupciones (+15%).',
      intro: 'Un telescopio fuera de la atmósfera ve lo que la Tierra esconde. ' +
             'Elige los instrumentos adecuados y asegúrate de poder enviar sus datos a casa.',
      reqs: ['Al menos 1 instrumento útil', 'Vida útil de 6 meses o más (ideal: 12)', 'No pasarte del presupuesto']
    }
  },

  /* Lanzadores: capacidad (kg) según la órbita. 0 = no llega. */
  launchers: {
    light:  { id: 'light',  name: 'Lanzador Ligero',  cost: 8,  risk: 0.08, capacity: { leo: 300,  polar: 250,  geo: 0 },
              desc: 'Barato, pero carga poco y falla más seguido.' },
    medium: { id: 'medium', name: 'Lanzador Mediano', cost: 30, risk: 0.04, capacity: { leo: 1500, polar: 1200, geo: 400 },
              desc: 'Equilibrado: buena carga y fiabilidad.' },
    heavy:  { id: 'heavy',  name: 'Lanzador Pesado',  cost: 90, risk: 0.02, capacity: { leo: 8000, polar: 6500, geo: 3000 },
              desc: 'Carga enorme y muy fiable, pero carísimo.' }
  },

  /* Órbitas */
  orbits: {
    leo:   { id: 'leo',   name: 'Órbita baja (LEO)', contact: 40,   linkFactor: 1,    eclipse: 0.35, radPenalty: 0, healthDecay: 1,
             desc: 'Unos 500–800 km. Fácil de alcanzar, pero ves cada estación pocos minutos al día.',
             pros: 'Barata · señal fuerte', cons: '40 min de contacto/día · mucha sombra' },
    polar: { id: 'polar', name: 'Órbita polar',      contact: 60,   linkFactor: 1,    eclipse: 0.30, radPenalty: 1, healthDecay: 2,
             desc: 'Pasa sobre los polos y, con los días, cubre toda la Tierra.',
             pros: 'Cobertura global · más contacto', cons: 'Algo más de radiación' },
    geo:   { id: 'geo',   name: 'Geoestacionaria',   contact: 1000, linkFactor: 0.15, eclipse: 0.01, radPenalty: 4, healthDecay: 4,
             desc: 'A 36 000 km. Parece quieta sobre un punto y casi no tiene sombra.',
             pros: 'Contacto casi constante · casi sin eclipse', cons: 'Señal débil (lejos) · mucha radiación · lanzador potente' }
  },

  /* Piezas de la nave (una de cada categoría) */
  base: { mass: 25, power: 30, cost: 3, name: 'Computadora y sistemas base' },
  parts: {
    structure: {
      light:  { id: 'light',  short: 'Ligera', name: 'Estructura ligera',  mass: 40, cost: 3, life: 8,  desc: 'Pesa poco, dura 8 meses.' },
      robust: { id: 'robust', short: 'Robusta', name: 'Estructura robusta', mass: 70, cost: 5, life: 12, desc: 'Más pesada y cara, dura 12 meses.' }
    },
    solar: {
      small:  { id: 'small',  short: 'Pequeños', name: 'Paneles pequeños', mass: 15, cost: 2, watts: 150, desc: '150 W al sol.' },
      medium: { id: 'medium', short: 'Medianos', name: 'Paneles medianos', mass: 30, cost: 4, watts: 300, desc: '300 W al sol.' },
      large:  { id: 'large',  short: 'Grandes', name: 'Paneles grandes',  mass: 60, cost: 7, watts: 600, desc: '600 W al sol.' }
    },
    battery: {
      small:  { id: 'small',  short: 'Chica', name: 'Batería chica',   mass: 8,  cost: 1, cover: 0.4, desc: 'Cubre ~40% del tiempo en sombra.' },
      medium: { id: 'medium', short: 'Mediana', name: 'Batería mediana', mass: 15, cost: 2, cover: 0.7, desc: 'Cubre ~70% del tiempo en sombra.' },
      large:  { id: 'large',  short: 'Grande', name: 'Batería grande',  mass: 25, cost: 4, cover: 0.9, desc: 'Cubre ~90% del tiempo en sombra.' }
    },
    antenna: {
      basic:  { id: 'basic',  short: 'Básica', name: 'Antena básica',   mass: 5,  cost: 1, power: 10, rate: 0.05, desc: 'Envía 0.05 GB por minuto de contacto.' },
      medium: { id: 'medium', short: 'Media', name: 'Antena media',    mass: 10, cost: 3, power: 20, rate: 0.15, desc: 'Envía 0.15 GB por minuto de contacto.' },
      high:   { id: 'high',   short: 'Alta ganancia', name: 'Antena de alta ganancia', mass: 20, cost: 6, power: 40, rate: 0.40, desc: 'Envía 0.40 GB por minuto de contacto.' }
    },
    fuel: {
      small:  { id: 'small',  short: 'Mínimo', name: 'Combustible mínimo', mass: 10, cost: 1, months: 2, desc: '+2 meses de vida. Sin maniobras.' },
      medium: { id: 'medium', short: 'Medio', name: 'Combustible medio',  mass: 30, cost: 3, months: 5, desc: '+5 meses de vida. Permite maniobras.' },
      large:  { id: 'large',  short: 'Extra', name: 'Combustible extra',  mass: 60, cost: 5, months: 9, desc: '+9 meses de vida. Permite maniobras.' }
    }
  },

  /* Instrumentos científicos */
  instruments: {
    ir_cam:   { id: 'ir_cam',   name: 'Cámara infrarroja',        mass: 45,  power: 60,  cost: 12, data: 3,   value: 30, goals: ['earth'],
                purpose: 'Ve calor: incendios y temperatura del suelo.' },
    spectro:  { id: 'spectro',  name: 'Espectrómetro atmosférico', mass: 30,  power: 40,  cost: 9,  data: 1,   value: 20, goals: ['earth'],
                purpose: 'Mide gases de la atmósfera (CO₂, humo).' },
    radar:    { id: 'radar',    name: 'Radar de apertura sintética', mass: 120, power: 200, cost: 25, data: 8,   value: 70, goals: ['earth'],
                purpose: 'Mapea la superficie de día y de noche, aun con nubes.' },
    fire:     { id: 'fire',     name: 'Sensor de incendios',       mass: 15,  power: 15,  cost: 5,  data: 0.5, value: 12, goals: ['earth'],
                purpose: 'Detecta focos de incendio al instante.' },
    optical:  { id: 'optical',  name: 'Telescopio óptico',         mass: 180, power: 80,  cost: 35, data: 4,   value: 50, goals: ['telescope'],
                purpose: 'Imágenes de galaxias en luz visible.' },
    uv:       { id: 'uv',       name: 'Cámara ultravioleta',       mass: 60,  power: 50,  cost: 18, data: 2,   value: 28, goals: ['telescope'],
                purpose: 'Estrellas jóvenes y calientes.' },
    xray:     { id: 'xray',     name: 'Detector de rayos X',       mass: 90,  power: 100, cost: 28, data: 3,   value: 38, goals: ['telescope'],
                purpose: 'Agujeros negros y gas muy caliente.' },
    ir_spec:  { id: 'ir_spec',  name: 'Espectrógrafo infrarrojo',  mass: 40,  power: 50,  cost: 14, data: 1.5, value: 24, goals: ['earth', 'telescope'],
                purpose: 'Analiza la composición de lo que observa (sirve en ambas misiones).' }
  },

  /* Segmento terrestre y usuarios */
  stations: {
    1: { n: 1, cost: 4,  name: '1 estación terrestre',  desc: 'Barata. Un solo punto de contacto.' },
    2: { n: 2, cost: 9,  name: '2 estaciones terrestres', desc: 'Doble tiempo de contacto y un respaldo.' },
    3: { n: 3, cost: 15, name: '3 estaciones terrestres', desc: 'Triple contacto, máxima fiabilidad.' }
  },
  opsMonthlyBase: 1.0,
  opsMonthlyPerStation: 0.4,
  teams: {
    small:  { id: 'small',  short: 'Pequeño', name: 'Equipo científico pequeño', cost: 6,  mult: 0.85, desc: 'Analiza los datos, pero pierde algo de valor.' },
    medium: { id: 'medium', short: 'Medio', name: 'Equipo científico medio',   cost: 12, mult: 1.0,  desc: 'Aprovecha bien los datos.' },
    large:  { id: 'large',  short: 'Grande', name: 'Equipo científico grande',  cost: 20, mult: 1.15, desc: 'Saca más ciencia de los mismos datos.' }
  },

  /* Nombres sugeridos para la misión (el jugador puede cambiarlos) */
  missionNames: ['Quetzal', 'Sumidero', 'Ceiba', 'Jaguar', 'Palenque', 'Tacaná', 'Marimba', 'Pakal', 'Lacandón', 'Aurora', 'Cóndor', 'Zafiro'],

  /* Misiones reales con las que comparamos al final */
  realMissions: {
    radar:     'NISAR (NASA–ISRO), que mapea la superficie terrestre con radar.',
    ir_cam:    'Landsat 9 (NASA/USGS), que vigila la superficie con sensores ópticos e infrarrojos.',
    earthAny:  'las misiones de observación de la Tierra de la NASA, como Landsat y Terra.',
    xray:      'el Observatorio de Rayos X Chandra (NASA).',
    optical:   'el Telescopio Espacial Hubble (NASA/ESA).',
    uv:        'telescopios ultravioleta como GALEX (NASA).',
    teleAny:   'los grandes observatorios espaciales de la NASA, como Hubble y Chandra.'
  },

  /* El glosario se muestra en dos pestañas */
  glossaryGroups: {
    recursos:  { name: 'Recursos', intro: 'Lo que administras durante la misión.', keys: ['masa', 'potencia', 'datos', 'presupuesto', 'ciencia', 'vida'] },
    conceptos: { name: 'Conceptos', intro: 'Ideas técnicas que aparecen en el juego.', keys: ['leo', 'polar', 'geo', 'eclipse', 'enlace', 'margen', 'riesgo'] }
  },

  /* Glosario (se muestra en globitos y en el glosario) */
  glossary: {
    masa:     ['Masa', 'Cuánto pesa la nave. El cohete solo puede cargar cierta masa, y cada kilo cuesta dinero.'],
    potencia: ['Energía', 'Electricidad de la nave (en vatios, W). Los paneles la generan y los instrumentos la gastan.'],
    eclipse:  ['Eclipse', 'Tiempo que la nave pasa en la sombra de la Tierra. Sin sol no hay energía de los paneles: ahí trabaja la batería.'],
    datos:    ['Datos', 'Información que generan los instrumentos (en GB por día). Hay que mandarla a la Tierra.'],
    enlace:   ['Enlace de datos', 'Cuánta información puedes enviar a la Tierra: depende de la antena, de los minutos de contacto y de cuántas estaciones tengas.'],
    leo:      ['Órbita baja (LEO)', 'Cerca de la Tierra (500–800 km). Barata, pero ves cada estación pocos minutos.'],
    polar:    ['Órbita polar', 'Pasa sobre los polos; con los días cubre toda la Tierra.'],
    geo:      ['Geoestacionaria', 'A 36 000 km: parece quieta sobre un punto, pero es lejana, cara y con más radiación.'],
    margen:   ['Margen', 'Cuánto te sobra respecto al límite. Poco margen = más riesgo si algo sale mal.'],
    vida:     ['Vida útil', 'Meses que puede operar la nave: dependen de la estructura, el combustible y la radiación de la órbita.'],
    presupuesto: ['Presupuesto', 'El dinero del proyecto. Todo lo que eliges cuesta, y lo que te sobre queda como reserva para los imprevistos.'],
    ciencia:  ['Ciencia', 'Son los puntos que ganas cada mes con tus instrumentos. Mientras más ciencia, mejor puntuación. Para ganarla, los instrumentos necesitan energía y sus datos deben llegar a la Tierra.'],
    riesgo:   ['Riesgo de lanzamiento', 'Probabilidad de que el cohete falle. Sube si vas muy justo de masa.']
  }
};
