<template>
  <TransitionRoot :show="state.isInfoOpen" as="template">
    <Dialog as="div" @close="toggleInfo">
      <div
        class="select-none fixed dark:bg-zinc-900 bg-white bg-opacity-50 dark:bg-opacity-50 backdrop-filter backdrop-blur2 inset-0 z-50 overflow-y-auto"
      >
        <div class="text-center">
          <TransitionChild
            as="template"
          >
            <DialogOverlay class="fixed inset-0" />
          </TransitionChild>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <TransitionChild
            as="template"
          >
            <div
              class="inline-block align-bottom dark:text-white rounded-lg mt-16 px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all m-3 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
              :class="{
                'bg-opacity-50 dark:bg-black/50 backdrop-filter backdrop-blur':
                  state.blurredInterface,
                'bg-white dark:bg-black':
                  !state.blurredInterface,
                'mt-32': hasNotch(),
              }"
            >
              <div>
                <button
                  type="button"
                  class="p-0 m-2 focus:outline-none px-1 absolute top-0 right-0 items-center text-sm font-medium text-zinc-600 dark:text-zinc-200 hover:opacity-50 rounded-full focus:z-10"
                  @click="toggleInfo"
                >
                  <i class="ri-close-circle-fill text-2xl" />
                </button>
                <div class="grid grid-cols-3 shrink-0 text-black dark:text-white">
                  <img
                    class="h-32 w-auto"
                    src="@/assets/icon.png"
                    alt="lity logo"
                  />
                  <div class="mx-auto text-left my-auto col-span-2">
                    <h1 class="mb-2 leading-1 text-2xl">
                      Lity
                      <span class="text-zinc-700 dark:text-zinc-300">Alpha</span>
                    </h1>
                    <p class="text-zinc-600 dark:text-zinc-200">
                      <strong>Version</strong> {{ state.version }}
                    </p>
                    <p class="text-zinc-600 dark:text-zinc-200">
                      <strong>Website</strong> <a href="https://lity.cc">Lity.CC</a>
                    </p>
                  </div>
                </div>
                <div
                  :class="{ prose: !isDark, 'prose-light': isDark }"
                  class="py-3"
                >
                  <p class="text-zinc-600 dark:text-zinc-200 text-justify">
                    <strong>Lity</strong> is developed by
                    <strong
                      ><a target="blank" href="https://janis.io">Janis Jendraß</a></strong
                    >
                    with a little help from my friends.
                  </p>
                  <p>
                    <br />
                    This software was created out of an experiment and will be replaced by a successor in the future. More Information soon @lity.cc
                  </p>
                </div>
              </div>
              <div v-if="false" class="mt-5 sm:mt-6 mx-auto">
                <button
                  @click="toggleInfo"
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-lg hover:shadow-xl px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 sm:col-start-1 sm:text-sm"
                >
                  Close Info
                </button>
              </div>
            </div>
          </TransitionChild>
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
  Switch,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";
import { useStore } from "../store";
import { useRoute, useRouter } from "vue-router";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "../composables/useUtility";

import { useDark } from "@vueuse/core";

const route = useRoute();
const router = useRouter();
const { state, toggleInfo } = useSettings();
const { hasNotch } = useUtility();

const isDark = useDark();

// const props = defineProps<{
//   currentStates: any;
//   provider: any;
//   baseState: any;
// }>();
</script>

<style scoped></style>
