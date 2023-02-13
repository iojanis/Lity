import * as path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from "./package.json";
import VitePluginHtmlEnv from "vite-plugin-html-env";
import { fileURLToPath } from "url";
// import {internalIpV4} from "internal-ip";

process.env.VITE_APP_VERSION = pkg.version;
if (process.env.NODE_ENV === "production") {
  process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString();
}

export default defineConfig(async () => {
  const { internalIpV4 } = await import('internal-ip');
  const host = await internalIpV4();
  const config = {
    server: {
      host: '0.0.0.0', // listen on all addresses
      port: 3003,
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host,
        // host: '0.0.0.0', // listen on all addresses
        port: 3006,
      },
    },
    plugins: [
      vue({
        script: {
          refSugar: true,
        },
      }),
      VitePluginHtmlEnv(),
    ],
        resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  }
  return config;
});
