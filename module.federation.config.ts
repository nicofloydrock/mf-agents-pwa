import federation from "@originjs/vite-plugin-federation";
import type { PluginOption } from "vite";

export const moduleFederationConfig = (): PluginOption =>
  federation({
    name: "agente",
    filename: "mfEntry.js",
    exposes: {
      "./App": "./src/App.tsx",
    },
    shared: {
      react: { singleton: true, eager: true, requiredVersion: "^18.2.0" },
      "react-dom": {
        singleton: true,
        eager: true,
        requiredVersion: "^18.2.0",
      },
    },
  });
