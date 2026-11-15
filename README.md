# Mission Control

Juego interactivo de diseño y simulación de misiones espaciales. Hackathon 2026.

## ¿De qué trata?
El jugador asume el papel de ingeniero de misión: recibe un contrato (objetivo, órbita, presupuesto y plazo), diseña el satélite y el cohete, lo lanza y gestiona 12 meses de operaciones. Al final recibe un reporte que explica cómo cada decisión afectó el resultado.

## Qué problema resuelve
Diseñar una misión espacial implica equilibrar masa, potencia, datos, presupuesto, comunicaciones y limitaciones orbitales. Para quien rara vez ve una misión completa, esos compromisos son abstractos. Mission Control los vuelve tangibles: cada pieza elegida cambia los recursos, el riesgo y la ciencia que se puede lograr.

## Cómo funciona
- **2 categorías, 3 misiones cada una:** Ojo en la Tierra y Telescopio Espacial.
- **3 dificultades:** Novato, Conocedor y Experto, que cambian presupuesto, plazo, riesgo y meta de ciencia.
- **Taller:** se arma el satélite (bus, sensores, soporte) y el cohete por partes, de abajo hacia arriba: Fase 1, boosters, etapa superior y cofia. Cada parte limita las compatibles de la siguiente.
- **Recursos:** peso, potencia, datos y presupuesto, con confiabilidad y meses de construcción como indicadores.
- **Revisión:** un semáforo valida el diseño y permite pruebas en Tierra antes del lanzamiento.
- **Operaciones:** 12 meses con eventos y consecuencias.
- **Puntuación:** ciencia, recursos, presupuesto, decisiones y equilibrio del diseño, con tabla de clasificación local.

## Flujo del juego
Inicio → Misiones → Contexto → Taller → Revisión → Lanzamiento → Operaciones → Reporte → Marcador

## Estructura del proyecto
index.html / index.css / index.js
modulos/     una carpeta por pantalla (misiones, contexto, taller, revision, lanzamiento, operaciones, reporte, marcador, glosario, como-jugar)
compartido/  tema, estado, navegación, componentes y dibujo de la nave
nucleo/      reglas del juego: cálculos, validación, operaciones y puntuación
datos/       catálogo de piezas, cohetes, misiones, dificultades, eventos y glosario

## Demo
https://missioncontrol-hackathon.vercel.app

## Equipo
Enoch González, Alarcón Valencia, Ivan Corzo, Cristopher Gómez.