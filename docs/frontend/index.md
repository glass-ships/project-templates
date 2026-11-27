# Frontend

A React and TypeScript app in `frontend/`, built with [Vite](https://vite.dev/) and managed with [bun](https://bun.sh/).

## Set up

```sh
cd frontend
bun install
bun run dev                    # http://localhost:5173
```

The dev server reloads on changes, and forwards requests for `/api` to the [API server](../python/api-server.md) on port 9000.

## Scripts

| Command                                    | Does                                                                 |
| ------------------------------------------ | -------------------------------------------------------------------- |
| `bun run dev`                              | Start the dev server                                                 |
| `bun run build`                            | Type-check, then build to `dist/` at the repo root                   |
| `bun run preview`                          | Serve the build                                                      |
| `bun run test:unit`                        | [Unit tests](testing.md#unit-tests)                                  |
| `bun run test:e2e`                         | [End-to-end and accessibility tests](testing.md#end-to-end-tests)    |
| `bun run test:types`                       | Type-check                                                           |
| `bun run test:lint`, `bun run test:format` | Check linting and formatting, as CI does                             |
| `bun run lint`, `bun run format`           | Fix what they can                                                    |
| `bun run docs`                             | Generate the [API reference](api/index.md) into `docs/frontend/api/` |

Linting and formatting use [Biome](https://biomejs.dev/), configured in `biome.json`.

## Layout

```
frontend/
  index.html               the page shell; loads the fonts and src/main.tsx
  src/
    main.tsx               routes and the layout shared by every page
    pages/                 one component per route
    components/            Navbar, Footer, RouterLink, Nexus
      ui/                  reusable components: AppButton, AppModal, AppGrid, ...
    hooks/                 useFetch, useLocalStorage, useMediaQuery, ...
    utils/                 helpers for requests, strings, the DOM, downloads, ...
    global/                styles, theme variables, and the icon list
    assets/                icons, images and fonts
  tests/
    unit/                  Vitest
    e2e/                   Playwright
  typedoc/                 generates the API reference
```

`@/` in imports means `src/`: `import AppButton from "@/components/ui/AppButton"`.

The pages in `src/pages/` (Testbed, Nexus, Infinite Scroll) show every component in use. Keep them while you build, as a reference, and delete them when you have your own.

Some files are references that nothing imports, so they don't end up in the build: `src/global/colors.scss` and `colors_tailwind.scss` (color palettes as Sass variables), `src/css-examples/`, the fonts in `src/assets/fonts/`, and the PNG icons in `src/assets/icons/ornl/`. Use what you need and delete the rest.

## Add a page

1. Make a component in `src/pages/`, wrapping its content in [`AppSection`](api/components/ui/AppSection.md)s:

   ```tsx title="src/pages/About.tsx"
   import AppCard from "@/components/ui/AppCard";
   import AppSection from "@/components/ui/AppSection";

   export default function About() {
     return (
       <main>
         <AppSection width="medium">
           <AppCard>
             <h1>About</h1>
           </AppCard>
         </AppSection>
       </main>
     );
   }
   ```

2. Add a route for it in `src/main.tsx`, next to the others:

   ```tsx
   <Route
     path="/about"
     element={<About />}
   />
   ```

3. Link to it with an [`AppButton`](api/components/ui/AppButton.md) (`linkTo="/about"`) or a `<Link>` from react-router. See [Links and routing](routing.md).

## Icons

[`AppIcon`](api/components/ui/AppIcon.md) takes an icon by name, from two places:

- **FontAwesome**: add the icon to the list in `src/global/icons.ts`, under the name you'll use:

  ```ts
  import * as fas from "@fortawesome/free-solid-svg-icons";

  const faIcons = {
    // ...
    gear: fas.faGear,
  };
  ```

  Only the icons in this list end up in the build.

- **Your own SVGs**: put `name.svg` in `src/assets/icons/` and use `icon="name"`. For the `color` prop to work, the SVG's paths need `fill="currentColor"` (or `stroke`).

## React runtime

The build ships [TanStack Redact](https://tanstack.com/redact/latest) instead of React: a smaller runtime with the same API. The `redact()` plugin in `vite.config.ts` swaps it in for `react` and `react-dom`, so the code still imports from `"react"`, and the JavaScript the browser downloads is about a third smaller.

- Redact renders synchronously, without React's time slicing, so a very large re-render can make typing feel slow. Its [compatibility notes](https://tanstack.com/redact/latest/docs/compatibility) list the other differences.
- Unit tests run on React, because Testing Library loads `react-dom` in a way the swap doesn't reach. The [end-to-end tests](testing.md#end-to-end-tests) run on the production build, so they test Redact.
- To go back to React, delete the `redact()` plugin from `vite.config.ts`.

## Next

- [Theming](theming.md)
- [Links and routing](routing.md)
- [Testing](testing.md)
- [API reference](api/index.md)
