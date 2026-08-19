# AGENTS

Lee este archivo antes de modificar cualquier parte del proyecto.

## Lectura obligatoria

1. `README.md`
2. `docs/PROJECT_ANALYSIS.md`
3. `docs/AI_CHANGELOG.md`

## Objetivo de esta memoria

Este repositorio debe conservar contexto suficiente para que cualquier IA pueda continuar el trabajo sin empezar desde cero ni romper decisiones previas.

## Reglas de trabajo

- Antes de tocar codigo, revisar el ultimo bloque de `docs/AI_CHANGELOG.md`.
- Despues de cada cambio, anadir una entrada nueva en `docs/AI_CHANGELOG.md`.
- Si cambian arquitectura, rutas, stack, SEO, datos de negocio o activos, actualizar tambien `docs/PROJECT_ANALYSIS.md`.
- Si el cambio afecta a la web, validar con `npm run build` siempre que sea viable.

## Contexto rapido

- Proyecto: web corporativa/SEO para EOLO Bikes.
- Stack actual: Astro + Tailwind + TypeScript.
- Routing actual: inicio, venta, taller, alquiler y contacto.
- Datos de negocio centralizados en `src/lib/constants.ts`.
- Layout SEO global en `src/layouts/Layout.astro`.
- Animaciones ligeras en `src/scripts/animations.ts`.

## Restricciones utiles

- Mantener salida estatica salvo necesidad explicita.
- No eliminar ni degradar metadatos SEO, schema.org o canonicales sin una razon clara.
- No sustituir telefonos, WhatsApp o direccion placeholder sin confirmacion del propietario.
- Evitar introducir frameworks cliente innecesarios si el cambio puede resolverse con Astro/CSS/JS ligero.

## Formato minimo del registro

Cada entrada nueva en `docs/AI_CHANGELOG.md` debe incluir:

- Fecha
- Objetivo
- Archivos tocados
- Cambios realizados
- Validacion ejecutada
- Riesgos o pendientes
