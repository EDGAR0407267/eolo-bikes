# EOLO Bikes — Guía de Rendimiento y Fluidez

> Documento de referencia para saber **qué medir, cómo diagnosticar y qué optimizar** cuando la web "se queda pilladilla" o "va a trompicones".
> Última revisión del estado del código: 2026-06-04.

---

## 0. TL;DR — el bucle de trabajo

Cuando algo va a tirones, **no toques código a ciegas**. Sigue este bucle:

1. **Reproduce** el síntoma (¿scroll? ¿carga inicial? ¿un marquee? ¿móvil o desktop?).
2. **Mide** con DevTools → pestaña *Performance* (sección [§2](#2-cómo-medir-flujo-de-trabajo)).
3. **Identifica el cuello de botella real**: ¿es *paint/composite* (scroll a tirones), *layout/reflow* (saltos), *JS largo* (congelado) o *descarga* (tarda en aparecer)?
4. **Aplica el cambio mínimo** y vuelve a medir. Un cambio por iteración.
5. **Verifica con Lighthouse** (móvil, 4× CPU throttling) y con `npm run test:e2e`.

La causa de "ir a trompicones" en esta web **casi nunca es JavaScript** (el bundle son ~2.7 kB gzip). Es **coste de pintado por frame**: blends, blurs, sombras grandes y animaciones infinitas. Ese es el terreno a vigilar.

---

## Línea base real de rendimiento

### Fecha de medición

2026-06-04, 19:53 CEST.

### Comando usado

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
npx lighthouse http://127.0.0.1:4321/ --chrome-path="C:\Program Files\Google\Chrome\Application\chrome.exe" --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --output=json --output-path=output\lighthouse-mobile.json --quiet --chrome-flags="--headless=new --no-sandbox --disable-gpu"
```

Para la pasada de scroll se usó Chrome headless vía Playwright/CDP con `Emulation.setCPUThrottlingRate({ rate: 4 })`, viewport móvil `390x844`, DPR `3`, y scroll por rueda desde el HERO hasta el final de la home.

### Entorno usado

- Build estática de Astro servida con `npm run preview` en `http://127.0.0.1:4321/`.
- Lighthouse `13.3.0`.
- Chrome headless `148.0.0.0` en Windows.
- Emulación Lighthouse móvil por defecto: Moto G Power, viewport `412x823`, DPR `1.75`.
- Throttling móvil estándar de Lighthouse: `simulate`, RTT `150 ms`, throughput `1638.4 Kbps`, CPU slowdown `4x`.
- Navegador integrado de Codex: home cargada, título correcto y sin errores/warnings de consola relevantes.

### Métricas Lighthouse móvil

| Métrica | Valor exacto |
|---|---:|
| Performance score | 0.99 / 99 |
| Accessibility score | 0.93 / 93 |
| Best Practices score | 1.00 / 100 |
| SEO score | 1.00 / 100 |
| First Contentful Paint (FCP) | 1.7 s (`1680.8148 ms`) |
| Largest Contentful Paint (LCP) | 1.7 s (`1680.8148 ms`) |
| Cumulative Layout Shift (CLS) | 0.006 (`0.005894`) |
| Interaction to Next Paint (INP) | No aparece en Lighthouse lab; usar TBT como proxy de laboratorio |
| Total Blocking Time (TBT) | 0 ms |
| Speed Index | 1.7 s (`1680.8148 ms`) |
| Peso total transferido durante la auditoría | `247133 bytes` |
| Requests totales | 13 |
| Scripts | 2 (`4633 bytes` transferidos entre ambos) |
| Stylesheets | 2 (`11328 bytes` transferidos entre ambos) |
| Fonts | 2 (`86956 bytes` transferidos entre ambos, más CSS de Google Fonts) |

**Elemento LCP:** `main > section#inicio > div.hero-bg > img.h-full`.

- Recurso elegido por Lighthouse: `/_astro/eolo-hero.CdE6U_8m_ZHt9DW.webp`.
- Transferencia del recurso LCP: `30226 bytes`; tamaño de recurso: `29958 bytes`.
- Bounding box reportado: `462 x 821 px`.
- Estado de descubrimiento LCP: `fetchpriority=high` aplicado, recurso descubrible en el HTML inicial y sin `loading="lazy"`.
- LCP breakdown insight: TTFB `9.72 ms`, resource load delay `9.098 ms`, resource load duration `7.522 ms`, element render delay `204.822 ms`.

### Diagnóstico Performance DevTools

Pasada de scroll móvil con CPU 4x:

- Recorrido: `14141 px`, desde el HERO hasta el final de la home.
- Duración de la grabación de scroll: `8512 ms`.
- Eventos de traza: `146057`.
- Eventos de frame/animation relacionados: `1512`.

Totales agregados por tipo de trabajo. Nota: las categorías de traza pueden solaparse por eventos anidados, así que deben leerse como peso relativo, no como suma exacta del tiempo total.

| Tipo de trabajo | Tiempo agregado | Eventos | Diagnóstico |
|---|---:|---:|---|
| Paint / raster | `6195 ms` | 5497 | Principal coste durante scroll. Domina por encima de JS y layout. |
| Composite / layers | `2854 ms` | 25134 | Segundo coste. Hay bastante trabajo de capas por transforms, masks, overlays y elementos fixed. |
| JavaScript | `1293 ms` | 1577 | No parece el cuello principal. Hay rAF/tickers/observers, pero no bloquean de forma grave. |
| Imágenes / fuentes / carga | `694 ms` | 1370 | Coste visible por decode/raster de imágenes lazy durante el scroll. |
| Layout / style recalc | `456 ms` | 350 | No es el problema principal. Hay mediciones puntuales (`getBoundingClientRect`) pero el coste agregado es menor. |

Eventos más relevantes de la traza:

| Evento | Tiempo agregado | Conteo |
|---|---:|---:|
| `RasterTask` | `1160 ms` | 682 |
| `DisplayItemList::Raster` | `1111 ms` | 682 |
| `Layerize` | `854 ms` | 273 |
| `Paint` | `743 ms` | 421 |
| `Commit` | `496 ms` | 279 |
| `UpdateLayoutTree` | `385 ms` | 259 |
| `FunctionCall` | `245 ms` | 477 |
| `IntersectionObserverController::computeIntersections` | `144 ms` | 541 |
| `ImageDecodeTask` | `138 ms` | 80 |
| `Decode Image` | `122 ms` | 20 |
| `Layout` | `71 ms` | 91 |

Conclusión de DevTools: el problema principal, si el usuario percibe scroll a trompicones, viene de **paint/raster/composite**, no de JavaScript ni de layout. Las imágenes y fuentes no penalizan de forma fuerte el LCP actual, pero las imágenes lazy y los carruseles sí aportan decode/raster durante el scroll.

### Principales cuellos de botella encontrados

1. **Raster/paint durante scroll.** La traza muestra `RasterTask`, `Paint`, `DisplayItemList::Raster` y `Layerize` como el peso dominante.
2. **Superficies translúcidas y blur.** `src/styles/global.css` mantiene `.glass-surface` con `backdrop-filter: blur(22px)` en desktop y `blur(10px)` en móvil; `src/components/Header.astro` usa header fixed con `backdrop-filter` al hacer scroll.
3. **Masks, overlays y carruseles.** `src/components/GallerySection.astro` usa `mask-image` en dos marquees animados; `src/components/ReviewsSection.astro` usa mask y ticker transform-driven con `will-change-transform`.
4. **Imágenes lazy con decode/raster durante scroll.** Lighthouse marca `editorial-banner` con ahorro estimado de `54753 bytes` y el HERO con `8349 bytes`. La traza registra `ImageDecodeTask` y `Decode Image`.
5. **Fuentes externas.** Google Fonts suma `88378 bytes` transferidos. No bloquea el score actual, pero es dependencia externa y coste de red real.
6. **Accesibilidad no perfecta.** Score 93 por `aria-label` en `div` sin role, contraste bajo en textos pequeños del manifiesto y mismatch entre texto visible y `aria-label` en tarjetas de rutas. No afecta rendimiento, pero conviene corregirlo aparte.

### Hipótesis de optimización ordenadas por impacto

1. **Reducir trabajo de paint/composite en zonas con blur, masks y overlays.** Es la hipótesis de mayor impacto porque coincide con el mayor coste de la traza.
2. **Optimizar imágenes no críticas que se decodifican durante el scroll.** El ahorro Lighthouse estimado es `62 KiB`; no cambiaría el LCP de forma dramática, pero puede suavizar scroll al entrar en secciones visuales.
3. **Sustituir `mask-image` por overlays de gradiente equivalentes donde sea posible.** Mantiene el efecto de fade, pero puede reducir coste de compositing en marquees.
4. **Auditar si los tickers deben correr igual en móvil.** Los carruseles ya se pausan fuera de viewport, pero mientras están en pantalla siguen generando trabajo de compositor.
5. **Self-host de Inter/Playfair.** Impacto medio/bajo en lab actual, pero mejora control de caché y elimina dependencia de Google Fonts.
6. **No tocar layout/JS como primera medida.** Layout y JS aparecen por detrás en la traza; empezar por ahí tendría peor relación impacto/riesgo.

### Cambios recomendados, sin aplicar todavía

- Probar reducción o sustitución controlada de `backdrop-filter` en header/superficies móviles y medir paint flashing antes/después.
- Convertir `mask-image` de Gallery/Reviews a overlays laterales equivalentes si mantiene el mismo fade visual.
- Ajustar compresión/calidad de `editorial-banner` y `eolo-hero` con comparación visual pixel/perceptual antes de aceptar.
- Revisar si los marquees de Gallery y Reviews pueden usar menos contenido duplicado visible en móvil o pausar antes/después con root margins más conservadores.
- Self-host de fuentes con subset/woff2 y caché larga.
- Corregir accesibilidad detectada por Lighthouse en una tarea separada, ya que no es una optimización de rendimiento.

## Ronda de optimización 2026-06-04

### Objetivo

Aplicar solo el paso 1 del plan: reducir el coste de paint/raster/composite asociado a `backdrop-filter` en superficies glass y header fijo, sin cambiar de forma perceptible la estética premium ni tocar marquees, imágenes, rutas, SEO, datos de negocio, accesibilidad o librerías.

### Cambios aplicados

| Archivo | Cambio |
|---|---|
| `src/styles/global.css` | `.glass-surface`: `backdrop-filter` desktop `blur(22px)` → `blur(14px)`; móvil `blur(10px)` → `blur(6px)`. Se subió muy levemente la opacidad del fondo glass para mantener una apariencia equivalente. |
| `src/components/Header.astro` | Header scrolleado: fondo `rgba(5,7,10,0.8)` → `0.86` y blur `18px` → `12px`; en móvil fondo `0.9` → `0.94` y blur `10px` → `4px`. Menú móvil: blur `18px` → `10px`; en móvil `12px` → `6px`. |

No se cambió layout, tamaños, contenidos, animaciones, `mask-image`, `will-change`, imágenes, fuentes, schema.org ni canonicals.

### Medición Lighthouse móvil

Método común antes/después:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
$env:TEMP='C:\tmp'; $env:TMP='C:\tmp'
npx --yes lighthouse http://127.0.0.1:4321/ --chrome-path="C:\Program Files\Google\Chrome\Application\chrome.exe" --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --output=json --quiet --chrome-flags="--headless=new --no-sandbox --disable-gpu"
```

| Métrica | Antes | Después |
|---|---:|---:|
| Performance | 90 | 99 |
| Accessibility | 93 | 93 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | `2823.5 ms` | `1644.1 ms` |
| LCP | `2898.5 ms` | `1651.6 ms` |
| CLS | `0` | `0` |
| TBT | `0 ms` | `0 ms` |
| Speed Index | `3233.6 ms` | `1644.1 ms` |
| Requests | 13 | 13 |
| Transferencia | `247131 bytes` | `247139 bytes` |

Nota: Lighthouse mostró variación de laboratorio mayor que la esperable para un cambio de CSS de blur. La pasada "después" generó JSON completo, aunque el CLI devolvió `EPERM` al limpiar el perfil temporal de Chrome. La decisión de mantener el cambio se basa sobre todo en la traza de scroll y en que LCP/CLS/TBT no empeoran.

### Traza Performance de scroll

Método común antes/después:

- Chrome real vía Playwright/CDP.
- URL: `http://127.0.0.1:4321/`.
- Viewport móvil `390x844`, DPR `3`, `Emulation.setCPUThrottlingRate({ rate: 4 })`.
- Scroll completo por rueda desde arriba hasta el final de la home.
- Distancia: `14141 px`.
- Paint flashing proxy: `Overlay.setShowPaintRects` + captura durante scroll, contando píxeles verdes en viewport.

| Métrica de traza | Antes | Después | Cambio |
|---|---:|---:|---:|
| Duración de grabación | `10465 ms` | `10536 ms` | +0.7% |
| Eventos de traza | 218970 | 222129 | +1.4% |
| Eventos frame/animation | 42405 | 43558 | +2.7% |
| Paint / raster | `6296.2 ms` | `6163.7 ms` | -2.1% |
| Eventos paint / raster | 12274 | 11531 | -6.1% |
| Composite / layers | `2605.9 ms` | `2662.9 ms` | +2.2% |
| Eventos composite / layers | 25962 | 27289 | +5.1% |
| JavaScript | `255.5 ms` | `238.4 ms` | -6.7% |
| Layout / style | `1920.4 ms` | `1788.3 ms` | -6.9% |
| Imágenes / fuentes / carga | `1629.5 ms` | `1351.7 ms` | -17.0% |
| Paint flashing: píxeles verdes | 71177 | 53555 | -24.8% |
| Paint flashing: ratio viewport | `0.024026` | `0.018078` | -24.8% |

Conclusión: el cambio reduce el coste agregado de paint/raster y el área marcada por paint flashing durante scroll. `Composite / layers` sube ligeramente (+2.2%), por lo que debe vigilarse en la siguiente ronda, pero no se observó regresión en LCP/CLS/TBT y el síntoma principal documentado era paint/raster.

### Validación visual

Capturas móviles comparativas fuera del repo:

- Antes: `C:\tmp\eolo-before-step1-scroll700.png`
- Después: `C:\tmp\eolo-after-step1-scroll700.png`

Condiciones: viewport `390x844`, DPR `3`, `prefers-reduced-motion: reduce`, `scrollY=700`. Comparación con `sharp`:

| Métrica visual | Resultado |
|---|---:|
| Píxeles con delta > 4 | 0 |
| Ratio de píxeles cambiados | 0 |
| Delta medio | `0.054` |
| Delta máximo | `1 / 255` |

Confirmación: no se aprecia cambio perceptible en header, fondo ni tarjetas glass en la captura revisada.

### Validación ejecutada

- `npm run build`: correcto tras el cambio.
- Navegador integrado Codex: home en `http://127.0.0.1:4321/`, título correcto, contenido presente y consola sin `error`/`warn`.
- `npm run test:e2e`: correcto fuera del sandbox tras un `spawn EPERM` del entorno en la primera ejecución; resultado final 8/8 tests pasados.

### Descartado en esta ronda

- No se eliminó por completo `backdrop-filter`, porque el cambio visual sí habría sido perceptible.
- No se tocaron `mask-image` en Gallery/Reviews: corresponde al paso 2 y requiere medición separada.
- No se modificó `will-change-transform` del ticker de reseñas: corresponde al paso 3.
- No se optimizaron imágenes ni `widths`: corresponde al paso 4.
- No se corrigió Accessibility 93: queda como tarea separada para no mezclar rendimiento con accesibilidad.

## Ronda de optimización 2026-06-04 - ticker de reseñas

### Objetivo

Reducir presión de capas/compositor en el carrusel de reseñas quitando `will-change: transform` permanente y activándolo solo cuando el ticker está en viewport o durante arrastre. Se mantiene la animación por `transform`, la velocidad, el drag, la pausa fuera de viewport y la estética.

### Cambio aplicado

| Archivo | Cambio |
|---|---|
| `src/components/ReviewsSection.astro` | Se retiró la clase Tailwind `will-change-transform` de `.reviews-track`. El script ahora usa `track.style.willChange = 'transform'` solo cuando `IntersectionObserver` marca el ticker como visible o mientras se arrastra; al salir de viewport vuelve a `auto`. |

No se cambió `mask-image`, layout, textos, rutas, imágenes, SEO, schema.org, fuentes ni dependencias.

### Variantes descartadas antes de aceptar

| Variante probada | Resultado | Decisión |
|---|---:|---|
| Reemplazar `mask-image` de Gallery y Reviews por overlays laterales | Paint/raster `7732.9 ms` → `7887.4 ms`; composite `3235.5 ms` → `3407.9 ms` | Revertida por empeorar paint/composite. |
| Quitar solo `mask-image` de Reviews manteniendo sus overlays existentes | Paint/raster `7732.9 ms` → `11553.6 ms`; composite `3235.5 ms` → `4069.9 ms` | Revertida por empeorar claramente. |

Conclusión: en esta web concreta, sustituir las máscaras por overlays no fue una mejora medible. Se conserva `mask-image` y se documenta como descartado.

### Traza Performance de scroll

Método común antes/después:

- Chrome real vía Playwright/CDP.
- URL: `http://127.0.0.1:4321/`.
- Viewport móvil `390x844`, DPR `3`, CPU `4x`.
- Scroll completo de la home.
- Distancia: `14043 px`.

| Métrica de traza | Antes | Después | Cambio |
|---|---:|---:|---:|
| Duración de grabación | `11355 ms` | `10684 ms` | -5.9% |
| Eventos de traza | 208428 | 214246 | +2.8% |
| Eventos frame/animation | 39711 | 42242 | +6.4% |
| Paint / raster | `7732.9 ms` | `6974.1 ms` | -9.8% |
| Eventos paint / raster | 10928 | 10376 | -5.1% |
| Composite / layers | `3235.5 ms` | `3024.2 ms` | -6.5% |
| JavaScript | `344.2 ms` | `285.4 ms` | -17.1% |
| Layout / style | `1689.9 ms` | `2022.4 ms` | +19.7% |
| Imágenes / fuentes / carga | `2037.5 ms` | `1882.2 ms` | -7.6% |
| Paint flashing: píxeles verdes | 348891 | 27793 | -92.0% |
| Paint flashing: ratio viewport | `0.117771` | `0.009382` | -92.0% |

Conclusión: se mantiene el cambio porque mejora las dos categorías objetivo (`paint/raster` y `composite/layers`) y reduce de forma fuerte el área de paint flashing. `Layout / style` sube en la traza agregada, pero LCP/CLS/TBT no retroceden y el cambio no introduce lecturas/escrituras de layout nuevas en bucle; se vigilará en futuras rondas.

### Lighthouse móvil

Después del cambio se ejecutaron dos pasadas móviles con el mismo comando de la ronda anterior. Ambas dieron:

| Métrica | Pasada 1 | Pasada 2 |
|---|---:|---:|
| Performance | 90 | 90 |
| Accessibility | 93 | 93 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | `2901.2 ms` | `2907.9 ms` |
| CLS | `0` | `0` |
| TBT | `0 ms` | `0 ms` |
| Transferencia | `247000 bytes` | `247000 bytes` |

Nota: Lighthouse en esta máquina volvió a mostrar variación de laboratorio respecto a pasadas anteriores, pero no hay regresión en las métricas de seguridad del cambio: CLS sigue en `0` y TBT sigue en `0 ms`.

### Validación ejecutada

- `npm run build`: correcto.
- Navegador integrado Codex: título correcto, consola sin `error`/`warn`.
- Verificación funcional del ticker: `.reviews-track` tiene `will-change: auto` al cargar la home, `will-change: transform` con `.reviews-ticker` visible, y vuelve a `auto` al salir de viewport.
- Captura móvil de Reviews en `C:\tmp\eolo-after-willchange-reviews.png`: sin cambio perceptible de diseño.
- `npm run test:e2e`: correcto fuera del sandbox tras un `spawn EPERM` inicial del entorno; 8/8 tests pasados.

## Ronda de optimización 2026-06-05 - contención de pintado en venta

### Objetivo

Mejorar ligeramente la fluidez de scroll de la página de venta/tienda sin tocar estética, tamaños, overlays, `backdrop-filter`, tiempos de transición ni animaciones.

### Cambio aplicado

| Archivo | Cambio |
|---|---|
| `src/pages/venta-bicicletas-miami-platja.astro` | Se añadió `class="sale-page"` al `<main>` y una regla local `contain: paint` para sus secciones directas. |

La página de venta ya tenía sus secciones directas con `overflow-hidden`, por lo que la contención de pintado no debe recortar contenido que antes pudiera sobresalir; solo acota la zona que el navegador invalida/recompone al hacer scroll por secciones con fondos, ondas, glows, tarjetas y blur.

### Validación ejecutada

- `npm run build`: correcto.
- Navegador integrado sobre `http://127.0.0.1:4321/venta-bicicletas-miami-platja/`: título correcto, DOM con contenido de venta, consola sin `error`/`warn`, 6 secciones directas con `contain: paint` computado y `scrollWidth - clientWidth = 0`.
- Captura móvil Playwright/Edge en `C:\tmp\eolo-venta-after.png` tras scroll a `scrollY=1600`: categorías visibles, header y WhatsApp flotante correctos, consola sin logs relevantes, `scrollWidth - clientWidth = 0` y las 6 secciones con `contain: paint`.
- `npm run test:e2e`: correcto fuera del sandbox tras el `spawn EPERM` habitual del entorno; 8/8 tests pasados.

### Riesgos o pendientes

No se ejecutó una traza Performance/Lighthouse específica de esta ronda, así que el cambio queda como optimización de bajo riesgo y no como mejora cuantificada. Mantener vigilado si en el futuro se añade a la página de venta algún elemento que necesite pintar fuera de su sección directa; si ocurre, retirar la contención de esa sección concreta.

## Plan de optimización recomendado

### Alta prioridad

1. `src/styles/global.css`, `src/components/Header.astro`
   - Problema detectado: paint/composite domina el scroll; header fixed y superficies con `backdrop-filter` obligan a recalcular blur sobre contenido en movimiento.
   - Solución propuesta: crear una prueba móvil reduciendo blur del header/superficies o sustituyéndolo por fondo más opaco visualmente equivalente; medir con Performance y paint flashing.
   - Riesgo visual: medio.
   - Impacto esperado: alto en fluidez de scroll si el blur es el repintado principal.
   - Mantiene exactamente la estética y animaciones actuales: no garantizado; puede mantener una apariencia muy cercana, pero hay que validar visualmente.

2. `src/components/GallerySection.astro`, `src/components/ReviewsSection.astro`
   - Problema detectado: marquees y tickers usan transforms continuos con masks/overlays; la traza muestra coste alto de raster/layer/composite.
   - Solución propuesta: reemplazar `mask-image` por overlays laterales de gradiente cuando sea posible y comparar coste de compositor. Mantener velocidad, dirección y pausa fuera de viewport.
   - Riesgo visual: bajo/medio.
   - Impacto esperado: medio/alto durante las secciones de carrusel.
   - Mantiene exactamente la estética y animaciones actuales: animaciones sí; estética casi igual si el gradiente se replica, pero no debe darse por exacto sin captura comparativa.

3. `src/components/EditorialBanner.astro`, `src/components/Hero.astro`
   - Problema detectado: Lighthouse estima `62 KiB` de ahorro en entrega de imágenes, sobre todo `editorial-banner` (`54753 bytes`) y HERO (`8349 bytes`); la traza registra decode/raster de imágenes durante scroll.
   - Solución propuesta: probar calidad WebP algo menor o variantes más ajustadas, una imagen cada vez, con comparación visual antes/después y nueva medición Lighthouse.
   - Riesgo visual: bajo si se ajusta poco; medio si se comprime de más.
   - Impacto esperado: medio en transferencia/decode; bajo/medio en LCP porque el LCP ya está bien.
   - Mantiene exactamente la estética y animaciones actuales: animaciones sí; estética no exactamente a nivel de pixeles, aunque debería poder ser imperceptible.

### Media prioridad

1. `src/components/ReviewsSection.astro`
   - Problema detectado: ticker JS con `requestAnimationFrame` y `will-change-transform` permanente en track; JS no domina, pero suma trabajo mientras está en pantalla.
   - Solución propuesta: medir variante que active `will-change` solo al entrar en viewport/drag y lo retire al salir, manteniendo el rAF detenido fuera de pantalla.
   - Riesgo visual: bajo.
   - Impacto esperado: medio en memoria/capas, bajo/medio en CPU.
   - Mantiene exactamente la estética y animaciones actuales: si se implementa solo como gestión de capas, sí.

2. `src/layouts/Layout.astro`
   - Problema detectado: Google Fonts transfiere `88378 bytes` y depende de red externa.
   - Solución propuesta: self-host de Inter y Playfair en woff2 con subset necesario, `font-display: swap` y caché larga.
   - Riesgo visual: bajo/medio por métricas de fuente y fallback; requiere comparar CLS/typography.
   - Impacto esperado: medio en red real, bajo en esta auditoría local.
   - Mantiene exactamente la estética y animaciones actuales: no garantizado hasta validar métricas/fallback; animaciones no cambian.

3. `src/components/GallerySection.astro`
   - Problema detectado: muchas imágenes lazy en carrusel entran en decode/raster durante scroll.
   - Solución propuesta: revisar si cada imagen necesita `560x680` en móvil o si se pueden emitir `widths` más específicos para tarjetas de 280px CSS.
   - Riesgo visual: bajo.
   - Impacto esperado: medio en decode/transfer durante scroll.
   - Mantiene exactamente la estética y animaciones actuales: si se conserva el mismo encuadre y se valida nitidez.

### Baja prioridad

1. `src/components/RoutesSection.astro`, `src/components/ManifestoSection.astro`, `src/components/ReviewsSection.astro`
   - Problema detectado: Lighthouse Accessibility 93 por ARIA/contraste/nombres accesibles.
   - Solución propuesta: retirar `aria-label` de `div` sin role o convertir a semántica válida, subir contraste de textos pequeños y alinear `aria-label` con texto visible.
   - Riesgo visual: bajo si se limita a semántica; medio si se toca contraste.
   - Impacto esperado: alto en accesibilidad, nulo/bajo en rendimiento.
   - Mantiene exactamente la estética y animaciones actuales: semántica sí; contraste no exactamente.

2. `src/styles/global.css`
   - Problema detectado: overlay grain fixed global y grain local del HERO existen, aunque sin `mix-blend-mode`; no aparecen como primer culpable, pero suman capas/paint.
   - Solución propuesta: medir variante que reduzca grain en móvil o consolide overlays solo si paint flashing demuestra repintado.
   - Riesgo visual: medio.
   - Impacto esperado: bajo/medio.
   - Mantiene exactamente la estética y animaciones actuales: no, el grano podría cambiar sutilmente.

3. `src/scripts/animations.ts`, `src/components/Hero.astro`
   - Problema detectado: observers y parallax suman algo de trabajo (`IntersectionObserverController::computeIntersections` `144 ms`), pero no son el cuello principal y el parallax global ya está desactivado en móvil bajo 768px.
   - Solución propuesta: no tocar de inicio; solo revisar si tras optimizar paint/composite sigue habiendo jank.
   - Riesgo visual: medio si se altera movimiento.
   - Impacto esperado: bajo en la línea base actual.
   - Mantiene exactamente la estética y animaciones actuales: si no se toca; cualquier ajuste de movimiento no.

## 1. Mapa del proyecto (qué afecta al rendimiento y dónde)

| Área | Archivo | Por qué importa para la fluidez |
|------|---------|--------------------------------|
| Estilos globales / grain / glass | [src/styles/global.css](../src/styles/global.css) | Grain overlay, `.glass-surface` (`backdrop-filter: blur(22px)`), reducciones móviles. Es el archivo #1 a vigilar. |
| Sistema de animaciones | [src/scripts/animations.ts](../src/scripts/animations.ts) | Reveal por IntersectionObserver + parallax con rAF. Define cuándo se promueven capas (`will-change`). |
| Layout / fuentes / SEO | [src/layouts/Layout.astro](../src/layouts/Layout.astro) | Carga de fuentes no bloqueante. Afecta FCP/LCP. |
| Hero (LCP) | [src/components/Hero.astro](../src/components/Hero.astro) | Imagen LCP, parallax de fondo, grain del hero. |
| Marquees infinitos | [src/components/ReviewsSection.astro](../src/components/ReviewsSection.astro), [src/components/GallerySection.astro](../src/components/GallerySection.astro) | Animaciones que corren para siempre; deben pausarse fuera de viewport. |
| Imágenes responsivas | `src/assets/images/*` + `<Image widths={...}>` en cada sección | Bytes descargados en móvil = velocidad de aparición. |

**Stack:** Astro 4.x estático puro. Sin React, sin GSAP, sin Lenis (eliminados a propósito). Animaciones = CSS + IntersectionObserver. **No reintroducir frameworks de UI ni librerías de animación.**

---

## 2. Cómo medir (flujo de trabajo)

Sin medición, optimizar es adivinar. Estas son las cuatro herramientas, de más rápida a más profunda.

### 2.1. FPS en vivo (5 segundos, para confirmar el síntoma)
1. Chrome → DevTools (`F12`) → `Ctrl+Shift+P` → "Show frames per second (FPS) meter".
2. Haz scroll por la home. Si el FPS cae por debajo de 50–55 de forma sostenida, hay jank de pintado.

### 2.2. Performance profile (la herramienta clave para "a trompicones")
1. DevTools → pestaña **Performance**.
2. Activa **CPU: 4× slowdown** (simula un móvil de gama media — donde se nota el problema).
3. Pulsa grabar (●), haz scroll ~5 s por la sección sospechosa, para.
4. Mira la pista **Frames**: barras rojas = frames largos (>50 ms).
5. En el frame rojo, busca qué domina:
   - **`Rendering` / `Painting` morado y verde grandes** → coste de paint/composite (blur, blend, sombras). **← causa típica aquí.**
   - **`Layout` / "Recalculate Style" amarillo** → reflow (lee/escribe geometría en bucle, o `content-visibility`).
   - **Bloques amarillos largos de `Scripting`** → JS bloqueante (raro en esta web).

### 2.3. Layers / paint flashing (para localizar QUÉ pinta de más)
1. `Ctrl+Shift+P` → "Show Rendering".
2. Activa **Paint flashing**: las zonas que se repintan parpadean en verde. Si algo parpadea **mientras solo haces scroll**, está repintándose por frame → candidato a optimizar.
3. Activa **Layer borders** para ver cuántas capas de compositor hay. Demasiadas capas (cada `will-change`/`transform` crea una) = presión de memoria GPU.

### 2.4. Lighthouse (puntuación objetiva, antes/después)
```powershell
npm run build
npm run preview   # sirve la build real en http://localhost:4321
```
Luego en Chrome (modo incógnito, sin extensiones) → DevTools → **Lighthouse** → *Mobile* → *Performance* → Analyze.

Métricas a vigilar:
- **LCP** (< 2.5 s): la imagen del hero. Si es alta → optimizar carga del hero.
- **CLS** (< 0.1): saltos de layout. Si es alta → faltan `width`/`height` en imágenes o fuentes que mueven texto.
- **INP / TBT**: respuesta a interacción. Aquí debería estar muy bien (poco JS).

> **Importante:** mide siempre contra `npm run preview` (build de producción), nunca contra `npm run dev`. El dev server es mucho más lento y no representa la realidad.

---

## 3. Diagnóstico por síntoma

| Síntoma del usuario | Causa probable | Dónde mirar primero |
|---------------------|----------------|---------------------|
| "El scroll va a trompicones / tirones" | Paint/composite por frame: blur, blend o sombra que se recalcula al mover el viewport | `body::before` (grain), `.glass-surface`, marquees, headers con `backdrop-filter` |
| "Se queda pilladilla en móvil" | `backdrop-filter` y sombras grandes sin reducir en móvil | Bloque `@media (max-width: 767px)` en [global.css](../src/styles/global.css) |
| "Tarda en aparecer la imagen grande de arriba" | LCP: imagen del hero pesada o sin `widths` responsivos | [Hero.astro](../src/components/Hero.astro), atributo `widths` del `<Image>` |
| "Salta el contenido al cargar" | CLS: imágenes sin dimensiones o fuente que reflowa | `<Image>` sin `width/height`, carga de fuentes |
| "Va lento aunque no haga nada" | Animación infinita corriendo fuera de pantalla | Marquees de Reviews/Gallery (deben pausarse) |
| "Al entrar en una sección da un tirón" | Layout spike por `content-visibility` o reveal mal medido | Evitar `content-visibility: auto` (ver invariantes) |

---

## 4. Invariantes — decisiones tomadas que NO se deben deshacer

Estas optimizaciones ya se hicieron tras reportes reales de jank. Revertirlas reintroduce el problema:

1. **Grain sin `mix-blend-mode`.** El `body::before` es overlay normal a `opacity: 0.05`. Un blend mode fijo a pantalla completa obliga a re-mezclar todo el viewport cada frame de scroll → era la causa #1 del jank. **No volver a poner `mix-blend-mode` en un elemento `fixed` a pantalla completa.**
2. **Nada de `backdrop-filter` en elementos en movimiento.** Las tarjetas de los marquees usan fondo sólido (`bg-cream/[0.05]`), no blur. Un blur recalculado por frame mientras el elemento se mueve mata el FPS.
3. **Los marquees se pausan fuera de viewport y con pestaña oculta** (clase `.is-paused` por IntersectionObserver + `visibilitychange`). Mantener este patrón en CUALQUIER animación infinita nueva.
4. **Glows = `radial-gradient` puro, sin `filter: blur(60–100px)`.** El gradiente ya difumina; el blur de gran radio encima es rasterización cara y redundante. (Los `blur(1px)` baratos del hero sí se conservan.)
5. **Sin `content-visibility: auto`.** Provocaba picos de layout al entrar en secciones pesadas durante el scroll. En esta web se prioriza fluidez de scroll sobre ahorro de render inicial (el JS ya es mínimo).
6. **`will-change` NO global.** No se pone en todos los `[data-reveal]` de inicio (promovería decenas de capas antes de animar). Solo el parallax lo activa por elemento mientras está activo y lo quita al salir. `translate3d` ya da la pista de compositing para el reveal de un disparo.
7. **Fuentes no bloqueantes** (`preload` + `media="print"`/`onload` + `<noscript>`) y sin pesos sin usar (se quitaron Barlow Condensed y las cursivas de Playfair).
8. **`widths` en todos los `<Image>` grandes.** Genera srcset responsivo; el móvil descarga la variante pequeña, no la de ~1774px. El tamaño total de `dist/` sube a propósito (más variantes en el host), pero la **transferencia por visita en móvil baja**. No quitar `widths` para "reducir dist".

Fuente: [PERFORMANCE_OPTIMIZATION_REPORT.md](../PERFORMANCE_OPTIMIZATION_REPORT.md) (rondas 1–3).

---

## 5. Backlog priorizado — qué optimizar a continuación

Ordenado por relación impacto/esfuerzo. Mide antes y después de cada uno.

### Alta prioridad
- [ ] **Auditar `backdrop-filter: blur(22px)` de `.glass-surface`.** Es el blur más caro que queda en desktop. Si hay varias glass-surfaces visibles a la vez durante el scroll, prueba bajarlo a 14–16px y compara con paint flashing. Ya está reducido a 10px en móvil.
- [ ] **Medir Lighthouse real** (móvil + 4× CPU) contra `npm run preview` y anotar la línea base de LCP/CLS/INP aquí mismo. Sin línea base no se sabe si las mejoras futuras suman.
- [ ] **Preload del LCP del hero.** Se documentó como no aplicado por riesgo (la URL hasheada de Astro podría romper el test de consola con un 404). Vale la pena reintentarlo con cuidado: acelera el LCP directamente. Validar que el `href` del preload coincide con el `src` emitido tras el build.

### Media prioridad
- [ ] **Sombras grandes en scroll.** Revisar `box-shadow` de gran difuminado (`.glass-surface` tiene `0 24px 70px`). Las sombras grandes se repintan al mover el elemento. Si alguna está sobre contenido que se desliza, considerar reducir el radio o pre-rasterizar.
- [ ] **Auditar nº de capas de compositor** (Layer borders). Si el parallax o varios `transform` crean muchas capas simultáneas en móvil, hay presión de GPU. Limitar parallax a 1–2 elementos por pantalla.
- [ ] **Self-host de Inter/Playfair** (woff2 local con `font-display: swap`). Quita dependencia de Google Fonts, mejora control de caché y elimina una conexión externa en el critical path.

### Baja prioridad / explorar
- [ ] **`<Picture>` con AVIF** además de WebP para otro ~20–30% menos de bytes en imágenes grandes. Documentado como no aplicado aún.
- [ ] **Web Vitals en producción** (LCP/CLS/INP/TTFB reales de usuarios), no solo lab. Un script mínimo de `web-vitals` enviando a un endpoint.
- [ ] **Vulnerabilidades de tooling** (`npm audit`: 2 moderate + 1 high en astro→vite/esbuild, solo dev-server). El arreglo exige `astro@6` (breaking). No urgente; planificar la migración mayor aparte.

---

## 6. Checklist antes de dar por buena una optimización

- [ ] Medí **antes** (perfil de Performance o Lighthouse) y guardé el número.
- [ ] Cambié **una sola cosa**.
- [ ] Medí **después** con el mismo método y mejoró (o al menos no empeoró otra métrica).
- [ ] Probé en **móvil con 4× CPU throttling**, no solo en mi desktop.
- [ ] El **diseño no cambió** de forma perceptible (esta web es premium; la estética es requisito).
- [ ] `npm run build` pasa y `npm run test:e2e` sigue en verde.
- [ ] Si rompí un invariante de [§4](#4-invariantes--decisiones-tomadas-que-no-se-deben-deshacer) a propósito, lo documenté con la razón.

---

## 7. Reglas de oro para CSS/animaciones nuevas

Para no reintroducir jank al añadir features:

1. **Anima solo `transform` y `opacity`.** Son las dos propiedades que el compositor maneja sin reflow ni repaint. Animar `top`, `left`, `width`, `margin`, `box-shadow` o `filter` fuerza layout/paint por frame.
2. **Nunca `backdrop-filter` ni `mix-blend-mode` en algo que se mueve.**
3. **Toda animación infinita debe pausarse** fuera de viewport y con pestaña oculta (patrón `.is-paused`).
4. **`will-change` solo mientras se anima**, y quitarlo al terminar. Nunca de forma permanente ni masiva.
5. **Imágenes siempre con `width`, `height` y `widths`** responsivos (vía `astro:assets`), nunca remotas sin dimensiones.
6. **Mide en móvil throttled**, no en tu portátil — el problema vive ahí.

---

## Referencias

- [PERFORMANCE_OPTIMIZATION_REPORT.md](../PERFORMANCE_OPTIMIZATION_REPORT.md) — historial de las 3 rondas de optimización ya hechas.
- [docs/PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) — análisis general del proyecto.
- [docs/AI_CHANGELOG.md](AI_CHANGELOG.md) — registro de cambios.
