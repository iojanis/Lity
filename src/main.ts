// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createApp, onMounted } from "vue";
import App from "./App.vue";
import router from "./router";
import { createHead } from "@vueuse/head";
import "remixicon/fonts/remixicon.css";
import { createI18n } from "vue-i18n";
import VueTippy from "vue-tippy";
import "@/assets/tippy.css";
import "tippy.js/animations/shift-away.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import { useRegisterSW } from "virtual:pwa-register/vue";
// import merge from "deepmerge";
// import renderMathInElement from "katex/dist/contrib/auto-render";
// import katex from "katex";
const intervalMS = 60 * 60 * 1000;

// const updateServiceWorker = useRegisterSW({
//   onRegistered(r: ServiceWorkerRegistration | undefined) {
//     r &&
//       setInterval(() => {
//         r.update();
//       }, intervalMS);
//   },
// });

const head = createHead();
const app = createApp(App);

app.use(router);
app.use(head);

app.use(VueTippy, {
  directive: "tippy",
  component: "tippy",
  componentSingleton: "tippy-singleton",
  animation: "shift-away",
  defaultProps: {
    theme: "translucent",
    arrow: false,
    placement: "bottom",
    delay: [300, 50],
    duration: [50, 50],
    allowHTML: true,
  },
});

const messages = {
  en: {
    message: {
      hello: "hello world",
    },
  },
  ja: {
    message: {
      hello: "こんにちは、世界",
    },
  },
};

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages,
});

app.use(i18n);

// app.directive("katex", {
//   updated(el, binding) {
//     const globalOptions = {
//       delimiters: [
//         { left: "$$", right: "$$", display: true },
//         { left: "\\[", right: "\\]", display: true },
//         { left: "$", right: "$", display: false },
//         { left: "\\(", right: "\\)", display: false },
//       ],
//     };
//     renderMathInElement(el, globalOptions);
//   },
// });

app.mount("#app");
