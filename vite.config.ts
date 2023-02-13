import * as path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import { VitePWA } from "vite-plugin-pwa/dist";
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
      // VitePWA({
      //   registerType: "autoUpdate",
      //   strategies: "generateSW",
      //   includeAssets: [
      //     "favicon.svg",
      //     "favicon.ico",
      //     "robots.txt",
      //     "apple-touch-icon.png",
      //   ],
      //   manifest: {
      //     name: process.env.APP_LONG_TITLE,
      //     short_name: process.env.APP_TITLE,
      //     description: process.env.APP_DESCRIPTION,
      //     theme_color: "#ffffff",
      //     icons: [
      //       {
      //         src: "android-chrome-192x192.png",
      //         sizes: "192x192",
      //         type: "image/png",
      //       },
      //       {
      //         src: "android-chrome-512x512.png",
      //         sizes: "512x512",
      //         type: "image/png",
      //       },
      //       {
      //         src: "android-chrome-512x512.png",
      //         sizes: "512x512",
      //         type: "image/png",
      //         purpose: "any maskable",
      //       },
      //     ],
      //   },
      // }),
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
