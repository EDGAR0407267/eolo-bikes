# EOLO Performance Optimization Report

Fecha: 2026-06-02

## Resumen

El proyecto es una web Astro estatica, no Next.js. La optimizacion se centro en conservar la estetica premium de EOLO mientras se reducia peso inicial, trabajo de scroll, coste de animaciones y carga de imagenes.

Resultado principal: el bundle cliente paso de cargar React + GSAP + Lenis y chunks grandes a dos scripts pequenos de produccion:

- `hoisted.CMQYw1c7.js`: 1.79 kB, 0.85 kB gzip.
- `hoisted.CEUCtD4m.js`: 3.70 kB, 1.42 kB gzip.

## Problemas Encontrados

- HERO con imagen remota grande de Unsplash, sin dimensiones locales ni pipeline de optimizacion.
- Imagenes locales servidas como PNG completos desde `public/images`, con pesos entre ~1.8 MB y ~2.4 MB.
- GSAP, ScrollTrigger y Lenis cargados globalmente para animaciones de entrada, parallax y smooth scroll.
- Varios scripts GSAP por seccion, creando mas trabajo de scroll y mas JavaScript inicial.
- Mouse parallax del HERO con `requestAnimationFrame` permanente.
- Header como isla React (`client:load`) para una interaccion pequena, arrastrando runtime React.
- Dependencias no usadas en el bundle final: React, GSAP, Lenis, lucide-react, clsx y Embla.
- Uso amplio de `backdrop-filter`, sombras y blur pesado, especialmente costoso en movil.
- Imagenes remotas de galeria sin dimensiones estables.

## Cambios Realizados

- Sustitucion del HERO remoto por `astro:assets` usando `src/assets/images/eolo-hero.png`.
- Conversion de imagenes locales de taller, alquiler y venta a `Image` de Astro con `sizes`, lazy loading y WebP generado.
- Eliminacion de GSAP, ScrollTrigger y Lenis.
- Nuevo sistema ligero de reveal/parallax en `src/scripts/animations.ts` con `IntersectionObserver`, `requestAnimationFrame` bajo demanda y soporte `prefers-reduced-motion`.
- Refactor del HERO para conservar entrada, scroll effect y puntero fino sin timeline GSAP ni loop infinito.
- Refactor de `EditorialBanner` y `ManifestoSection` para usar atributos declarativos y parallax global.
- Header convertido de React a Astro estatico con script minimo para scroll y menu movil.
- Eliminacion de `@astrojs/react` del config.
- Reduccion de blur/sombras en movil y ocultacion de glows pesados en mobile.
- `content-visibility: auto` en secciones posteriores para reducir trabajo de render inicial.
- Dimensiones y `sizes` en imagenes remotas de galeria.
- Limpieza de dependencias no usadas.

## Archivos Modificados

- `astro.config.mjs`
- `package.json`
- `package-lock.json`
- `src/assets/images/*`
- `src/components/Header.astro`
- `src/components/Header.tsx` eliminado
- `src/components/Hero.astro`
- `src/components/EditorialBanner.astro`
- `src/components/ManifestoSection.astro`
- `src/components/WorkshopSection.astro`
- `src/components/RentalSection.astro`
- `src/components/GallerySection.astro`
- `src/components/ReviewsSection.astro`
- `src/layouts/Layout.astro`
- `src/pages/index.astro`
- `src/pages/venta-bicicletas-miami-platja.astro`
- `src/pages/taller-bicicletas-miami-platja.astro`
- `src/pages/alquiler-bicicletas-miami-platja.astro`
- `src/pages/contacto.astro`
- `src/scripts/animations.ts`
- `src/styles/global.css`

## Mejoras Esperadas

- LCP mas rapido por HERO local optimizado: `eolo-hero.png` paso de ~1.8 MB a ~75 kB WebP en build.
- Menor peso diferido: `eolo-workshop.png` de ~1.8 MB a ~87 kB WebP; `eolo-rental.png` de ~2.4 MB a ~191 kB WebP.
- Mucho menos JavaScript inicial: se eliminaron React runtime, GSAP, ScrollTrigger y Lenis del cliente.
- Scroll mas estable: sin smooth-scroll artificial global y sin listeners/tickers pesados.
- Animaciones mas fluidas: basadas en `transform` y `opacity`, ejecutadas una vez por entrada cuando aplica.
- Mejor experiencia movil: menos blur permanente, menos glow grande y parallax desactivado por debajo de tablet.
- Accesibilidad mejorada con `prefers-reduced-motion` y menu movil con `aria-expanded`.

## Riesgos y Decisiones

- Se elimino Lenis para priorizar fluidez nativa y evitar trabajo continuo por frame.
- Se conservaron animaciones clave, pero se sustituyo GSAP por CSS/IntersectionObserver para reducir bundle y CPU.
- Algunas imagenes remotas de Unsplash siguen existiendo en secciones editoriales/galeria; se les anadieron dimensiones y lazy loading, pero una mejora futura seria localizarlas y procesarlas tambien con `astro:assets`.
- El menu movil se valido por navegacion real en preview. El inspector de estilos del Browser dio lecturas inconsistentes para `opacity/max-height`, pero el click-through al enlace `Contacto` funciono sin `force`.

## Validacion

- `npm run build`: correcto.
- Produccion en `http://127.0.0.1:4322/`: carga con titulo correcto, H1 correcto y HERO usando `/_astro/eolo-hero...webp`.
- Consola Browser: sin errores ni warnings relevantes en desktop ni movil.
- Menu movil: boton encontrado, `aria-expanded=true`, click en enlace `Contacto` navego correctamente a `/contacto`.
- Screenshot del Browser no se pudo capturar: la API `Page.captureScreenshot` agoto tiempo en esta sesion.

## Comandos Ejecutados

- `npm run build`: primer intento en sandbox fallo por `spawn EPERM`; rerun con permiso elevado correcto.
- `npm uninstall @astrojs/react react react-dom gsap lenis lucide-react clsx @types/react @types/react-dom`: correcto, 0 vulnerabilidades.
- `npm uninstall embla-carousel`: correcto, 0 vulnerabilidades.
- `npm run build`: build final correcto, 5 paginas generadas en ~1.98s.
- Preview local en `127.0.0.1:4322`: usado para QA de produccion.

## Recomendaciones Futuras

- Medir Lighthouse en Chrome real contra `npm run preview` o entorno desplegado.
- Activar Web Vitals en produccion para LCP, CLS, INP y TTFB reales.
- Localizar/optimizar las imagenes remotas restantes de Unsplash.
- Anadir `@astrojs/sitemap` si se quiere usar la dependencia ya instalada; si no se usa, retirarla.
- Revisar fuentes: self-host de Inter/Playfair puede reducir dependencia de Google Fonts y mejorar control de cache.

---

# Ronda 2 — Fluidez de scroll y animaciones

Fecha: 2026-06-03

## Contexto

Tras la ronda 1 (eliminar React/GSAP/Lenis), la web seguia sintiendose pesada, con scroll a trompicones y animaciones a tirones. Esta ronda ataca el coste de *paint/composite* por frame, que era el cuello de botella real, sin tocar el diseno.

## Causas raiz encontradas

- **Grain global con `mix-blend-mode: soft-light`** (`body::before`, `fixed`, pantalla completa): obligaba a re-mezclar todo el viewport en cada frame de scroll. Era el mayor causante del scroll a trompicones.
- **Reviews ticker**: ~16 tarjetas con `backdrop-blur-xl` moviendose en bucle infinito → re-calculo del blur de 16 capas cada frame, para siempre, incluso fuera de pantalla.
- **Marquees (Reviews + Gallery)**: animaciones infinitas que nunca se pausaban aunque la seccion no fuera visible ni la pestana estuviera activa.
- **Glows decorativos** en subpaginas (`filter: blur(60–100px)` sobre `radial-gradient` que ya iba a `transparent`): rasterizacion cara y redundante.
- **`content-visibility: auto`** en secciones n+3: provocaba picos de layout al entrar en secciones pesadas (marquees) durante el scroll.
- **`will-change: transform, opacity`** en TODOS los `[data-reveal]` desde el inicio: promovia decenas de capas de compositor antes de animar nada.
- **Fuentes**: Barlow Condensed (3 pesos) sin uso y cursivas de Playfair (3 pesos) sin uso, en hoja de estilos render-blocking.
- **Header**: `backdrop-filter: blur(18px)` (en `<style>` scoped, no clase Tailwind) no recibia la reduccion movil → blur de 18px recalculado por frame al scrollear en movil.

## Cambios realizados

- `global.css`: grain sin `mix-blend-mode` (normal, `opacity: 0.05`); eliminado `content-visibility: auto`; eliminado `will-change` de la regla global de reveal.
- `ReviewsSection.astro`: quitado `backdrop-filter` de las tarjetas en movimiento (fondo solido `bg-cream/[0.05]`); glows ambiente pasados a `radial-gradient`; marquee se pausa fuera de viewport / pestana oculta (IO + `visibilitychange`).
- `GallerySection.astro`: ambos marquees se pausan fuera de viewport / pestana oculta.
- `Hero.astro`: grain del hero sin `mix-blend-screen` (evita re-mezcla durante el parallax del hero).
- `Header.astro`: `backdrop-filter` del header scrolleado reducido a 10px y menu movil a 12px en `max-width: 767px`.
- Subpaginas (taller/venta/alquiler): eliminados los `filter: blur(60–100px)` redundantes de glows; conservados los `blur(1px)` baratos.
- `Layout.astro`: fuentes sin Barlow ni cursivas de Playfair; hoja de Google Fonts no bloqueante (`preload` + `media="print"`/`onload` + `<noscript>`).

## Efecto esperado

- Scroll fluido: se elimina el re-blend de viewport por frame (grain) y el blur de 16 capas en movimiento (reviews). 60 FPS mucho mas alcanzable, sobre todo en movil.
- Menos trabajo en reposo: marquees parados cuando no se ven o la pestana esta en segundo plano.
- Menos coste de paint: glows como gradiente puro en vez de blur de gran radio.
- FCP/LCP mas rapidos: fuentes no bloqueantes y 6 archivos de fuente menos.
- Menos presion de capas en la carga: sin `will-change` masivo inicial.
- Diseno intacto: solo cambian intensidades imperceptibles de grain/blur; estructura, colores, textos y animaciones se mantienen.

## Validacion

- `npm run build`: correcto, 5 paginas, JS cliente ~2.7 kB gzip (2 chunks hoisted).
- Estilos computados verificados en dev (puerto 4321): grain `mix-blend-mode: normal` + opacity 0.05; `.review-card` `backdrop-filter: none`; secciones `content-visibility: visible`; glows de subpagina con `filter: none` y `radial-gradient` intacto; CSS de pausa de marquee funcional (clase `is-paused` → `animation-play-state: paused`).
- Sin errores en consola.
- Scripts de pausa (Reviews/Gallery) confirmados como cargados.

## Limitaciones de verificacion (entorno)

- El preview headless de esta sesion NO entrega callbacks de `IntersectionObserver` durante evals pasivas (el sistema de reveal existente tampoco aplica visualmente ahi) y `Page.captureScreenshot` agota tiempo. Por tanto, la *temporizacion* de reveals/parallax/pausa debe validarse en un navegador real. La logica es estandar y no se modifico respecto a la version previa que ya usaba el usuario.

## Comandos disponibles

- `npm run build`: OK.
- No existen `npm run lint`, `npm run type-check` ni `npm run test` en `package.json` (no configurados). `astro check` requeriria instalar `@astrojs/check` (no instalado).
