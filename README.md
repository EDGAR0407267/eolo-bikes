# EOLO Bikes

<p align="center">
  <img src="public/images/eolo-logo.svg" alt="EOLO Bikes logo" width="240" />
</p>

<p align="center">
  A fast, editorial-style website for an independent bicycle shop on Spain's Mediterranean coast.
</p>

<p align="center">
  <a href="https://eolobikes.com">Live website</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#project-structure">Project structure</a>
</p>

---

## About the project

I designed and developed this website for **EOLO Bikes**, a local bicycle business in Miami Platja, Tarragona. The goal was to create more than a conventional shop website: I wanted the digital experience to feel energetic, premium, and closely connected to cycling culture while remaining fast, accessible, and easy to discover through local search.

The site presents the business's three core services—bicycle sales, workshop and maintenance, and rentals—through dedicated landing pages supported by clear calls to action, practical contact information, local cycling routes, reviews, and frequently asked questions.

This repository contains the complete source code, reusable UI components, local image assets, technical documentation, and automated pre-production tests. Generated builds, deployment archives, local logs, environment files, and test artifacts are intentionally excluded.

## Highlights

- Fully static, multi-page architecture built with Astro
- Responsive editorial design for mobile, tablet, and desktop
- Dedicated SEO landing pages for each business service
- Lightweight reveal, parallax, marquee, and interaction effects without a client framework
- Centralized business information and navigation data
- Local images processed through Astro's asset pipeline
- Structured data using Schema.org for the business, services, website, contact page, and breadcrumbs
- Open Graph, Twitter Card, canonical, robots, sitemap, and favicon support
- Reduced-motion support, keyboard focus styles, and resilient animation fallbacks
- Playwright coverage for critical routes, mobile navigation, responsive overflow, visibility, and SEO files

## Technology stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Framework | [Astro 4](https://astro.build/) | Static page generation and component architecture |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) | Responsive layouts and design utilities |
| Language | [TypeScript](https://www.typescriptlang.org/) | Typed shared data and client-side behavior |
| Testing | [Playwright](https://playwright.dev/) | End-to-end and pre-production QA |
| SEO | JSON-LD / Schema.org | Structured business and service information |
| Delivery | Static HTML, CSS, and JavaScript | Portable deployment with minimal runtime overhead |

## Design and engineering approach

### Performance by default

The project ships static pages and keeps browser JavaScript deliberately small. Visual effects are implemented with native browser APIs such as `IntersectionObserver`, and heavier client-side dependencies were removed during optimization. Images used by page components are handled by `astro:assets`, while mobile styles reduce expensive visual effects where appropriate.

### Local SEO architecture

Each commercial service has its own descriptive route:

- `/venta-bicicletas-miami-platja/`
- `/taller-bicicletas-miami-platja/`
- `/alquiler-bicicletas-miami-platja/`
- `/contacto/`

The global layout supplies canonical URLs, social metadata, crawl directives, and structured data. Internal pages also receive breadcrumb markup, while service pages expose relevant service schemas.

### Maintainable content

Business details, navigation links, opening hours, service descriptions, and route data live in `src/lib/constants.ts`. This keeps repeated information consistent across visible content, links, and structured metadata.

### Progressive enhancement

Core information and navigation are available in the generated HTML. Animations enhance the experience but are not required to read the content, and explicit fallbacks prevent reveal elements from remaining hidden if browser observers fail or reduced motion is enabled.

## Getting started

### Requirements

- Node.js 18 or newer
- npm
- Microsoft Edge for the current Playwright configuration, or an adjusted Playwright browser channel

### Installation

```bash
git clone <repository-url>
cd eolo-bikes
npm install
```

### Local development

```bash
npm run dev
```

Astro will print the local development URL in the terminal.

### Production build

```bash
npm run build
npm run preview
```

The static production output is generated in `dist/`.

### End-to-end tests

```bash
npm run test:e2e
```

The suite builds the project and checks the main pages, real mobile-menu interactions, responsive overflow, essential content visibility, reduced-motion behavior, and the generated robots and sitemap resources.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Astro development server |
| `npm run build` | Generate the static production build |
| `npm run preview` | Preview the generated production site |
| `npm run test:e2e` | Build and run the Playwright test suite |
| `npm run test:e2e:headed` | Run Playwright with a visible browser |

## Project structure

```text
.
├── public/                    # Static files, favicons, logo, robots and sitemap
├── scripts/                   # Small project utilities
├── src/
│   ├── assets/images/         # Images processed by Astro
│   ├── components/            # Reusable page sections and navigation
│   ├── layouts/Layout.astro   # Global shell, metadata and structured data
│   ├── lib/constants.ts       # Centralized business and route data
│   ├── pages/                 # Static routes and service landing pages
│   ├── scripts/animations.ts  # Lightweight browser interactions
│   └── styles/global.css      # Global styles and visual utilities
├── tests/e2e/                 # Pre-production Playwright tests
├── docs/                      # Architecture, SEO and maintenance notes
├── astro.config.mjs
├── tailwind.config.ts
└── package.json
```

## Documentation

- `docs/PROJECT_ANALYSIS.md` contains the technical and functional project analysis.
- `docs/PRODUCTION_SEO.md` contains the production and local SEO checklist.
- `docs/RENDIMIENTO.md` and `PERFORMANCE_OPTIMIZATION_REPORT.md` document performance work and measurements.
- `docs/AI_CHANGELOG.md` records project changes and validation history.
- `AGENTS.md` defines maintenance rules for AI-assisted contributions.

## Privacy and repository hygiene

No secret keys or private credentials are required by the current website. Environment files, local logs, generated output, Playwright artifacts, dependency folders, and deployment ZIP archives are ignored by Git. The phone number, address, opening hours, and social links present in the source are intentional public business information displayed by the live website.

If private integrations are added later, store their credentials in local environment variables and provide only a sanitized `.env.example` file.

## Deployment

Because Astro generates a static site, the contents of `dist/` can be deployed to any static hosting platform or conventional web hosting. The current production documentation assumes the site is served from the root of `https://eolobikes.com`.

Before deployment:

1. Run `npm run build`.
2. Run `npm run test:e2e` when the configured browser is available.
3. Confirm that production business details and URLs are correct.
4. Upload the contents of `dist/`, not the source repository itself.

## Status

**Production.** The public website is available at [eolobikes.com](https://eolobikes.com).

## Author

Designed and developed by **Edgar Pedret Girones** · [GitHub](https://github.com/EDGAR0407267).

This repository showcases my work across visual direction, information architecture, Astro component development, responsive implementation, performance optimization, structured data, and automated quality assurance.

## License and usage

The source code is published for portfolio and reference purposes. EOLO Bikes branding, copy, photography, logos, and other business assets remain the property of their respective owner(s). No permission is granted to reuse those brand assets commercially without authorization.
