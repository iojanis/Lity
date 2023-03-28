<template>
  <div v-if="isTauri" data-tauri-drag-region class="absolute text-black z-20 top-0 left-0 right-0 h-7 bg-gray-500/5 backdrop-blur border-b border-gray-500/10" :class="{'hidden': isMobile()}"></div>
</template>

<script setup lang="ts">
import {useUtility} from "@/composables/useUtility";
import { computed } from "vue";
const isTauri = computed(() => window.__TAURI__);
const { isMobile } = useUtility();

</script>

<style scoped>

</style>
