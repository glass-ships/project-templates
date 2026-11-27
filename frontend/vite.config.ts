import babel from "@rolldown/plugin-babel";
import { fileURLToPath, URL } from "node:url";
import { redact } from "@tanstack/redact/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    svgr({
      include: "src/assets/icons/*.svg",
    }),
    // TanStack Redact: a smaller runtime with React's API, swapped in for react and react-dom at build
    // time, so the code still imports from "react". Renders synchronously (no time slicing); see
    // https://tanstack.com/redact/latest/docs/compatibility. Remove this to go back to React.
    // Unit tests run on React: @testing-library/react loads react-dom with require(), which the
    // swap doesn't reach, and hooks break with two runtimes. The e2e tests run on the Redact build.
    !process.env.VITEST &&
      redact({
        // the app mounts with createRoot, never hydrateRoot (no server rendering)
        features: { hydration: false },
      }),
  ],
  // Example of route proxying to a backend server
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|react-router|@tanstack[\\/]redact)/,
            },
            {
              name: "query-vendor",
              test: /node_modules[\\/]@tanstack[\\/]react-query/,
            },
            {
              name: "ui-vendor",
              test: /node_modules[\\/](react-select|@fortawesome[\\/]react-fontawesome)/,
            },
            {
              name: "icons",
              test: /node_modules[\\/]@fortawesome[\\/](free-solid-svg-icons|free-regular-svg-icons|free-brands-svg-icons)/,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
