import { createRouter, createWebHashHistory } from "vue-router";

import AppProvider from "@/components/AppProvider.vue";
import AppEditorProvider from "@/components/AppEditorProvider.vue";

const routes = [
  { path: "/", component: AppProvider },
  { path: "/:space", component: AppProvider },
  { path: "/editor/:space/:document/:node", component: AppEditorProvider },
  { path: "/:space/:document", component: AppProvider },
  { path: "/:space/:document/:node", component: AppProvider },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "text-gray-900 font-bold",
  routes,
});

export default router;
