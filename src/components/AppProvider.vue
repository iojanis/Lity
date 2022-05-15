<template>
  <div class="w-screen h-screen">
    <app-header />
    <app-settings />
    <app-provider-selector/>
    <app-provider-selector-edit />
    <app-provider-user />
    <app-provider-share />
    <app-root-doc :editor-only="false" v-if="isRedirected" :space-id="spaceId" :key="spaceId" :space-token="spaceToken" :space-url="spaceUrl" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getMatches } from "@tauri-apps/api/cli";
import { appWindow } from "@tauri-apps/api/window";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "../composables/useUtility";
import { useSpaces } from "../composables/useSpaces";
import AppHeader from "./AppHeader.vue";
import AppRootDoc from "./AppRootDoc.vue";
import AppSettings from "./AppSettings.vue";
import AppProviderSelector from "./AppProviderSelector.vue";
import AppProviderUser from "./AppProviderUser.vue";
import AppProviderShare from "./AppProviderShare.vue";
import AppProviderSelectorEdit from "./AppProviderSelectorEdit.vue";

const { state, toggleOnly } = useSettings();
const { osKey } = useUtility();
const router = useRouter();

const { redirect, isRedirected, spaceId, spaceUrl, spaceToken } = useSpaces()

redirect()


if (appWindow.label !== "main") {
  router.push("/editor/" + appWindow.label);
}

// // tauri related shortcuts
// if (window.rpc && window.rpc.notify) {
//   // appWindow.listen("tauri://menu", ({ event, payload }) => {
//   //   switch (payload) {
//   //     case "Open Settings":
//   //       break;
//   //     case "Show Documents":
//   //       break;
//   //     case "New GravityDoc":
//   //       break;
//   //     case "Toggle Light/Dark":
//   //       break;
//   //     default:
//   //   }
//   // });
// }
//
// keyboard related shortcuts
const keys = (evt) => {
  if (evt.key === "," && osKey(evt)) {
    evt.preventDefault();
    toggleOnly('settings');
  }
};

onMounted(() => {
  document.addEventListener("keydown", keys);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", keys);
});
</script>
