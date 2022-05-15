<template>
  <TransitionRoot :show="state.isLoading" v-if="false" as="template">
    <Dialog as="div">
      <div
        class="
          fixed
          dark:bg-gray-900
          bg-white bg-opacity-50 dark:bg-opacity-50
          backdrop-filter backdrop-blur
          inset-0
          z-50
          overflow-y-auto
        "
      >
        <div class="text-center">
          <TransitionChild
            as="template"
            enter="duration-500 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-50"
            leave="duration-500 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0" />
          </TransitionChild>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogTitle,
  DialogOverlay,
 Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import { useStore } from "../store";
import { useRoute, useRouter } from "vue-router";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "../composables/useUtility";

const route = useRoute();
const router = useRouter();
const { state, toggleInfo } = useSettings()
const { hasNotch } = useUtility()

//
// const props = defineProps<{
//   currentStates: any;
//   provider: any;
//   baseState: any;
// }>();

</script>

<style scoped></style>
