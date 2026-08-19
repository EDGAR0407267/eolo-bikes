# Produccion SEO EOLO Bikes

Fecha: 2026-06-04

## Estado

EOLO Bikes queda preparada a nivel tecnico para publicar, indexar e iniciar captacion SEO local en Miami Platja con las rutas reales actuales:

- `https://eolobikes.com/`
- `https://eolobikes.com/venta-bicicletas-miami-platja/`
- `https://eolobikes.com/taller-bicicletas-miami-platja/`
- `https://eolobikes.com/alquiler-bicicletas-miami-platja/`
- `https://eolobikes.com/contacto/`

No se han creado rutas nuevas, blog ni pagina editorial de rutas.

## Validacion antes de subir

Ejecutar siempre:

```bash
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=high
npm audit --audit-level=high
```

Si existen en el futuro:

```bash
npm run lint
npm run check
npm run type-check
```

Comprobar despues del build:

- `dist/robots.txt`
- `dist/sitemap.xml`
- `dist/index.html`
- `dist/venta-bicicletas-miami-platja/index.html`
- `dist/taller-bicicletas-miami-platja/index.html`
- `dist/alquiler-bicicletas-miami-platja/index.html`
- `dist/contacto/index.html`

## Google Search Console

1. Verificar el dominio `eolobikes.com`.
2. Enviar el sitemap: `https://eolobikes.com/sitemap.xml`.
3. Solicitar indexacion de las cinco URLs principales.
4. Revisar cobertura, canonicals elegidos por Google y errores de rastreo durante las primeras semanas.

## Google Business Profile

1. Crear o reclamar el perfil de EOLO Bikes.
2. Confirmar nombre, categoria, direccion, telefono, horarios y enlace web.
3. Subir fotos reales de tienda, taller, bicicletas y fachada.
4. Pedir resenas reales a clientes.
5. Mantener coherencia NAP: nombre, direccion y telefono iguales en web, Google Business Profile y directorios locales.

## Medicion recomendada

No se ha instalado analytics en codigo para evitar dependencias innecesarias.

Opciones recomendadas:

- Google Analytics 4 si el propietario quiere medicion completa.
- Plausible o Umami si se prioriza privacidad y simplicidad.
- Eventos recomendados: clicks en WhatsApp, telefono, Google Maps, Instagram, CTAs de venta, taller y alquiler.

## Pendientes no tecnicos

- Confirmar direccion exacta y codigo postal.
- Confirmar telefono publico.
- Confirmar si WhatsApp debe seguir usando el mismo numero.
- Confirmar horarios definitivos.
- Confirmar logo final para favicon y cabecera.
- Confirmar imagen OG final de marca.
- Conseguir resenas reales.
- Conseguir enlaces locales desde hoteles, campings, negocios, asociaciones y medios de la zona.
- Revisar en movil real una vez desplegado en hosting definitivo.
