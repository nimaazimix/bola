import { defineConfig } from "eslint/config";
import baseConfig from "./base.js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default defineConfig(
  ...baseConfig,
  {
    ...pluginReact.configs.flat.recommended,
    ...pluginReact.configs.flat["jsx-runtime"],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginReactHooks.configs.flat.recommended,
);
