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

## Notes

Many of these components and libraries are optional and can be removed if not needed,
or replaced with alternatives of your choice.

For example:

- AppTooltip can be replaced with [react-tooltip](https://www.npmjs.com/package/react-tooltip) or similar.

Useful component libraries include:

- [react-aria-components](https://react-spectrum.adobe.com/react-aria/index.html)
- [react-select](https://react-select.com/home)
- [react-toastify](https://github.com/fkhadra/react-toastify)
