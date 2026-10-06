# Registro de cambios para IA

Este archivo es obligatorio. Cada IA que modifique el proyecto debe anadir una nueva entrada al principio del historial.

## Plantilla obligatoria

### YYYY-MM-DD - Titulo breve

- Objetivo:
- Origen del contexto:
- Archivos tocados:
- Cambios realizados:
- Validacion:
- Riesgos o pendientes:

## Historial conocido

### 2026-10-06 - Portfolio presentation

- Objetivo: aclarar el estado publico y la autoria en el README.
- Origen del contexto: auditoria del repositorio y comprobacion de la web publica.
- Archivos tocados: `README.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se anadio el estado Production y el nombre completo del autor.
- Validacion: enlaces del README revisados y build de Astro comprobado.
- Riesgos o pendientes: ninguno en el codigo de la web.

### 2026-08-19 - Preparacion del repositorio publico de GitHub

- Objetivo: preparar el proyecto completo para publicarlo como repositorio de portfolio, con documentacion principal profesional en ingles y sin incluir secretos ni artefactos locales o de despliegue.
- Origen del contexto: solicitud directa del autor para crear un repositorio publico de GitHub del proyecto.
- Archivos tocados: `README.md`, `.gitignore`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se reescribio el README en ingles con presentacion del proyecto, autoria, funcionalidades, stack, decisiones tecnicas, SEO, accesibilidad, instalacion, scripts, estructura, despliegue, privacidad y licencia de uso; se ampliaron las exclusiones Git para ZIPs de produccion y logs locales; se reviso el arbol con busqueda de patrones sensibles sin encontrar claves, tokens, contrasenas ni archivos de entorno publicables. Los datos de telefono, direccion y horarios se mantienen porque son datos comerciales publicos de la web.
- Validacion: `npm run build` correcto con salida estatica y 5 paginas generadas; `git status --ignored` confirma que dependencias, build, logs, artefactos de pruebas, archivos de entorno y ZIPs quedan fuera del conjunto publicable; busqueda local de patrones sensibles sin credenciales detectadas.
- Riesgos o pendientes: GitHub CLI no esta instalado y el repositorio local todavia no tiene remoto, por lo que la creacion y publicacion en GitHub requieren completar esa herramienta/autenticacion.

### 2026-06-06 - ZIP de produccion con favicon corregido

- Objetivo: crear un ZIP listo para subir a Hostalia con el favicon raiz corregido.
- Origen del contexto: solicitud directa del usuario pidiendo generar el ZIP tras la correccion del favicon.
- Archivos tocados: `dist/` generado, `eolo-hostalia-produccion-favicon-fix.zip`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se regenero `dist/` con `npm run build` y se creo `eolo-hostalia-produccion-favicon-fix.zip` desde el contenido directo de `dist/`, sin carpeta contenedora `dist/`.
- Validacion: `npm run build` correcto; comprobado que `dist/` contiene en raiz `favicon.ico`, `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png` y `apple-touch-icon.png`; comprobado que el ZIP mide 4,161,487 bytes, no incluye carpeta `dist/` y contiene en raiz `index.html`, `robots.txt`, `sitemap.xml`, `favicon.ico`, `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png` y `apple-touch-icon.png`.
- Riesgos o pendientes: tras subir y extraer el ZIP en Hostalia, comprobar las cinco URLs publicas de favicon; si `/favicon.ico` sigue en 404, revisar que el ZIP se haya extraido en la carpeta raiz correcta del dominio y que no quede cache/regla antigua del hosting.

### 2026-06-06 - Favicon raiz completo para produccion

- Objetivo: corregir la configuracion del favicon para que Hostalia sirva directamente desde la raiz `/favicon.ico`, `/favicon.svg`, `/favicon-16x16.png`, `/favicon-32x32.png` y `/apple-touch-icon.png`.
- Origen del contexto: solicitud directa del usuario indicando que `https://eolobikes.com/favicon.ico` devolvia 404 y que Google podia no detectar un favicon estable y rastreable.
- Archivos tocados: `public/favicon.ico`, `public/favicon.svg`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `src/layouts/Layout.astro`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`, `dist/` generado.
- Cambios realizados: se mantuvo `public/favicon.svg` como isotipo cuadrado base; se generaron `favicon.ico` con entradas 16x16 y 32x32, `favicon-16x16.png`, `favicon-32x32.png` y `apple-touch-icon.png` de 180x180 en `public/`; se reemplazo el bloque de favicon del `<head>` global en `src/layouts/Layout.astro` por las cinco etiquetas raiz solicitadas; se actualizo `docs/PROJECT_ANALYSIS.md` para reflejar el favicon raiz completo. No se cambiaron diseno visual, colores, layout, animaciones, textos, rutas, schema ni datos de negocio.
- Validacion: `npm run build` correcto con salida estatica y 5 paginas generadas; comprobado que existen directamente en `dist/` los archivos `favicon.ico` (688 bytes), `favicon.svg` (778 bytes), `favicon-16x16.png` (16x16), `favicon-32x32.png` (32x32) y `apple-touch-icon.png` (180x180); comprobado que `dist/index.html` contiene las cinco etiquetas `<link>` de favicon apuntando a rutas raiz; comprobado que el contenedor ICO tiene 2 entradas, 16x16 y 32x32; prueba HTTP local sirviendo `dist/` con 200 para `/favicon.ico`, `/favicon.svg`, `/favicon-16x16.png`, `/favicon-32x32.png` y `/apple-touch-icon.png`.
- Riesgos o pendientes: queda pendiente subir el nuevo contenido de `dist/` a Hostalia y comprobar las cinco URLs publicas; si `/favicon.ico` siguiera devolviendo 404 tras subir este `dist/`, habria que revisar ruta de despliegue, cache o reglas del hosting.

### 2026-06-05 - Correccion de wordmark del HERO movil

- Objetivo: evitar que el texto decorativo grande del HERO principal invada la zona de CTAs en movil estrecho, especialmente alrededor de 320px.
- Origen del contexto: solicitud directa del usuario tras confirmar que Hostalia ya sirve el HTML y CSS correctos, descartando despliegue, ZIP y cache.
- Archivos tocados: `src/styles/global.css`, `dist/` generado, `eolo-hostalia-produccion-hero-mobile-fix.zip`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se ajusto solo el CSS responsive movil de `.hero-word` para anclar el wordmark decorativo hacia la parte superior del HERO con `padding-top: clamp(9rem, 22svh, 11.25rem)` y reducir suavemente su escala movil a `font-size: clamp(7rem, 34vw, 9.5rem)`; se anadio `position: relative` y `z-index: 2` a `#hero-buttons`/`[data-hero-buttons]` en movil para que la zona de CTAs tenga capa propia por encima del fondo decorativo. No se cambiaron textos, imagenes, colores, logo, estructura ni animaciones.
- Validacion: `npm run build` correcto con salida `static` y 5 paginas generadas; verificado que el CSS final `dist/assets/alquiler-bicicletas-miami-platja.jIYzJLNe.css` contiene las reglas nuevas; antes del refinamiento final, Browser integrado en 320px confirmo que el wordmark paso de intersectar los botones (`top=263.2`, `bottom=384.8` contra botones `top=328.7`) a no intersectarlos (`bottom=287.2`, botones `top=328.7`, separacion `41.5px`) y consola limpia; en 390px confirmo no interseccion y consola limpia, y desktop 1280x720 con wordmark centrado como antes. Tras el refinamiento final, el navegador integrado bloqueo nuevas cargas a `127.0.0.1:4327` por politica interna, por lo que no se forzo otro navegador; la regla final es mas conservadora que la validada visualmente porque reduce y sube mas el wordmark movil. ZIP `eolo-hostalia-produccion-hero-mobile-fix.zip` creado desde el contenido directo de `dist/` y validado con `index.html`, `assets/`, `images/` y rutas internas en raiz, sin carpeta `dist/` contenedora.
- Riesgos o pendientes: no se pudo repetir la captura renderizada exacta tras el refinamiento final por bloqueo del Browser integrado; conviene revisar en dispositivo movil real/Safari iOS despues de subir el ZIP. No se actualiza `docs/PROJECT_ANALYSIS.md` porque no cambian arquitectura, rutas, stack, SEO, datos de negocio ni activos.

### 2026-06-05 - Auditoria de build y ZIP verificado para Hostalia

- Objetivo: auditar la build estatica local, insertar una marca temporal verificable y generar un ZIP correcto para comparar con Hostalia.
- Origen del contexto: solicitud directa del usuario indicando que en local/build se ve bien, pero la web online en Hostalia sigue viendose como antes.
- Archivos tocados: `src/layouts/Layout.astro`, `dist/` generado, `eolo-hostalia-produccion-verificada.zip`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se anadio el comentario HTML `BUILD_VERIFICADA_EOLO_20260605_2221` justo al abrir el `<body>` del layout global, sin impacto visual; se regenero `dist/`; se creo `eolo-hostalia-produccion-verificada.zip` desde el contenido directo de `dist/`, sin carpeta contenedora `dist/`.
- Validacion: `npm run build` ejecutado correctamente antes y despues de insertar la marca, con salida `static` y 5 paginas generadas; verificado `dist/index.html` y las rutas `alquiler-bicicletas-miami-platja/`, `venta-bicicletas-miami-platja/`, `taller-bicicletas-miami-platja/` y `contacto/`; comprobado que la home carga `/assets/alquiler-bicicletas-miami-platja.cbRS51f2.css` y `/assets/hoisted.CJdKrcgY.js`, y las paginas internas `/assets/hoisted.H0FI9Ifj.js`; comprobado que el ZIP final contiene en raiz `index.html`, `assets/`, `images/`, `robots.txt`, `sitemap.xml` y las rutas internas, sin `dist/` ni `eolo-hostalia-produccion/` como carpeta contenedora; comprobado que `index.html` dentro del ZIP contiene la marca temporal.
- Riesgos o pendientes: la marca temporal debe retirarse cuando ya no haga falta verificar despliegue; en Hostalia se deben borrar assets/rutas antiguas antes de extraer el ZIP y preservar archivos propios del hosting como `.user.ini`.

### 2026-06-05 - ZIP v3 con nombre de optimizacion

- Objetivo: renombrar el ZIP final para identificar claramente la version correspondiente a la optimizacion de velocidad.
- Origen del contexto: solicitud directa del usuario para cambiar el nombre del ZIP y saber la version.
- Archivos tocados: `eolo-hostalia-produccion-v3-optimizacion-velocidad.zip`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se renombro `eolo-hostalia-produccion.zip` a `eolo-hostalia-produccion-v3-optimizacion-velocidad.zip`, manteniendo el ZIP v2 anterior sin cambios.
- Validacion: verificado que el ZIP nuevo existe con 60 entradas y 4.158.159 bytes; comprobado que no contiene carpeta `dist/` contenedora y que incluye en raiz `index.html`, `assets/`, `images/`, `robots.txt` y `sitemap.xml`.
- Riesgos o pendientes: no se ejecuto un nuevo build porque no hubo cambios de codigo ni de contenido del paquete, solo renombrado del archivo ZIP.

### 2026-06-05 - Optimizacion ligera de trabajo inicial

- Objetivo: optimizar un poco mas la velocidad percibida y el trabajo inicial de la web sin cambiar estetica, colores, logo, textos, estructura ni animaciones.
- Origen del contexto: solicitud directa del usuario para exprimir rendimiento manteniendo exactamente el aspecto actual; durante QA se detecto que la hero desktop podia quedar invisible por una transicion de reveal congelada tras el fallback, y se corrigio como parte de la validacion.
- Archivos tocados: `src/scripts/animations.ts`, `src/styles/global.css`, `src/components/Hero.astro`, `src/components/GallerySection.astro`, `src/components/ReviewsSection.astro`, `src/components/EditorialBanner.astro`, `src/components/ManifestoSection.astro`, `src/components/WorkshopSection.astro`, `src/components/RentalSection.astro`, `src/components/ContactSection.astro`, `src/pages/venta-bicicletas-miami-platja.astro`, `docs/AI_CHANGELOG.md`, `dist/` generado, `eolo-hostalia-produccion.zip`.
- Cambios realizados: se redujo trabajo JS inicial consolidando observers/fallbacks de reveal, usando un unico observer para grupos stagger y agrupando parallax por trigger para evitar filtrados repetidos en cada entrada; se mantuvo el fallback global pero ahora los modos instantaneos cortan transiciones pendientes para evitar estados invisibles congelados; se reforzo la regla `.is-visible` con selectores especificos de reveal para que el estado visible gane de forma robusta; se pausan los marquees de galeria desde el arranque hasta que la seccion entra en viewport y se evita doble inicializacion de galeria/resenas; se marco como `fetchpriority="low"` el media lazy no critico, incluido el iframe de contacto. No se cambiaron textos, imagenes fuente, logo, rutas, colores ni timings normales de animacion.
- Validacion: `npm run build` correcto tras los ajustes finales, con salida estatica, 5 paginas generadas, 47 imagenes optimizadas reutilizadas y bundles JS `5.48 kB`/`5.70 kB`; navegador integrado sobre `http://127.0.0.1:4326/` confirmo en desktop 1280x720 `hero-title` visible (`opacity: 1`, `transform: 0`), sin overflow horizontal, 33/33 lazy media con `fetchpriority=low`, 2/2 tracks de galeria pausados fuera de pantalla y consola sin errores/warnings; en movil 390x844 confirmo header fijo `0-80px`, hero visible, sin overflow horizontal, menu movil abierto con `aria-expanded=true`, `aria-hidden=false`, altura `343px`, `body overflow=hidden` y consola limpia; capturas Playwright/headless de home desktop y movil guardadas en `C:\tmp\eolo-desktop-home-qa.png` y `C:\tmp\eolo-mobile-home-qa.png`, con la hero visible en ambos viewports; pagina de venta movil revisada con `scroll-margin-top: 128px`, header estable y sin overflow; ZIP `eolo-hostalia-produccion.zip` regenerado desde el contenido directo de `dist/` y validado con 60 entradas, 4.158.159 bytes, sin carpeta `dist/` contenedora y con `index.html`, `assets/`, `images/`, `favicon.svg`, `robots.txt`, `sitemap.xml`, `venta-bicicletas-miami-platja/`, `taller-bicicletas-miami-platja/`, `alquiler-bicicletas-miami-platja/` y `contacto/` en raiz.
- Riesgos o pendientes: no se ejecuto Safari/iOS real ni Lighthouse/traza Performance nueva; las capturas Playwright necesitaron ejecucion fuera del sandbox por `spawn EPERM` al lanzar Chromium headless, pero pasaron correctamente. No se actualiza `docs/PROJECT_ANALYSIS.md` porque no cambian arquitectura, rutas, stack, SEO, datos de negocio ni activos.

### 2026-06-05 - Correccion de bleed superior en movil

- Objetivo: corregir el artefacto visual movil de la pagina de venta donde el texto `Hablar con nosotros` de la seccion anterior podia aparecer por encima del header al llegar a `Categorias`, especialmente en iPhone/Safari/Chrome movil.
- Origen del contexto: solicitud directa del usuario con captura del bug visual y requisito de mantener estetica, textos, animaciones, logo, menu, colores y estructura.
- Archivos tocados: `src/components/Header.astro`, `src/pages/venta-bicicletas-miami-platja.astro`, `docs/AI_CHANGELOG.md`, `dist/` generado, `eolo-hostalia-produccion.zip`.
- Cambios realizados: se reforzo el header fijo con una extension superior basada en `env(safe-area-inset-top)` para cubrir el area segura de iOS con el mismo fondo oscuro y evitar sangrados por encima de la cabecera; se anadio prefijo `-webkit-backdrop-filter` a header/menu para Safari; se limito `contain: paint` de las secciones de la pagina de venta a escritorio con puntero fino, evitando la combinacion movil de contencion de pintado, elementos revelados con transform y header fijo/backdrop que podia provocar mala composicion en iOS; se aumento solo en movil el `scroll-margin-top` de `#categorias` para que, al pulsar `Ver categorias`, el boton anterior `Hablar con nosotros` quede por debajo del borde superior y cubierto por el header opaco, no en coordenada negativa del viewport. No se cambiaron textos, imagenes, logo, colores, rutas, estructura ni animaciones.
- Validacion: `npm run build` correcto con salida estatica y 5 paginas generadas; preview estatico desde `dist/` en `http://127.0.0.1:4326/`; navegador integrado movil 390x844 en `/venta-bicicletas-miami-platja/` tras click en `Ver categorias` confirmo header `0-80px`, fondo scrolled `rgba(5, 7, 10, 0.94)`, `backdrop-filter: blur(4px)`, `scroll-margin-top: 128px` en `#categorias`, boton `Hablar con nosotros` en `0.15px-48.15px` y cubierto por el header, `contain: none` en la seccion anterior, `overflowX: 0` y consola sin errores/warnings; menu movil abierto/cerrado correcto con altura 343px, `aria-expanded`, `aria-hidden`, `inert`, `pointer-events` y `body overflow` correctos; escritorio 1280x720 confirmo navegacion desktop intacta, boton movil oculto, `contain: paint` conservado en escritorio y `overflowX: 0`; ZIP `eolo-hostalia-produccion.zip` regenerado desde el contenido directo de `dist/`, validado con 60 entradas, 4.157.892 bytes, sin carpeta `dist/` contenedora y con `index.html`, `assets/`, `images/`, `favicon.svg`, `robots.txt`, `sitemap.xml`, `venta-bicicletas-miami-platja/`, `taller-bicicletas-miami-platja/`, `alquiler-bicicletas-miami-platja/` y `contacto/` en raiz.
- Riesgos o pendientes: no se puede ejecutar Safari iOS real desde este entorno, por lo que la correccion se valido con navegador integrado/Chromium movil y con la causa observable en DOM/estilos; el intento inicial de `npm run dev` volvio a mostrar el `spawn EPERM` conocido del entorno, por lo que la validacion renderizada se hizo sobre el build estatico de produccion. No se actualiza `docs/PROJECT_ANALYSIS.md` porque no cambian arquitectura, rutas, stack, SEO, datos de negocio ni activos.

### 2026-06-05 - ZIP v2 con logo corregido

- Objetivo: generar un paquete de produccion con nombre representativo de segunda version para diferenciarlo del ZIP anterior y dejar claro que incluye la correccion del logo.
- Origen del contexto: solicitud directa del usuario tras revisar el preview y pedir regenerar el ZIP con un nombre identificable como segunda version.
- Archivos tocados: `eolo-hostalia-produccion-v2-logo-corregido.zip`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se creo `eolo-hostalia-produccion-v2-logo-corregido.zip` directamente desde el contenido actual de `dist/`, manteniendo el ZIP anterior sin borrarlo.
- Validacion: ZIP generado con 60 entradas y 4.157.755 bytes; verificado que no contiene carpeta `dist/` contenedora; comprobados en la raiz del ZIP `index.html`, `assets/`, `images/`, `favicon.svg`, `robots.txt`, `sitemap.xml`, `contacto/`, `venta-bicicletas-miami-platja/`, `taller-bicicletas-miami-platja/` y `alquiler-bicicletas-miami-platja/`; verificado que `images/eolo-logo.svg` esta incluido y contiene la correccion del logo (`viewBox="-24 0 294 86"` y `BIKES &#183; WORKSHOP &#183; COMMUNITY`).
- Riesgos o pendientes: no se ejecuto un nuevo build porque no hubo cambios de codigo tras el ultimo `npm run build` correcto; este ZIP usa el `dist/` ya regenerado con el logo corregido.

### 2026-06-05 - Correccion de recorte en subtitulo del logo

- Objetivo: corregir el recorte visual del subtitulo del logo para que se lea completo `BIKES · WORKSHOP · COMMUNITY`.
- Origen del contexto: solicitud directa del usuario con captura indicando que el logo se estaba comiendo la `B` inicial de `BIKES` y la `Y` final de `COMMUNITY`.
- Archivos tocados: `public/images/eolo-logo.svg`, `src/components/Header.astro`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`, `dist/` generado, `eolo-hostalia-produccion.zip`, `output/playwright/eolo-logo-fixed.png`.
- Cambios realizados: se amplio el `viewBox` y las dimensiones intrinsecas del SVG del logo para dar margen horizontal al subtitulo sin cambiar colores, tipografia, composicion ni texto; se sustituyeron los separadores del SVG por entidades `&#183;` para evitar problemas de codificacion; se ajustaron las dimensiones declaradas del `<img>` del header a `192x56` para reservar el ancho real del logo corregido; se regenero el ZIP de Hostalia desde el nuevo `dist/`.
- Validacion: `npm run build` correcto, con salida `static` y 5 paginas generadas; verificado que `public/images/eolo-logo.svg` y `dist/images/eolo-logo.svg` contienen `viewBox="-24 0 294 86"` y el texto completo `BIKES &#183; WORKSHOP &#183; COMMUNITY`; Playwright/headless sobre la home servida localmente confirmo logo cargado, dimensiones renderizadas `191x56`, `naturalWidth=294`, `naturalHeight=86`, sin errores de consola ni 404 locales; captura visual guardada en `output/playwright/eolo-logo-fixed.png`; ZIP `eolo-hostalia-produccion.zip` regenerado con 60 entradas, sin carpeta `dist/` contenedora y con `images/eolo-logo.svg` presente.
- Riesgos o pendientes: no se ejecuto la suite e2e completa porque el cambio se limita al asset del logo y al ancho declarado del header; conviene subir el ZIP regenerado si se usa el paquete de Hostalia creado previamente.

### 2026-06-05 - QA local de dist y ZIP para Hostalia

- Objetivo: verificar el build final servido desde `dist/` como sitio estatico real y crear el ZIP listo para subir a `httpdocs/` en Hostalia.
- Origen del contexto: solicitud directa del usuario para comprobar rutas, assets, consola, renderizado headless y estructura interna del ZIP sin incluir la carpeta `dist/` como contenedor.
- Archivos tocados: `eolo-hostalia-produccion.zip`, `output/playwright/hostalia-home-mobile.png`, `output/playwright/hostalia-home-desktop.png`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se sirvio `dist/` localmente en `http://127.0.0.1:4326` con servidor estatico equivalente al script del proyecto; se comprobaron rutas obligatorias, recursos locales referenciados desde HTML, renderizado headless movil/escritorio, menu movil y contenido visible; se genero `eolo-hostalia-produccion.zip` directamente desde el contenido de `dist/`, dejando en la raiz del ZIP `index.html`, `assets/`, `images/`, `favicon.svg`, `robots.txt`, `sitemap.xml` y las rutas internas. No se tocaron estetica, layout, textos, imagenes fuente, animaciones, rutas, dependencias ni configuracion.
- Validacion: `dist/` existe; rutas `/`, `/venta-bicicletas-miami-platja/`, `/taller-bicicletas-miami-platja/`, `/alquiler-bicicletas-miami-platja/`, `/contacto/`, `/robots.txt`, `/sitemap.xml`, `/favicon.svg` y `/images/eolo-og.jpg` respondieron 200; 52 recursos locales HTML (`/assets/`, `/images/` y favicon) respondieron 200 sin errores; `dist/assets/` contiene 1 CSS, 2 JS y 47 WebP, sin fuentes locales generadas; Playwright/headless confirmo H1 visible, cuerpo no vacio, imagenes visibles cargadas, `blockingRevealCount: 0`, sin overflow horizontal, menu movil funcional y sin errores de consola, `pageerror`, request failures locales ni HTTP locales >=400; capturas guardadas en `output/playwright/`; ZIP validado con 60 entradas, 4.157.746 bytes, `HasDistContainer: False` y todos los elementos raiz requeridos presentes.
- Riesgos o pendientes: Playwright fallo inicialmente dentro del sandbox con `spawn EPERM` al lanzar Microsoft Edge, por lo que la verificacion de navegador se ejecuto fuera del sandbox y paso correctamente; no se ejecuto `npm run build` porque no se modifico el sitio ni se detectaron errores funcionales en el build existente.

### 2026-06-05 - Preparacion de build estatico para Hostalia

- Objetivo: dejar preparada la carpeta final de produccion para subir la web estatica de EOLO Bikes a Hostalia/Plesk mediante FTP o administrador de archivos.
- Origen del contexto: solicitud directa del usuario para revisar el proyecto real, confirmar salida estatica Astro, ejecutar instalacion/build y verificar la estructura exacta de `dist/`.
- Archivos tocados: `astro.config.mjs`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`, `dist/` generado.
- Cambios realizados: se confirmo que `site` apunta a `https://eolobikes.com`, que `npm run build` ejecuta `astro build` y que Astro genera salida `static`; se anadio `build.assets: 'assets'` en `astro.config.mjs` para que los recursos compilados salgan en `dist/assets/` en vez del directorio por defecto `dist/_astro/`, alineando la carpeta final con la estructura esperada en Hostalia. No se tocaron estetica, layout, textos, imagenes fuente, animaciones, rutas ni dependencias.
- Validacion: `npm install` correcto, dependencias al dia y 0 vulnerabilidades; `npm run build` correcto tras el ajuste, con 5 paginas generadas; comprobado `dist/index.html`, `dist/venta-bicicletas-miami-platja/index.html`, `dist/taller-bicicletas-miami-platja/index.html`, `dist/alquiler-bicicletas-miami-platja/index.html`, `dist/contacto/index.html`, `dist/assets/`, `dist/robots.txt`, `dist/sitemap.xml`, `dist/images/eolo-og.jpg` y `dist/favicon.svg`; comprobado que `dist/assets/` contiene 1 CSS, 2 JS y 47 WebP, que no quedan referencias a `/_astro/`, que todas las URLs locales `/assets/...` referenciadas por los HTML existen y que `robots.txt`/`sitemap.xml` apuntan a `https://eolobikes.com`.
- Riesgos o pendientes: para Hostalia debe subirse el contenido de dentro de `dist/`, no la carpeta `dist` completa; ademas de `assets/` tambien debe subirse `images/` porque contiene la imagen social `eolo-og.jpg`. No se ejecuto `npm run test:e2e` porque el objetivo fue empaquetado y verificacion de build estatico, no una regresion visual completa.

### 2026-06-05 - Contencion de pintado en pagina de venta

- Objetivo: mejorar ligeramente la fluidez de scroll en la pagina de venta/tienda sin afectar estetica, layout, overlays, blur, textos, rutas, SEO ni animaciones.
- Origen del contexto: solicitud directa del usuario indicando que queria el scroll de la tienda un poco mas fluido sin cambiar la estetica ni las animaciones.
- Archivos tocados: `src/pages/venta-bicicletas-miami-platja.astro`, `tests/e2e/preproduction.spec.ts`, `docs/RENDIMIENTO.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se anadio `class="sale-page"` al `<main>` de venta y una regla local `contain: paint` para sus secciones directas, acotando el repintado de secciones pesadas sin modificar ningun valor visual ni de movimiento; se ajusto la spec e2e del menu movil para aceptar tanto la variante sin tilde como la variante con tilde en los nombres accesibles, alineandola con la correccion ortografica previa; se documento la decision en `docs/RENDIMIENTO.md`.
- Validacion: `npm run build` correcto; navegador integrado sobre `http://127.0.0.1:4321/venta-bicicletas-miami-platja/` con titulo correcto, DOM de venta presente, consola sin `error`/`warn`, 6 secciones directas con `contain: paint` computado y sin overflow horizontal; captura movil Playwright/Edge en `C:\tmp\eolo-venta-after.png` tras scroll a `scrollY=1600`, sin recortes visibles ni logs relevantes; `npm run test:e2e` fallo primero dentro del sandbox por `spawn EPERM` del entorno, y despues correcto fuera del sandbox con 8/8 tests pasados.
- Riesgos o pendientes: no se ejecuto una traza Performance/Lighthouse especifica para cuantificar la mejora; si en el futuro una seccion directa de venta necesita pintar contenido fuera de su caja, habria que retirar `contain: paint` solo de esa seccion. No se actualiza `docs/PROJECT_ANALYSIS.md` porque no cambian arquitectura, rutas, stack, SEO, datos de negocio ni activos.

### 2026-06-05 - Corrección de tildes y puntuación en copy

- Objetivo: corregir las faltas ortográficas detectadas en textos visibles y etiquetas accesibles sin alterar diseño, rutas, SEO ni datos reales del negocio.
- Origen del contexto: solicitud directa del usuario tras revisar la lista de posibles correcciones ortográficas.
- Archivos tocados: `src/lib/constants.ts`, `src/components/Header.astro`, `src/components/FAQSection.astro`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se corrigieron las tildes de `Miércoles` y `Sábado` en el horario renderizado; se actualizaron las etiquetas ARIA del menú móvil a `menú`, `navegación` y `móvil`; se convirtió la nota final del FAQ en pregunta con signos de apertura y cierre.
- Validación: `npm run build` correcto.
- Riesgos o pendientes: cambio de bajo riesgo limitado a copy y accesibilidad; no se ha actualizado `docs/PROJECT_ANALYSIS.md` porque no cambia arquitectura, rutas, stack, SEO, datos de negocio ni activos.

### 2026-06-04 - Gestion dinamica de will-change en resenas

- Objetivo: mejorar la fluidez de scroll reduciendo presion de capas/compositor en el ticker de resenas sin cambiar diseno, velocidad, drag, textos, rutas, SEO ni accesibilidad.
- Origen del contexto: solicitud directa del usuario indicando que el scroll va a trompicones, continuando el plan de `docs/RENDIMIENTO.md` tras la ronda previa de blur.
- Archivos tocados: `src/components/ReviewsSection.astro`, `docs/RENDIMIENTO.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se quito la clase permanente `will-change-transform` de `.reviews-track`; el script del ticker ahora activa `will-change: transform` solo cuando `.reviews-ticker` entra en viewport o durante arrastre, y lo devuelve a `auto` al salir. Se probaron y descartaron variantes de sustitucion de `mask-image` por overlays laterales en Gallery/Reviews porque empeoraron paint/composite, por lo que no quedan cambios finales en masks.
- Validacion: `npm run build` correcto; preview en `http://127.0.0.1:4321/`; traza Chrome/Playwright/CDP movil 390x844 DPR 3 CPU 4x y scroll 14043 px: paint/raster 7732.9 ms -> 6974.1 ms, composite/layers 3235.5 ms -> 3024.2 ms, JavaScript 344.2 ms -> 285.4 ms, paint flashing proxy 348891 -> 27793 pixeles verdes; Lighthouse movil tras el cambio en dos pasadas: Performance 90/90, LCP 2901.2/2907.9 ms, CLS 0, TBT 0 ms; navegador integrado con consola sin errores/warnings y verificacion de `will-change` auto -> transform -> auto al entrar/salir de viewport; `npm run test:e2e` correcto fuera del sandbox tras un `spawn EPERM` inicial del entorno, 8/8 tests pasados.
- Riesgos o pendientes: `Layout / style` subio en la traza agregada (1689.9 ms -> 2022.4 ms), aunque no hubo regresion en LCP/CLS/TBT y las categorias objetivo mejoraron; queda pendiente atacar imagenes lazy/widths de Gallery y editorial-banner una por una si se quiere seguir afinando.

### 2026-06-04 - Reduccion de blur para mejorar fluidez de scroll

- Objetivo: ejecutar el paso 1 del plan de rendimiento, reduciendo coste de paint/raster asociado a `backdrop-filter` en superficies glass y header fijo sin cambiar perceptiblemente la estetica premium.
- Origen del contexto: solicitud directa del usuario basada en `docs/RENDIMIENTO.md`, con orden estricto de atacar primero `.glass-surface` y `Header.astro`, medir antes/despues con Lighthouse movil, traza de scroll y paint flashing, y no mezclar accesibilidad.
- Archivos tocados: `src/styles/global.css`, `src/components/Header.astro`, `docs/RENDIMIENTO.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se redujo `.glass-surface` de `blur(22px)` a `blur(14px)` en desktop y de `blur(10px)` a `blur(6px)` en movil, compensando con una opacidad de fondo apenas mayor; se redujo el header scrolleado de `blur(18px)` a `blur(12px)` y en movil de `blur(10px)` a `blur(4px)`, con fondo mas opaco; se bajo el blur del menu movil de `18px/12px` a `10px/6px`. No se tocaron marquees, masks, will-change, imagenes, layout, rutas, SEO, datos de negocio, dependencias ni accesibilidad.
- Validacion: `npm run build` correcto; preview en `http://127.0.0.1:4321/`; Lighthouse movil antes/despues con CPU 4x: Performance 90 -> 99, LCP 2898.5 ms -> 1651.6 ms, CLS 0 -> 0, TBT 0 ms -> 0 ms (la pasada posterior genero JSON completo aunque el CLI devolvio `EPERM` al limpiar perfil temporal); traza Chrome/Playwright/CDP movil 390x844 DPR 3 CPU 4x y scroll 14141 px: paint/raster 6296.2 ms -> 6163.7 ms, eventos paint/raster 12274 -> 11531, paint flashing proxy 71177 -> 53555 pixeles verdes, composite/layers 2605.9 ms -> 2662.9 ms; navegador integrado con titulo correcto, contenido presente y consola sin errores/warnings; comparativa visual movil `scrollY=700` con delta maximo 1/255 y 0 pixeles por encima de delta 4; `npm run test:e2e` correcto fuera del sandbox tras un `spawn EPERM` inicial del entorno, 8/8 tests pasados.
- Riesgos o pendientes: `Composite / layers` subio ligeramente (+2.2%) aunque paint/raster y paint flashing mejoraron; vigilar en la siguiente ronda antes de tocar masks. Quedan pendientes los pasos 2-4 del plan (marquees/masks, will-change del ticker, imagenes) y la accesibilidad 93 como tarea separada.

### 2026-06-04 - Linea base real de rendimiento en produccion

- Objetivo: medir el rendimiento real de la home antes de aplicar nuevas optimizaciones y documentar una linea base reproducible en `docs/RENDIMIENTO.md`.
- Origen del contexto: solicitud directa del usuario para ejecutar `npm run build`, `npm run preview`, Lighthouse movil y una pasada tipo Chrome DevTools Performance con CPU 4x, sin modificar estetica, diseno, layout, contenido ni animaciones.
- Archivos tocados: `docs/RENDIMIENTO.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se anadio la seccion `Linea base real de rendimiento` con fecha, comandos, entorno, tabla de metricas Lighthouse, elemento LCP, diagnostico de scroll Performance/CDP, cuellos de botella, hipotesis y cambios recomendados sin aplicar; se anadio tambien `Plan de optimizacion recomendado` priorizado por impacto/riesgo y archivo afectado. No se modifico ningun archivo de la web visual, CSS, componentes, scripts, contenido, rutas, SEO, assets ni animaciones.
- Validacion: `npm run build` correcto; `npm run preview -- --host 127.0.0.1 --port 4321` levantado y home respondiendo HTTP 200; Lighthouse 13.3.0 movil contra `http://127.0.0.1:4321/` con throttling estandar (`simulate`, RTT 150 ms, throughput 1638.4 Kbps, CPU 4x), scores 99/93/100/100, LCP 1680.8148 ms, CLS 0.005894, TBT 0 ms; navegador integrado de Codex con titulo correcto y sin errores/warnings de consola; traza Chrome/Playwright CDP con `Emulation.setCPUThrottlingRate(4)` y scroll completo de 14141 px confirmando que el coste dominante es paint/raster/composite.
- Riesgos o pendientes: Lighthouse es medicion lab y puede variar entre pasadas; la traza Performance se obtuvo por Chrome DevTools Protocol headless, no con interaccion manual en DevTools UI, aunque usa las mismas primitivas de tracing y throttling; no se aplicaron optimizaciones todavia; quedan pendientes de decidir los cambios visualmente sensibles (blur, masks, compresion de imagenes, fuentes) y una tarea separada para corregir Accessibility 93.

### 2026-06-04 - Optimizacion de rendimiento de imagenes (srcset responsive) sin perdida visual

- Objetivo: hacer la web mas rapida en movil (LCP/transferencia) sin cambiar absolutamente nada de estetica, composicion, animaciones, textos, rutas ni SEO.
- Origen del contexto: solicitud directa del usuario para una fase exclusiva de rendimiento tras dar la web por terminada y estable, con regla de cero perdida visual.
- Archivos tocados: `src/components/Hero.astro`, `src/components/RentalSection.astro`, `src/components/WorkshopSection.astro`, `src/pages/venta-bicicletas-miami-platja.astro`, `src/pages/taller-bicicletas-miami-platja.astro`, `src/pages/alquiler-bicicletas-miami-platja.astro`, `src/pages/contacto.astro`, `public/images/eolo-logo.jpg` (eliminado), `docs/AI_CHANGELOG.md`.
- Cambios realizados: se anadio `widths` a los 5 `<Image>` de los HERO (eager + fetchpriority=high, candidatos a LCP), que solo declaraban `sizes="100vw"` y por tanto Astro emitia una unica variante al tamano intrinseco (~1774px) que tambien descargaba el movil; ahora generan srcset responsive y el movil elige la variante pequena. Mismo fichero fuente, mismo encuadre (`object-position`/`object-fit`/`transform` sin tocar), mismo formato WebP, misma calidad: solo cambia el numero de pixeles descargados. Se aplico el mismo `widths` a tres imagenes lazy pesadas que aun se servian en variante unica (RentalSection, WorkshopSection y la imagen secundaria de Venta `eolo-concept`), siguiendo el patron que ya usaban Manifesto y EditorialBanner. Se elimino `public/images/eolo-logo.jpg` (40 kB), asset huerfano con cero referencias en todo el repo (el logo visible y el del schema usan `eolo-logo.svg` via `LOGO_PATH`). No se toco JS, CSS, fuentes, schema, rutas ni dependencias.
- Validacion: `npm run build` correcto (5 paginas, ahora 46 variantes WebP); `npm run test:e2e` correcto con 8/8 tests pasados (incluye los 5 HERO con H1/HERO visibles y cero errores de consola, no-scroll-horizontal en movil 390px y el test sin IntersectionObserver). Medidas antes/despues de la variante WebP que descarga un movil ~390px: home `eolo-hero` 76 kB -> 15-29 kB; taller `eolo-workshop` 88 kB -> 16-30 kB; alquiler `eolo-rental` 192 kB -> 43-81 kB; venta `venta-hero-rider` 120 kB -> 32-59 kB; contacto `editorial-banner` ahora con variante 640px de 59 kB; secundaria de venta `eolo-concept` 164 kB -> 55 kB. JS (3.9 kB gz total en 2 bundles) y CSS (9.4 kB gz) sin cambios. El total en disco de `dist` sube de 2.9 MB a 4.3 MB porque se almacenan mas variantes, pero la transferencia por visita en movil baja: es almacenamiento del host, no descarga del usuario.
- Riesgos o pendientes: `npm audit` reporta 3 vulnerabilidades (2 moderate, 1 high) en tooling de build (astro -> vite/esbuild); la advisory raiz real es la de esbuild en el dev-server (GHSA-67mh-4wv8-2f99), que solo afecta a `astro dev` y no al output estatico de produccion; su correccion exige `astro@6` (major breaking), fuera del alcance de una fase de rendimiento sin refactor y sin tocar dependencias; es estado preexistente, no introducido por estos cambios. No se aplicaron por riesgo: preload manual del LCP con imagesrcset (URL hasheada fragil y posible 404 que romperia el test de consola), conversion a `<Picture>` AVIF+WebP (cambio estructural en 5 HERO) y `content-visibility`/`contain` en secciones (ya se retiro antes por picos de layout); quedan documentadas como mejoras opcionales futuras.

### 2026-06-04 - Responsive premium y QA e2e estable

- Objetivo: mejorar la experiencia responsive movil de EOLO sin redisenar la web y cerrar la validacion real de menu movil, HERO/reveals, rutas, SEO tecnico y ausencia de overflow.
- Origen del contexto: solicitud directa del usuario para continuar la fase de responsive premium tras bloqueos anteriores, con validacion en 320, 360, 375, 390, 414, 430, 768, 1024 y escritorio.
- Archivos tocados: `src/styles/global.css`, `src/components/Hero.astro`, `playwright.config.ts`, `scripts/serve-static.mjs`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se ajustaron solo reglas responsive moviles de HERO, CTAs, menus, anchuras de seccion y titulares internos para mejorar legibilidad y area tactil; se acorto el watchdog local del HERO de inicio de 2200ms a 1600ms para reducir el riesgo de elementos criticos en `opacity: 0` si el reveal global tarda; se anadio un servidor estatico Node minimo para que Playwright sirva `dist/` de forma estable y se cambio `playwright.config.ts` para usarlo en vez de `astro preview`.
- Validacion: `npm run build` correcto; `npm run test:e2e` correcto fuera del sandbox con 8/8 tests pasados; `npm run lint --if-present`, `npm run check --if-present` y `npm run type-check --if-present` sin salida porque no hay scripts configurados; `npm audit` y `npm audit --omit=dev` correctos con 0 vulnerabilidades; validacion en navegador integrado sobre 45 combinaciones ruta/viewport confirmando 0 overflow horizontal, un unico H1 por pagina, CTAs visibles y HERO estable; prueba especifica del menu movil en 320, 375, 390 y 430 confirmando apertura por click, enlaces visibles, altura real de 343px, cierre por enlace/Escape y sin bloqueo de body; capturas de control en Home movil, menu movil, Venta movil y Home escritorio.
- Riesgos o pendientes: los enlaces externos se revisaron por formato pero no se abrieron por red; la suite e2e sigue usando canal `msedge`, por lo que otra maquina necesitara Microsoft Edge instalado o ajustar el proyecto Playwright.

### 2026-06-04 - Preparacion SEO local para produccion

- Objetivo: reforzar la web existente para produccion real, indexacion en Google y SEO local sin crear paginas nuevas, blog ni rutas inventadas.
- Origen del contexto: solicitud directa del usuario tras pasar QA preproduccion automatizado con Playwright.
- Archivos tocados: `src/lib/constants.ts`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/venta-bicicletas-miami-platja.astro`, `src/pages/taller-bicicletas-miami-platja.astro`, `src/pages/alquiler-bicicletas-miami-platja.astro`, `src/pages/contacto.astro`, `docs/PRODUCTION_SEO.md`, `README.md`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se centralizaron dominio, nombre, logo, imagen OG, rutas principales y areas servidas; se normalizaron canonicals con trailing slash para las cinco rutas reales; se anadio `meta robots` `index, follow`; se actualizo el JSON-LD global a `SportingGoodsStore` con `WebSite`, areas servidas, servicios principales y breadcrumbs automaticos en paginas internas; se retiraron del schema datos no centralizados como email y geocoordenadas; se ajustaron titles/descriptions/OG de Home, Venta, Taller, Alquiler y Contacto con foco local y sin keyword stuffing; se mejoraron los schemas `Service` y `ContactPage`; se creo `docs/PRODUCTION_SEO.md` con checklist de publicacion, Search Console, sitemap, Google Business Profile, medicion y pendientes del propietario.
- Validacion: `npm run build` correcto; `npm run test:e2e` correcto fuera del sandbox tras un `spawn EPERM` del entorno, con 8/8 tests pasados; `npm audit --omit=dev --audit-level=high` y `npm audit --audit-level=high` correctos, 0 vulnerabilidades; `npm run lint --if-present`, `npm run check --if-present` y `npm run type-check --if-present` sin salida porque no hay scripts configurados; revision de `dist` confirmando robots/sitemap, canonicals, meta robots, OG/Twitter, JSON-LD valido, assets locales existentes y un unico H1 por pagina.
- Riesgos o pendientes: la indexacion real requiere tareas externas como verificar dominio en Google Search Console, enviar sitemap, solicitar indexacion, configurar Google Business Profile, confirmar datos finales del negocio y conseguir resenas/enlaces locales; la suite e2e sigue dependiendo de Microsoft Edge instalado.

### 2026-06-04 - QA e2e preproduccion con Playwright

- Objetivo: cerrar la incertidumbre pendiente sobre clicks reales del menu movil, navegacion, reveals/HERO, rutas principales y SEO tecnico basico antes de ensenar o publicar la web.
- Origen del contexto: solicitud directa del usuario tras auditorias y correcciones previas, pidiendo un bloque de QA automatizado minimo, util y estable sin redisenar la web.
- Archivos tocados: `package.json`, `package-lock.json`, `playwright.config.ts`, `tests/e2e/preproduction.spec.ts`, `.gitignore`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se instalo `@playwright/test` como dependencia de desarrollo; se anadieron los scripts `test:e2e` y `test:e2e:headed`; se creo una configuracion Playwright con `astro preview` y Microsoft Edge del sistema; se implemento una spec de preproduccion que valida menu movil con clicks reales, cierre por Escape, navegacion a Inicio/Venta/Taller/Alquiler/Contacto, ausencia de scroll horizontal, H1 y CTAs visibles, elementos HERO/reveal criticos sin `opacity: 0`, fallback sin `IntersectionObserver`, `prefers-reduced-motion`, `robots.txt` y `sitemap.xml`; se ignoraron artefactos de Playwright en `.gitignore`.
- Validacion: `npm run build` correcto; `npm run test:e2e` correcto fuera del sandbox tras un primer `spawn EPERM` del entorno y con resultado final 8/8 tests pasados; `npm run test:e2e:headed` correcto con 8/8 tests pasados; `npm run check --if-present`, `npm run lint --if-present` y `npm run type-check --if-present` sin salida porque no hay scripts configurados; `npm audit --omit=dev --audit-level=high` y `npm audit --audit-level=high` correctos, 0 vulnerabilidades.
- Riesgos o pendientes: la suite depende de que Microsoft Edge este instalado en la maquina que la ejecute; si se mueve a un entorno CI sin Edge habria que instalar navegadores de Playwright o ajustar el canal.

### 2026-06-03 - Refuerzo del fallback de reveals

- Objetivo: corregir el fallo detectado durante la verificacion post-cambios cuando `IntersectionObserver` existe pero no entrega callbacks.
- Origen del contexto: auditoria QA post-cambios solicitada por el usuario; la prueba headless con el observer neutralizado dejaba parcialmente ocultos elementos del HERO de inicio.
- Archivos tocados: `src/scripts/animations.ts`, `src/components/Hero.astro`, `src/components/Header.astro`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se ajusto `showElement` para poder forzar visibilidad inmediata, limpiar delays de transicion en modo fallback y aplicar `opacity`/`transform` con prioridad inline; los fallbacks de reduced motion, observer ausente y watchdog global usan ahora esa ruta instantanea; se anadio un watchdog local para los elementos `data-hero-reveal` del HERO de inicio; se reforzo la apertura del menu movil calculando la altura tambien de forma sincrona antes del `requestAnimationFrame`.
- Validacion: `npm run build` correcto tras los cambios; `npm run lint --if-present`, `npm run type-check --if-present` y `npm run check --if-present` sin salida porque no hay scripts configurados; prueba renderizada en navegador integrado confirmando menu abierto con `aria-expanded="true"`, `aria-hidden="false"`, `hidden=false`, `max-height: 324px`, enlaces de 44px y sin overflow horizontal; captura headless de Edge con `IntersectionObserver` neutralizado confirmando que el HERO de inicio vuelve a mostrar titulo, subtitulo y CTA tras el watchdog. 
- Riesgos o pendientes: la API de click por locator/nodo del navegador integrado quedo inestable durante la validacion, por lo que los clicks reales en enlaces del menu se contrastaron parcialmente con DOM visible, estados ARIA y estructura de enlaces; no se abrieron enlaces externos por red.

### 2026-06-03 - Correcciones de auditoria de calidad y accesibilidad

- Objetivo: corregir de forma quirurgica los problemas detectados en la auditoria: reveals invisibles, menu movil inconsistente, robots/sitemap, textos concatenados, assets publicos pesados y foco accesible.
- Origen del contexto: solicitud directa del usuario a partir del informe de auditoria completa de la web EOLO.
- Archivos tocados: `src/scripts/animations.ts`, `src/components/Header.astro`, `src/components/Hero.astro`, `src/components/ManifestoSection.astro`, `src/pages/venta-bicicletas-miami-platja.astro`, `src/pages/taller-bicicletas-miami-platja.astro`, `src/pages/alquiler-bicicletas-miami-platja.astro`, `src/pages/contacto.astro`, `src/styles/global.css`, `src/layouts/Layout.astro`, `public/robots.txt`, `public/images/eolo-og.jpg`, `public/images/eolo-hero.png`, `public/images/eolo-rental.png`, `public/images/eolo-concept.png`, `public/images/eolo-workshop.png`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se reestructuro `animations.ts` para inicializar en DOM listo, comprobar elementos ya visibles, respetar `prefers-reduced-motion` y mostrar contenido con fallbacks temporales; se hizo el menu movil mas robusto con `hidden`, `inert`, `aria-hidden`, altura calculada por `scrollHeight`, cierre por enlaces, Escape y entrada a breakpoint desktop; se anadio foco visible global; se corrigio `robots.txt` para apuntar a `/sitemap.xml`; se corrigieron espacios semanticos en titulares fragmentados; se genero una imagen OG optimizada de 1200x630 y se retiraron copias PNG pesadas del directorio publico que ya no eran necesarias.
- Validacion: `npm run build` correcto; no existen scripts `lint`, `type-check` ni `check` en `package.json`; validacion renderizada en navegador integrado sobre Home, Venta, Taller, Alquiler y Contacto en 320, 375, 390, 430, tablet y desktop confirmando 0 overflow horizontal, 0 reveals visibles ocultos, 0 elementos HERO esenciales con `opacity: 0`, H1 semanticos con espacios correctos y `og:image` apuntando a `https://eolobikes.com/images/eolo-og.jpg`; validacion del menu movil en 320, 375, 390 y 430 confirmando apertura con altura real, enlaces de 44px, `opacity: 1`, `pointer-events: auto`, cierre por Escape con `hidden/inert` y navegacion funcional a Inicio, Venta, Taller, Alquiler y Contacto.
- Riesgos o pendientes: los enlaces externos no se abrieron por red en esta validacion; `@astrojs/sitemap` sigue instalado pero el sitemap continua gestionado manualmente porque era la solucion mas pequena y coherente con el estado actual.

### 2026-06-03 - Ajustes visuales en los HERO y nueva foto para ventas

- Objetivo: colocar la nueva imagen facilitada por el usuario en el HERO de ventas, hacer algo mas finos los acentos de color en los titulares HERO y centrar mejor las palabras de fondo en los HERO internos.
- Origen del contexto: solicitud directa del usuario con la imagen local `C:/Users/epedr/Downloads/ChatGPT Image 3 jun 2026, 15_31_08.png`.
- Archivos tocados: `src/assets/images/venta-hero-rider.png`, `src/components/Hero.astro`, `src/pages/venta-bicicletas-miami-platja.astro`, `src/pages/taller-bicicletas-miami-platja.astro`, `src/pages/alquiler-bicicletas-miami-platja.astro`, `src/pages/contacto.astro`, `src/styles/global.css`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se copio la nueva foto al arbol de assets del proyecto y se asigno solo al fondo del HERO de ventas manteniendo la imagen secundaria original de esa pagina; se introdujeron las clases reutilizables `hero-accent-mark` y `subpage-hero-word`; se redujo el peso visual de los textos acentuados de color en los HERO bajando su grosor y se centro el gran wordmark de los HERO que no son el de inicio.
- Validacion: `npm run build` correcto; comprobacion funcional y de estilos computados en navegador integrado sobre `/`, `/venta-bicicletas-miami-platja` y `/contacto`; capturas visuales complementarias con Playwright CLI en escritorio y movil para el HERO de ventas y en escritorio para contacto, tras un timeout del screenshot nativo del navegador integrado.
- Riesgos o pendientes: el nuevo encuadre del HERO de ventas queda bien en escritorio y movil probados; si luego quieres hilar fino, el unico ajuste potencial seria afinar el recorte para pantallas ultrapanoramicas muy anchas.

### 2026-06-02 - Fondo ciclista local en la seccion de manifiesto

- Objetivo: sustituir la imagen visual del bloque "No vendemos bicicletas. Vendemos libertad." por la fotografia de la bici facilitada por el usuario.
- Origen del contexto: solicitud directa del usuario con la imagen local `C:/Users/epedr/Downloads/ChatGPT Image 2 jun 2026, 22_55_29.png`.
- Archivos tocados: `src/components/ManifestoSection.astro`, `src/assets/images/manifesto-bike-bg.png`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se copio la nueva imagen al arbol de assets del proyecto, se reemplazo la foto remota del panel visual de `ManifestoSection` por un asset local servido con `astro:assets`, se ajusto el encuadre con `object-position` y se reforzo el overlay para mantener el contraste del texto y la cita.
- Validacion: `npm run build` correcto en local; comprobacion visual en navegador integrado sobre `http://127.0.0.1:4173/` confirmando que la seccion usa el nuevo asset optimizado.
- Riesgos o pendientes: la comprobacion visual se hizo en viewport estrecho del navegador integrado; si luego quieres, puedo afinar tambien el recorte exacto para escritorio ancho.

### 2026-06-02 - Actualizacion de telefono y horario comercial

- Objetivo: sustituir el telefono visible del negocio por `621 27 78 40` y reflejar el horario real de apertura de forma clara en la web y en el schema SEO.
- Origen del contexto: solicitud directa del usuario con el nuevo numero y el horario semanal detallado.
- Archivos tocados: `src/lib/constants.ts`, `src/layouts/Layout.astro`, `src/components/ContactSection.astro`, `src/components/CTASection.astro`, `src/components/Footer.astro`, `src/pages/contacto.astro`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se actualizo el telefono mostrado en toda la web, se anadio su variante internacional para enlaces `tel:` y `LocalBusiness`, se centralizo el horario comercial en constantes reutilizables, se corrigio `openingHoursSpecification` con franjas de manana y tarde por dia y se incorporo un bloque visual de horario en la seccion de contacto.
- Validacion: `npm run build` correcto en local y comprobacion visual del bloque de contacto/horario en navegador integrado sobre una vista previa estatica.
- Riesgos o pendientes: el enlace de WhatsApp sigue apuntando al placeholder existente porque el propietario no ha confirmado de forma explicita si ese mismo numero debe usarse tambien en WhatsApp.

### 2026-06-02 - Sustitucion del favicon por el isotipo EOLO

- Objetivo: colocar en la pestana del navegador un favicon fiel al logo facilitado por el propietario y con mejor nitidez que la version anterior.
- Origen del contexto: solicitud directa del usuario con referencia visual `LOGOOO.jpg`.
- Archivos tocados: `public/favicon.svg`, `src/layouts/Layout.astro`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se reemplazo el antiguo favicon ilustrado por una recreacion vectorial del isotipo cuadrado de EOLO en blanco y negro, manteniendo la carga global desde `Layout.astro` y afinando la declaracion del icono SVG para navegadores.
- Validacion: `npm run build` correcto en local tras sustituir el favicon y mantener el sitio en salida estatica.
- Riesgos o pendientes: el detalle `13` del logo queda muy reducido en tamanos minimos de favicon; si el propietario quiere priorizar legibilidad extrema, podria prepararse una variante simplificada para 16x16.

### 2026-06-02 - Sistema de documentacion persistente para futuras IAs

- Objetivo: dejar memoria operativa y tecnica para que cualquier IA pueda continuar el trabajo con contexto suficiente.
- Origen del contexto: analisis directo del repositorio y del informe `PERFORMANCE_OPTIMIZATION_REPORT.md`.
- Archivos tocados: `.gitignore`, `README.md`, `AGENTS.md`, `docs/PROJECT_ANALYSIS.md`, `docs/AI_CHANGELOG.md`.
- Cambios realizados: se creo una entrada clara para humanos (`README.md`), una guia obligatoria para agentes (`AGENTS.md`), un analisis del proyecto y este registro cronologico. Tambien se amplio `.gitignore` para incluir artefactos locales y generados como `.astro/` y `.claude/`.
- Validacion: revision manual de estructura, stack, paginas, layout, constantes y documento previo de rendimiento. `npm run build` correcto tras relanzarlo fuera del sandbox por un `spawn EPERM` del entorno.
- Riesgos o pendientes: la historia anterior al informe de rendimiento sigue siendo parcial porque el repositorio no aporta trazabilidad Git util en el estado actual.

### 2026-06-02 - Optimizacion de rendimiento del frontend

- Objetivo: reducir peso inicial, coste de scroll y carga de imagenes conservando la estetica premium del sitio.
- Origen del contexto: confirmado por `PERFORMANCE_OPTIMIZATION_REPORT.md`.
- Archivos tocados: `astro.config.mjs`, `package.json`, `package-lock.json`, `src/assets/images/*`, `src/components/Header.astro`, `src/components/Hero.astro`, `src/components/EditorialBanner.astro`, `src/components/ManifestoSection.astro`, `src/components/WorkshopSection.astro`, `src/components/RentalSection.astro`, `src/components/GallerySection.astro`, `src/components/ReviewsSection.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/venta-bicicletas-miami-platja.astro`, `src/pages/taller-bicicletas-miami-platja.astro`, `src/pages/alquiler-bicicletas-miami-platja.astro`, `src/pages/contacto.astro`, `src/scripts/animations.ts`, `src/styles/global.css`.
- Cambios realizados: se eliminaron React, GSAP, ScrollTrigger y Lenis del cliente; se movieron imagenes principales a `astro:assets`; se introdujo un sistema ligero de reveal/parallax con `IntersectionObserver`; se redujo blur/sombras en movil; se optimizo la experiencia responsive y de movimiento reducido.
- Validacion: `npm run build` correcto, preview local funcional, consola sin errores relevantes y menu movil validado segun el informe.
- Riesgos o pendientes: todavia existen imagenes remotas que podrian localizarse; `@astrojs/sitemap` seguia recomendado para revision futura.

### 2026-06-02 - Estado base inferido antes de la optimizacion

- Objetivo: dejar constancia del punto de partida mas probable del proyecto.
- Origen del contexto: inferido por la estructura actual del repositorio; no confirmado por historial Git.
- Archivos tocados: no aplica como cambio directo; se documenta el estado previo conocido.
- Cambios realizados: se asume que se construyo una web Astro multipagina para EOLO Bikes con foco en SEO local, estructura modular por componentes, layout global con schema `LocalBusiness`, paginas por linea de negocio y recursos estaticos en `public/`.
- Validacion: coincidencia entre estructura de `src/pages/`, `src/components/`, `src/layouts/Layout.astro`, `src/lib/constants.ts` y la presencia de activos visuales del negocio.
- Riesgos o pendientes: esta entrada es una reconstruccion tecnica, no una cronologia certificada.
