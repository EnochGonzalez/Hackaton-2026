/* Eventos de la operación. sci: meses de ciencia que suma o resta · cash: unidades de presupuesto de operación
   hp: salud de la nave · risk: probabilidad de que salga mal · q: calidad de la decisión (0 a 1) */
export const EV={
 storm:{t:'Tormenta solar',q:'Una eyección de masa coronal se acerca. La electrónica está en riesgo.',o:[
  {n:'Apagar los instrumentos dos semanas',d:'Nave segura, pierdes ciencia.',hint:'Es la opción segura: no arriesga la nave.',sci:-.5,q:.6},
  {n:'Mantener todo encendido',d:'40% de riesgo de daño.',hint:'Conservas la ciencia, pero la electrónica queda expuesta.',sci:0,risk:{p:.4,hp:-30,msg:'La tormenta dañó la electrónica.'},q:.7},
  {n:'Reorientar la nave',d:'Cuesta presupuesto y algo de ciencia.',hint:'Reduce la exposición sin apagar todo.',sci:-.2,cash:2,q:.9}]},
 comms:{t:'Falla de la antena principal',q:'La antena principal deja de responder.',o:[
  {n:'Usar la antena de respaldo',d:'Menor tasa de datos este mes.',hint:'Pierdes un poco de ciencia, pero no arriesgas nada.',sci:-.3,q:.8},
  {n:'Reiniciar el sistema',d:'50% de volver a la normalidad.',hint:'Si falla, pierdes todo el mes de datos.',sci:0,risk:{p:.5,sci:-1,msg:'El reinicio falló y se perdió un mes de datos.'},q:.6},
  {n:'Aceptar la menor tasa',d:'No gastas, pierdes datos.',hint:'Sin costo, pero sacrificas parte de la ciencia.',sci:-.5,q:.5}]},
 fire:{t:'Incendio forestal en Norteamérica',q:'Se reporta un incendio grande dentro de la zona de tu contrato.',o:[
  {n:'Observación prioritaria',d:'Más ciencia, más desgaste.',hint:'Es justo lo que pide el contrato: sube la ciencia.',sci:.8,hp:-5,q:1},
  {n:'Seguir el plan',d:'Sin cambios.',hint:'No ganas ni pierdes nada.',sci:0,q:.6},
  {n:'Pedir apoyo de otra misión',d:'Cuesta presupuesto.',hint:'Suma ciencia sin desgastar tu nave.',sci:.4,cash:1.5,q:.8}]},
 degr:{t:'Un instrumento se degrada',q:'Uno de tus instrumentos empieza a dar lecturas con ruido.',o:[
  {n:'Recalibrar',d:'Cuesta presupuesto.',hint:'Corrige el problema con poca pérdida.',sci:-.2,cash:1,q:.9},
  {n:'Apagarlo un mes',d:'Pierdes su ciencia ese mes.',hint:'Seguro, pero pierdes ciencia.',sci:-.6,q:.5},
  {n:'Ignorarlo',d:'50% de empeorar.',hint:'Gratis, pero la degradación puede crecer.',sci:-.1,risk:{p:.5,hp:-15,sci:-.4,msg:'El instrumento empeoró y dañó otros sistemas.'},q:.4}]},
 micro:{t:'Impacto de micrometeoroide',q:'Un impacto golpea el espejo primario.',o:[
  {n:'Recalibrar los actuadores',d:'Pierdes unos días de observación.',hint:'Realinear los segmentos devuelve la calidad de imagen.',sci:-.4,q:.9},
  {n:'Seguir observando',d:'Imágenes algo borrosas.',hint:'No pierdes tiempo, pero el espejo queda desalineado.',sci:-.1,risk:{p:.5,hp:-10,sci:-.3,msg:'El espejo desalineado degradó las imágenes.'},q:.5},
  {n:'Apagar y evaluar',d:'Seguro, pierdes casi un mes.',hint:'Máxima seguridad, máxima pérdida de ciencia.',sci:-.8,q:.5}]},
 cryo:{t:'El criocooler se calienta',q:'El refrigerador del infrarrojo medio consume más de lo normal.',o:[
  {n:'Apagar el infrarrojo medio un mes',d:'Pierdes su ciencia.',hint:'Evita el sobrecalentamiento de los sensores.',sci:-.4,q:.7},
  {n:'Mantenerlo encendido',d:'40% de riesgo de ceguera térmica.',hint:'Si el sensor se calienta, solo capta ruido.',sci:0,risk:{p:.4,hp:-25,sci:-.6,msg:'El sensor se calentó y quedó cegado.'},q:.5},
  {n:'Reducir la actividad',d:'Cuesta presupuesto y algo de ciencia.',hint:'Punto medio entre riesgo y ciencia.',sci:-.2,cash:1,q:.9}]},
 merge:{t:'Oportunidad: fusión de galaxias',q:'Se detecta una colisión de galaxias, como el Quinteto de Stephan, observable solo unas semanas.',o:[
  {n:'Observarla de inmediato',d:'Mucha ciencia, más desgaste.',hint:'Es una oportunidad única: sube la ciencia.',sci:.8,hp:-5,q:1},
  {n:'Seguir el programa',d:'Sin cambios.',hint:'No cambia nada.',sci:0,q:.6},
  {n:'Observarla con tiempo reducido',d:'Ciencia moderada.',hint:'Gana algo sin alterar el plan.',sci:.3,q:.8}]}
};

/* Meses en los que ocurre un evento */
export const MESES_EVENTO = [2, 5, 8, 11];
