# React/TypeScript Project

This is a template for a React TypeScript project intended for use with Vite and Bun.  
Next.js can also be used, but will require some changes to `package.json` and other configurations.  
It includes some useful tools, tips, and configurations to get you started.

## Dependencies

- [bun](https://bun.sh/)

## Installation

To start a new project, run the following commands:

```bash
bun create vite@latest PROJECT_NAME -- --template react-ts
```

Then, install the dependencies:

```bash
cd PROJECT_NAME
bun install
```

## Usage

To start the development server, run:

```bash
bun run dev
```

## Tips

- To disable console logging twice, open `main.tsx` and wrap your App compoent using React.StrictMode:

  ```ts
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  ```

- To allow absolute imports, open `tsconfig.json` and add the following lines to the compiler options:

  ```json
        "paths": {
            "@/*": ["*"]
        },
  ```

### Useful Modules

- For typing: [@types/node](https://www.npmjs.com/package/@types/node)
- For linting/formatting: [prettier](https://www.npmjs.com/package/prettier)
- For client-side routing: [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- For SVG usage in Vite: [vite-plugin-svgr](https://www.npmjs.com/package/vite-plugin-svgr)
- match-sorter
  Fontawesome Icons:

- "@fortawesome/fontawesome-svg-core": "\*",
- "@fortawesome/free-brands-svg-icons": "\*",
- "@fortawesome/free-regular-svg-icons": "\*",
- "@fortawesome/free-solid-svg-icons": "\*",
- "@fortawesome/react-fontawesome": "\*",

Styling with SCSS:

- sass
- sass-loader

Useful components:

- react-aria-components
- react-select
- react-toastify
