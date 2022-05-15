<template>
  <router-link
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :disabled="!state.user.latestDocument"
    :to="`/${route.params.space}/${state.user.latestDocument}/${
      state.user.latestNode ? state.user.latestNode : 'index'
    }`"
    tabindex="1"
    @click="emit('setStates')"
    class="
      inline-flex
      transition transition-all
      ease-in-out
      duration-500
      group
      items-center
      justify-center

      h-10
      w-10
      rounded-full
      mr-2
    "
    :class="{ 'w-auto': hover }"
    :style="'background: ' + state.user.color"
  >
    <span
      v-if="state.user && state.user.name"
      class="font-medium leading-none text-white text-shadow-lg"
      ><span v-if="!hover" class="">{{
        state.user.name
          .split(/\s/)
          .reduce((response, word) => (response += word.slice(0, 1)), "")
      }}</span
      ><span v-if="hover" class="mx-3">{{ state.user.name }}</span></span
    >
  </router-link>
</template>
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  route: any;
  state: any;
}>();

const hover = ref(false);

const emit = defineEmits(["setStates"]);
</script>
