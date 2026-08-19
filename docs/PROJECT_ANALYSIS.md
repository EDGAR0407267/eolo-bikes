# Analisis del proyecto EOLO Bikes

Fecha base del analisis: 2026-06-02

## 1. Resumen ejecutivo

EOLO Bikes es una web estatica orientada a captacion local y posicionamiento SEO para un negocio ciclista en Miami Platja. El sitio presenta tres lineas principales de negocio:

- Venta de bicicletas
- Taller y mantenimiento
- Alquiler de bicicletas

El proyecto esta construido con Astro y Tailwind, sin backend ni CMS visibles en el repositorio actual.

## 2. Estado actual del repositorio

- El repositorio no muestra historial util en el arbol de trabajo actual: todos los archivos aparecen como no trackeados en `git status`.
- No existia documentacion central del proyecto antes de esta intervencion.
- Ya existia un informe tecnico previo: `PERFORMANCE_OPTIMIZATION_REPORT.md`.

Implicacion:

- Parte de la historia temprana del proyecto solo puede inferirse por la estructura actual.
- La optimizacion de rendimiento si esta documentada de forma explicita.

## 3. Stack y tooling

- Framework: Astro `^4.16.18`
- Estilos: Tailwind CSS `^3.4.17`
- Lenguaje: TypeScript `^5.7.2`
- QA e2e: Playwright `^1.60.0`, configurado sobre Microsoft Edge del sistema para evitar descargas de navegadores.
- Integraciones activas: `@astrojs/tailwind`
- Dependencia instalada pero no activa en `astro.config.mjs`: `@astrojs/sitemap`
- Build de produccion: salida estatica de Astro hacia `dist/`, con assets compilados en `dist/assets/` para despliegue en hosting tradicional tipo Hostalia/Plesk.

Scripts disponibles:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test:e2e`
- `npm run test:e2e:headed`

## 4. Arquitectura funcional

### Layout global

`src/layouts/Layout.astro` concentra:

- metadatos SEO base
- canonical
- meta robots `index, follow`
- Open Graph y Twitter Card
- favicon raiz completo servido desde `public/favicon.ico`, `public/favicon.svg`, `public/favicon-16x16.png`, `public/favicon-32x32.png` y `public/apple-touch-icon.png`
- logo publico servido desde `public/images/eolo-logo.svg`, con subtitulo completo `BIKES · WORKSHOP · COMMUNITY`
- imagen social/OG optimizada servida desde `public/images/eolo-og.jpg`
- schema global `SportingGoodsStore` y `WebSite`
- `BreadcrumbList` automatico en las paginas internas reales
- carga de Google Fonts
- activacion de animaciones ligeras via `src/scripts/animations.ts`

### Datos de negocio

`src/lib/constants.ts` centraliza:

- enlaces de navegacion
- telefono
- horario comercial
- WhatsApp
- direccion
- enlaces sociales
- textos estructurados para servicios y rutas

Observacion importante:

- El telefono publico ya esta actualizado con un numero real (`621 27 78 40`) y se expone tambien en formato internacional para enlaces y schema.
- El horario comercial queda centralizado para renderizado visual y datos estructurados SEO.
- El enlace de WhatsApp apunta al mismo numero publico en formato internacional (`https://wa.me/34621277840`).

### Paginas actuales

`src/pages/` contiene cinco rutas principales:

- `/` inicio
- `/venta-bicicletas-miami-platja`
- `/taller-bicicletas-miami-platja`
- `/alquiler-bicicletas-miami-platja`
- `/contacto`

Patron comun:

- cada pagina monta `Header`, `Footer` y `WhatsAppButton`
- cada vertical de negocio tiene copy SEO especifico
- varias paginas incluyen schema `Service` o `ContactPage`

### Componentizacion

La home se construye con bloques reutilizables en `src/components/`, entre ellos:

- `Hero`
- `PresentationSection`
- `ServicesSection`
- `WorkshopSection`
- `RentalSection`
- `RoutesSection`
- `GallerySection`
- `ReviewsSection`
- `FAQSection`
- `CTASection`
- `ContactSection`

Esto indica una arquitectura de landing modular y facil de extender.

## 5. Frontend, estilo y experiencia

- La identidad visual usa una paleta oscura con acentos `wind`, `sand`, `olive` y `turquoise`.
- Tailwind esta extendido en `tailwind.config.ts` con tipografias, sombras, gradientes y animaciones propias.
- `src/styles/global.css` aporta:
  - fondos ambientales
  - superficies tipo glass
  - estados de reveal
  - optimizacion con `content-visibility`
  - reduccion de coste visual en movil
  - ajustes responsive moviles para HERO, CTAs, menu y anchuras de seccion
  - compatibilidad con `prefers-reduced-motion`

## 6. SEO y discoverability

El proyecto esta claramente orientado a SEO local:

- URLs descriptivas por servicio y localizacion
- `title`, `description` y Open Graph por pagina
- favicon de marca estable en raiz para navegadores, Google y Apple Touch
- schema global `SportingGoodsStore` y `WebSite`
- breadcrumbs JSON-LD en paginas internas reales
- schema especifico para servicios y contacto
- `public/robots.txt`, apuntando a `https://eolobikes.com/sitemap.xml`
- `public/sitemap.xml`
- metadatos de produccion revisados para las cinco rutas reales, sin incluir rutas nuevas o inexistentes

Riesgo actual:

- Hay una dependencia de sitemap instalada, pero el sitemap se gestiona manualmente en `public/` en vez de generarse con la integracion.

## 7. Rendimiento y decisiones tecnicas conocidas

Lo siguiente esta confirmado por `PERFORMANCE_OPTIMIZATION_REPORT.md`:

- se elimino React del cliente
- se eliminaron GSAP, ScrollTrigger y Lenis
- las animaciones pasaron a un sistema ligero con `IntersectionObserver`
- las imagenes principales se movieron a `astro:assets`
- se redujo de forma agresiva el JavaScript inicial
- se mejoro el comportamiento movil y `prefers-reduced-motion`

Punto tecnico actual:

- `src/scripts/animations.ts` es ahora una pieza critica del comportamiento visual. Cualquier cambio en revelados o parallax debe hacerse con cuidado para no reintroducir coste innecesario.
- `src/components/ManifestoSection.astro` ya usa una fotografia local importada desde `src/assets/images/manifesto-bike-bg.png`, alineada con la marca y dentro del pipeline de `astro:assets`.
- `src/pages/venta-bicicletas-miami-platja.astro` usa tambien una fotografia local propia para el HERO principal (`src/assets/images/venta-hero-rider.png`), optimizada por `astro:assets` y separada de la imagen editorial secundaria de la misma pagina.
- `src/scripts/animations.ts` incluye fallbacks de visibilidad para que los elementos con `data-reveal` y `data-hero-reveal` no queden ocultos si `IntersectionObserver` no dispara.
- Las copias PNG pesadas que estaban en `public/images/` para hero/concepto/taller/alquiler se retiraron del arbol publico; las versiones fuente siguen en `src/assets/images/` y se optimizan en build. La imagen social publica se sustituyo por `public/images/eolo-og.jpg` de 1200x630.
- Existe una suite minima de QA preproduccion en `tests/e2e/preproduction.spec.ts` que valida rutas principales, menu movil con clicks reales, reveals/HERO, ausencia de scroll horizontal y robots/sitemap. Playwright sirve `dist/` mediante `scripts/serve-static.mjs`, un servidor estatico Node sin dependencias anadidas, para evitar bloqueos observados con `astro preview` en Windows.
- Existe una nota de produccion SEO en `docs/PRODUCTION_SEO.md` con comandos de validacion, pasos de Google Search Console, sitemap a enviar y pendientes no tecnicos del propietario.

## 8. Riesgos y pendientes detectados

- `@astrojs/sitemap` esta instalada pero no integrada activamente.
- El arbol Git actual no refleja historial limpio; si esto no es intencional, conviene crear un primer commit base cuanto antes.
- Las fuentes siguen cargandose desde Google Fonts; si el rendimiento o privacidad importan, podria valorarse self-hosting.
- El historial previo a esta documentacion no esta consolidado en un changelog del repo; solo hay una parte confirmada por el informe de rendimiento.
- La suite e2e usa el canal `msedge`; si se ejecuta en otra maquina sin Microsoft Edge instalado, habria que instalar navegadores de Playwright o ajustar el canal.

## 9. Procedimiento recomendado para futuras IAs

Antes de modificar:

1. Leer `AGENTS.md`.
2. Revisar este documento.
3. Revisar la ultima entrada de `docs/AI_CHANGELOG.md`.
4. Confirmar si el cambio afecta a SEO, copy, layout, datos de negocio o rendimiento.

Despues de modificar:

1. Actualizar `docs/AI_CHANGELOG.md`.
2. Actualizar este documento si cambia el contexto estructural.
3. Ejecutar `npm run build` cuando aplique.

## 10. Checklist rapido por tipo de cambio

Si se toca contenido:

- revisar copy SEO
- revisar `title` y `description`
- revisar schema si cambia el servicio

Si se toca UI:

- revisar responsive
- revisar accesibilidad basica
- revisar impacto en `src/scripts/animations.ts` y `src/styles/global.css`

Si se tocan datos del negocio:

- sincronizar `src/lib/constants.ts`
- sincronizar `src/layouts/Layout.astro`
- revisar enlaces de contacto y metadata

Si se tocan assets:

- priorizar `src/assets/images/` para imagenes optimizables
- evitar volver a introducir imagenes pesadas sin pipeline de Astro
