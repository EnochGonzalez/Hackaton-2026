/* Glosario en dos secciones: [título, [[icono, término, definición], ...]] */
import {EN_INGLES} from '../idioma/idioma.js';
import {EN_DATOS} from '../idioma/en-datos.js';

const GLO_ES=[
 ['Ingeniería de la misión',[
  ['chasis','Bus (chasis)','La estructura de la nave. Define cuánta masa base tiene y cuántos instrumentos caben (ranuras).'],
  ['energia','Potencia (W)','La energía que generan los paneles solares frente a la que consumen las piezas. Si consumes más de lo que generas, la nave se apaga.'],
  ['comms','Ancho de banda (Mbps)','La velocidad de la antena para enviar datos a la Tierra. Si los instrumentos generan más de lo que la antena envía, se pierde ciencia.'],
  ['rocket','Capacidad del cohete','La masa máxima que un cohete lleva a una órbita concreta. Cambia según la órbita del contrato.'],
  ['tests','Confiabilidad','La probabilidad de que la nave funcione. Las pruebas en Tierra la suben, pero cuestan tiempo y dinero.'],
  ['prop','Delta-V y propulsión','El "empujón" total que la nave puede dar para corregir su trayectoria. Hace falta para llegar a GEO y para mantenerse en L2.'],
  ['adcs','ADCS (apuntamiento)','El sistema que orienta la nave: ruedas de reacción, sensores y barras magnéticas.'],
  ['termico','MLI','Mantas de varias capas que aíslan la nave del calor y del frío del espacio.'],
  ['cofia','Cofia','La cubierta de la punta del cohete que protege la carga. Su diámetro limita el tamaño del satélite que cabe.'],
  ['f1','Fase 1','El cuerpo principal del cohete: vence la gravedad en los primeros minutos del lanzamiento.'],
  ['boosters','Boosters','Cohetes auxiliares a los lados de la Fase 1. Dan empuje extra para cargas pesadas u órbitas lejanas.'],
  ['etapa','Etapa superior (Fase 2)','El motor que se enciende ya en el vacío para dejar al satélite en su órbita final.'],
  ['chasis','MDD','Millones de dólares: la unidad del presupuesto.']]],
 ['Órbitas, instrumentos y misiones',[
  ['orbita','SSO (heliosíncrona)','Órbita baja que pasa sobre cada punto a la misma hora local. Da cobertura global diaria.'],
  ['orbita','LEO','Órbita baja terrestre, a unos 540 km. Allí orbita el Hubble.'],
  ['orbita','GEO (geoestacionaria)','A 35 786 km, el satélite se queda fijo sobre un punto y vigila el mismo hemisferio las 24 horas.'],
  ['orbita','L2 (punto de Lagrange)','Punto a 1.5 millones de km de la Tierra, del lado opuesto al Sol. Allí orbita el James Webb.'],
  ['instr','VIIRS','Radiómetro del satélite Suomi NPP: 22 bandas visibles e infrarrojas para incendios, humo y temperatura del mar.'],
  ['instr','ABI','Generador de imágenes del GOES-R, un satélite geoestacionario que escanea el continente cada 5 minutos.'],
  ['sar','SAR (radar de apertura sintética)','Radar que atraviesa nubes y humo. Consume mucha energía y genera muchos datos.'],
  ['instr','Hiperespectral','Cámara que ve cientos de colores finos para distinguir cultivos, sequía o fuego.'],
  ['espejo','Espejo segmentado','Espejo formado por hexágonos que se pliegan para caber en el cohete y se abren en el espacio.'],
  ['sun','Parasol y criocooler','Parasol: bloquea el calor del Sol y la Tierra. Criocooler: enfría los sensores infrarrojos a pocos grados sobre el cero absoluto.'],
  ['instr','NIRCam / NIRSpec / MIRI','Los instrumentos infrarrojos del James Webb: cámara, espectrógrafo y cámara de infrarrojo medio.'],
  ['chasis','EOS','Sistema de Observación de la Tierra de la NASA: red de más de 20 satélites que vigila el planeta.']]]];

/* En inglés se usa el glosario completo de idioma/en-datos.js */
export const GLO = EN_INGLES ? EN_DATOS.glosario : GLO_ES;
