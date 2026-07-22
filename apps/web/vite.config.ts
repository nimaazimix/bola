/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/app/routes",
      generatedRouteTree: "./src/app/routeTree.gen.ts",
    }),
    viteReact(),
  ],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    clearMocks: true,
  },
});

export default config;
