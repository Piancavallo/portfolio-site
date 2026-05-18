# Portfolio — Astro + Tailwind + React

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
```

## Structure

```
src/
├── components/    # React (.tsx) and Astro (.astro) components
├── layouts/
│   └── BaseLayout.astro   # Wraps every page (nav + footer)
├── pages/
│   ├── index.astro        # /
│   ├── about.astro        # /about
│   ├── projects.astro     # /projects
│   └── contact.astro      # /contact
└── styles/
    └── global.css         # Tailwind directives + global overrides
public/            # Static assets (images, fonts, etc.)
```

## Integrations

| Package | Purpose |
|---|---|
| `@astrojs/react` | React islands / interactive components |
| `@astrojs/tailwind` | Tailwind CSS via PostCSS |

## Adding a React component

Create a `.tsx` file in `src/components/`, then import it in any `.astro` page:

```astro
---
import MyComponent from '@components/MyComponent';
---
<MyComponent client:load />
```

Use the right [client directive](https://docs.astro.build/en/reference/directives-reference/#client-directives):
- `client:load` — hydrate immediately
- `client:idle` — hydrate when browser is idle
- `client:visible` — hydrate when scrolled into view
