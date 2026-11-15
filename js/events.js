/* ============================================================
   events.js — imprevistos durante la operación (v3: más simples).
   Cada evento tiene SOLO 2 opciones, en lenguaje claro, y una pista.
     label   texto del botón
     hint    qué pasa si lo eliges (con palabras, no con porcentajes)
     q       calidad de la decisión (0–1) para la puntuación
     req     función(design) → texto si la opción NO está disponible
     outcomes[]  {p, text, fx}  (p = probabilidad; la suma debe ser 1)
   Efectos (fx):
     health  ±salud de la nave   | money ±reserva (M$)
     sci     ±ciencia este mes (0.5 = +50%, -0.5 = -50%)
     send    ±datos que se pueden enviar este mes
     modifier {sci, months, label}  efecto que dura varios meses
   ============================================================ */
var MC = globalThis.MC = globalThis.MC || {};

(function () {
  var noFuel = function (d) { return d.fuel === 'small' ? 'tu nave casi no tiene combustible.' : null; };
  var need2  = function (d) { return d.stations < 2 ? 'solo tienes 1 estación terrestre.' : null; };

  MC.events = [
    {
      id: 'solar_storm', title: 'Tormenta solar',
      text: 'Una tormenta del Sol viaja hacia tu nave. Su radiación podría dañar la electrónica.',
      tip: 'Proteger la nave casi siempre vale más que un mes de ciencia.',
      lesson: 'En una tormenta solar lo más seguro es apagar los instrumentos: pierdes algo de ciencia, pero proteges la nave.',
      options: [
        { label: 'Apagar los instrumentos unos días', hint: 'Seguro. Pierdes parte de la ciencia de este mes.', q: 0.9,
          outcomes: [{ p: 1, text: 'La nave pasó la tormenta sin daños.', fx: { sci: -0.4 } }] },
        { label: 'Dejarlos encendidos', hint: 'Arriesgado. Puede salir bien o dañar la nave.', q: 0.2,
          outcomes: [
            { p: 0.5, text: 'Hubo suerte: la tormenta no hizo daño.', fx: {} },
            { p: 0.5, text: 'La radiación dañó la electrónica.', fx: { health: -25, sci: -0.3 } }] }
      ]
    },
    {
      id: 'antenna_fail', title: 'Falla de la antena',
      text: 'La antena deja de responder y los datos se están acumulando en la nave.',
      tip: 'Tener una segunda estación en la Tierra ayuda mucho en estos casos.',
      lesson: 'Tener estaciones de respaldo convierte una falla de comunicaciones en un susto y no en una pérdida.',
      options: [
        { label: 'Reiniciar la antena', hint: 'Casi siempre funciona, pero si falla pierdes datos este mes.', q: 0.6,
          outcomes: [
            { p: 0.75, text: 'El reinicio funcionó.', fx: {} },
            { p: 0.25, text: 'No se recuperó a tiempo y casi no se enviaron datos.', fx: { send: -0.7 } }] },
        { label: 'Pedir ayuda a otra estación (cuesta 2 M$)', hint: 'Seguro. No pierdes datos.', q: 0.9, req: need2,
          outcomes: [{ p: 1, text: 'La segunda estación recibió los datos.', fx: { money: -2 } }] }
      ]
    },
    {
      id: 'debris', title: 'Basura espacial cerca',
      text: 'Un trozo de satélite viejo pasará muy cerca de tu nave.',
      tip: 'Esquivar usa combustible. Si pusiste combustible mínimo, no podrás.',
      lesson: 'Una maniobra de evasión consume combustible: por eso conviene no recortar el tanque.',
      options: [
        { label: 'Esquivarlo con una maniobra', hint: 'Seguro. Pierdes un poco de ciencia este mes.', q: 0.9, req: noFuel,
          outcomes: [{ p: 1, text: 'La maniobra evitó el cruce.', fx: { sci: -0.1 } }] },
        { label: 'No hacer nada', hint: 'Arriesgado. Casi nunca pasa nada, pero un choque sería grave.', q: 0.3,
          outcomes: [
            { p: 0.9, text: 'El fragmento pasó de largo.', fx: {} },
            { p: 0.1, text: 'Hubo un impacto y la nave sufrió daños.', fx: { health: -45 } }] }
      ]
    },
    {
      id: 'instrument_drift', title: 'Un instrumento se descalibra',
      text: 'Las mediciones de uno de tus instrumentos empiezan a salir mal.',
      tip: 'Arreglar un problema pequeño a tiempo cuesta menos que dejarlo crecer.',
      lesson: 'Calibrar a tiempo cuesta poco; ignorar un problema pequeño lo vuelve más caro después.',
      options: [
        { label: 'Recalibrarlo (cuesta 1 M$)', hint: 'Se arregla. Pierdes un poco de ciencia este mes.', q: 0.9,
          outcomes: [{ p: 1, text: 'El instrumento volvió a medir bien.', fx: { money: -1, sci: -0.2 } }] },
        { label: 'Ignorarlo', hint: 'No cuesta nada, pero la calidad de los datos baja varios meses.', q: 0.3,
          outcomes: [{ p: 1, text: 'La calidad de los datos fue cayendo.', fx: { modifier: { sci: -0.1, months: 3, label: 'Calibración degradada' } } }] }
      ]
    },
    {
      id: 'budget_cut', title: 'Recorte de presupuesto',
      text: 'La agencia recorta fondos a mitad de la misión.',
      tip: 'Si te sobra reserva, aceptar el recorte no te afecta tanto.',
      lesson: 'Tener reserva de presupuesto te da libertad cuando llegan malas noticias.',
      options: [
        { label: 'Aceptar el recorte', hint: 'Pierdes 5 M$ de tu reserva.', q: 0.7,
          outcomes: [{ p: 1, text: 'La reserva bajó, pero la misión sigue igual.', fx: { money: -5 } }] },
        { label: 'Trabajar con menos horas de operación', hint: 'No pierdes dinero, pero la ciencia baja un tiempo.', q: 0.5,
          outcomes: [{ p: 1, text: 'El equipo trabajó con menos horas de operación.', fx: { modifier: { sci: -0.15, months: 4, label: 'Operaciones reducidas' } } }] }
      ]
    },
    {
      id: 'opportunity', title: 'Oportunidad científica única',
      text: 'Ocurre un fenómeno raro justo en el campo de visión de tu nave.',
      tip: 'Aprovecharlo da mucha ciencia extra y casi no tiene riesgo.',
      lesson: 'A veces vale la pena aprovechar una oportunidad si tienes margen para absorber un pequeño riesgo.',
      options: [
        { label: 'Aprovechar la oportunidad', hint: 'Ganas ciencia extra este mes. Hay un pequeño riesgo de calentar la nave.', q: 0.8,
          outcomes: [
            { p: 0.8, text: 'Se obtuvieron datos únicos.', fx: { sci: 0.4 } },
            { p: 0.2, text: 'Se obtuvieron datos únicos, pero la nave se calentó.', fx: { sci: 0.4, health: -10 } }] },
        { label: 'Seguir con el plan normal', hint: 'No pasa nada, pero se pierde la oportunidad.', q: 0.4,
          outcomes: [{ p: 1, text: 'Se dejó pasar la oportunidad.', fx: {} }] }
      ]
    },
    {
      id: 'overheat', title: 'La nave se calienta de más',
      text: 'La temperatura de la nave sube más de lo esperado.',
      tip: 'Bajar la actividad un mes es mejor que arriesgar componentes.',
      lesson: 'Bajar la actividad ayuda a enfriar la nave, aunque cueste algo de ciencia.',
      options: [
        { label: 'Reducir la actividad de los instrumentos', hint: 'Seguro. Pierdes parte de la ciencia de este mes.', q: 0.9,
          outcomes: [{ p: 1, text: 'La temperatura volvió a un nivel seguro.', fx: { sci: -0.25 } }] },
        { label: 'No hacer nada', hint: 'Arriesgado. Puede enfriarse solo o dañarse.', q: 0.2,
          outcomes: [
            { p: 0.5, text: 'Se enfrió solo.', fx: {} },
            { p: 0.5, text: 'Se dañaron componentes por el calor.', fx: { health: -20 } }] }
      ]
    },
    {
      id: 'station_down', title: 'Una estación en la Tierra deja de funcionar',
      text: 'Una tormenta deja sin energía a una estación justo cuando tu nave pasa por encima.',
      tip: 'Contratar una antena externa cuesta poco y evita perder datos.',
      lesson: 'Más estaciones terrestres significan más caminos para recibir tus datos.',
      options: [
        { label: 'Contratar una antena externa (cuesta 2 M$)', hint: 'Seguro. Casi no pierdes datos.', q: 0.8,
          outcomes: [{ p: 1, text: 'Una estación comercial recibió tus datos.', fx: { money: -2 } }] },
        { label: 'Guardar los datos y enviarlos después', hint: 'No cuesta dinero, pero este mes llegan menos datos.', q: 0.5,
          outcomes: [{ p: 1, text: 'El almacenamiento de la nave se llenó más de lo ideal.', fx: { send: -0.4 } }] }
      ]
    },
    {
      id: 'computer_reset', title: 'La computadora de la nave se reinicia',
      text: 'Un rayo cósmico provoca un error y la computadora principal se reinicia sola.',
      tip: 'El modo seguro es lento, pero no falla.',
      lesson: 'El modo seguro es lento pero predecible; un reinicio completo es más rápido, pero puede salir mal.',
      options: [
        { label: 'Entrar en modo seguro', hint: 'Seguro. Pierdes un poco de ciencia este mes.', q: 0.8,
          outcomes: [{ p: 1, text: 'La nave se recuperó paso a paso.', fx: { sci: -0.15 } }] },
        { label: 'Reiniciar todo de golpe', hint: 'Normalmente sale bien, pero si falla pierdes mucha ciencia.', q: 0.5,
          outcomes: [
            { p: 0.6, text: 'El reinicio funcionó a la primera.', fx: {} },
            { p: 0.4, text: 'El reinicio falló y tardaron en recuperar la nave.', fx: { sci: -0.5 } }] }
      ]
    },
    {
      id: 'collab', title: 'Otro equipo pide tus datos',
      text: 'Un laboratorio quiere usar tus datos para su estudio y ofrece pagar por ellos.',
      tip: 'No hay una respuesta mala: es dinero extra a cambio de un poco de trabajo.',
      lesson: 'Compartir datos puede dar ingresos extra, a cambio de algo de trabajo del equipo.',
      options: [
        { label: 'Aceptar', hint: 'Ganas 4 M$, pero pierdes un poco de ciencia este mes por el trabajo extra.', q: 0.7,
          outcomes: [{ p: 1, text: 'Acordaron compartir los datos.', fx: { money: 4, sci: -0.1 } }] },
        { label: 'Rechazar', hint: 'No cambia nada.', q: 0.5,
          outcomes: [{ p: 1, text: 'Decidieron mantener los datos solo para la misión.', fx: {} }] }
      ]
    }
  ];

  /* Texto corto para mostrar los efectos como etiquetas en pantalla */
  MC.fxChips = function (fx) {
    var c = [];
    if (!fx) return c;
    if (fx.health) c.push({ t: 'Salud de la nave ' + (fx.health > 0 ? '+' : '') + fx.health + '%', bad: fx.health < 0 });
    if (fx.money) c.push({ t: 'Reserva ' + (fx.money > 0 ? '+' : '') + fx.money + ' M$', bad: fx.money < 0 });
    if (fx.sci) c.push({ t: 'Ciencia de este mes ' + (fx.sci > 0 ? '+' : '') + Math.round(fx.sci * 100) + '%', bad: fx.sci < 0 });
    if (fx.send) c.push({ t: 'Datos enviados ' + (fx.send > 0 ? '+' : '') + Math.round(fx.send * 100) + '%', bad: fx.send < 0 });
    if (fx.modifier) c.push({ t: fx.modifier.label + ' (' + Math.round(fx.modifier.sci * 100) + '% durante ' + fx.modifier.months + ' meses)', bad: fx.modifier.sci < 0 });
    return c;
  };
})();
