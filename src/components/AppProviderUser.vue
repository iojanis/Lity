<template>
  <TransitionRoot :show="state.isUserOpen" as="template">
    <Dialog as="div" @close="toggleUser">
      <div
        class="
          fixed
          dark:bg-zinc-900
          bg-white bg-opacity-50 dark:bg-opacity-50
          backdrop-filter backdrop-blur2
          inset-0
          z-50
          overflow-y-auto
        "
      >
        <div class="text-center">
          <TransitionChild
            as="template"
            enter="duration-75 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-50"
            leave="duration-75 ease-in"
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
          <TransitionChild
            as="template"
            enter="ease-out duration-75"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-75"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              class="
                inline-block
                align-top
                bg-white
                dark:text-white dark:bg-black/50
                rounded-lg
                mt-16
                px-4
                pt-5
                pb-4
                text-left
                overflow-hidden
                shadow-xl
                transform
                transition-all
                m-3 sm:max-w-md sm:w-full sm:p-6
              "
              :class="{'bg-opacity-80 dark:bg-black/50 backdrop-filter backdrop-blur': state.blurredInterface,
                  'mt-32': hasNotch() }"

            >
              <div>
                <div class="">
                  <div v-if="true" class="mt-5">

                    <div class="mt-2">
                      <label
                        for="company-website"
                        class="
                          block
                          text-sm
                          font-medium
                          text-zinc-700
                          dark:text-zinc-200
                        "
                        >Display Name</label
                      >
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <input
                          v-model="state.localUserName"
                          type="text"
                          autofocus
                          tabindex="0"
                          name="lity-server"
                          class="
                      h-8
                      bg-white
                      border-0
                      dark:bg-white dark:text-white
                      bg-opacity-50 dark:bg-opacity-5
                      focus:ring-2 focus:ring-zinc-600
                      text-lg
                      shadow-lg
                      bg-opacity-1
                      block
                      w-full
                      pl-3
                      py-5
                      rounded-lg
                          "
                          placeholder="Name"
                        />
                      </div>
                    </div>
                    <div class="mt-2">
                      <label
                        for="company-website"
                        class="
                          block
                          text-sm
                          font-medium
                          text-zinc-700
                          dark:text-zinc-200
                        "
                        >Color</label
                      >
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <input
                          v-model="state.localUserColor"
                          type="text"
                          name="lity-server"
                          class="
                      h-8
                      bg-white
                      border-0
                      dark:bg-white dark:text-white
                      bg-opacity-50 dark:bg-opacity-5
                      focus:ring-2 focus:ring-zinc-600
                      text-lg
                      shadow-lg
                      bg-opacity-1
                      block
                      w-full
                      pl-3
                      py-5
                      rounded-lg
                          "
                          placeholder="Color"
                        />
                        <div
                          class="absolute inset-y-0 right-0 flex py-0.5 pr-1.5"
                        >
                          <!--                <button-->
                          <!--                  type="button"-->
                          <!--                  class="-ml-px p-1 relative inline-flex items-center text-sm font-medium text-zinc-600 dark:text-zinc-200 hover:opacity-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-zinc-600"-->
                          <!--                  @click="isHelpOpen = !isHelpOpen"-->
                          <!--                >-->
                          <!--                  <i-->
                          <!--                    class="ri-settings-2-fill text-2xl"-->
                          <!--                  />-->
                          <!--                </button>-->
                          <button
                            type="button"
                            class="
                              -ml-px
                              p-1
                              relative
                              inline-flex
                              items-center
                              text-sm
                              font-medium
                              text-zinc-600
                              dark:text-zinc-200
                              focus:z-10 focus:outline-none
                            "
                          >
                            <i
                              class="ri-paint-brush-fill text-2xl"
                              :style="'color: ' + state.localUserColor"
                            />
                          </button>
                        </div>
                      </div>
                      <!--
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->

                    </div>

                    <div class="mt-4">
                      <nav class="flex justify-between" aria-label="Tabs">
                              <span @click="state.localUserColor = tab.color" v-for="tab in tabs" :key="tab.color"
                                    :style="'cursor: pointer; background: ' + tab.color" :class="[tab.current ? ' text-zinc-700' : 'text-zinc-500 hover:text-zinc-700', 'transition transition-opacity hover:opacity-50 px-3 py-2 font-medium text-sm rounded-md']" class="inline-flex items-center justify-center h-8 w-8 rounded-full">
<!--                                <span class="text-sm font-medium leading-none text-white">TW</span>-->
                              </span>
                      </nav>
                    </div>

                    <button
                      type="button"
                      class="
                          p-0
                          m-2
                          px-3
                          absolute
                          top-0
                          left-0
                          items-center
                          text-sm
                          font-medium
                          text-zinc-600
                          dark:text-zinc-200
                          hover:opacity-50
                          rounded-full
                          focus:z-10
                          "
                      @click="toggleOnly('selector')"
                    >
                      <i class="ri-arrow-left-circle-fill text-2xl" />
                    </button>

                    <button
                      type="button"
                      tabindex="1"
                      class="
                          p-0
                          m-2
                          px-3
                          absolute
                          top-0
                          right-0
                          items-center
                          text-sm
                          font-medium
                          text-zinc-600
                          dark:text-zinc-200
                          hover:opacity-50
                          rounded-full
                          focus:z-10
                        "
                      @click="toggleUser"
                    >
                      <i class="ri-close-circle-fill text-2xl" />
                    </button>
                  </div>
                </div>
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
 Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import { useStore } from "../store";
import { useDark, useToggle, useTimeAgo, useStorage } from "@vueuse/core";
import { UseTimeAgo } from "@vueuse/components";
import { computed, onMounted, reactive, ref } from "vue";
import * as Y from "yjs";
import { useRoute, useRouter } from "vue-router";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "../composables/useUtility";

const route = useRoute();
const router = useRouter();
const { state, toggleOnly, toggleProvider, toggleUser } = useSettings()
const { hasNotch } = useUtility()

const emit = defineEmits(["change"]);

const newColor = ref();
const enabled = ref();

// onMounted(()=> {
//   newColor.value = localState.value.localUserColor
// })

const tabs = [
  { color: '#00a492', current: false },
  { color: '#00b1ff', current: false },
  { color: '#ffc711', current: false },
  { color: '#F98181', current: false },
  { color: '#b7f981', current: false },
  { color: '#81eff9', current: false },
  { color: '#8183f9', current: false },
  { color: '#d181f9', current: false },
  { color: '#f9ab81', current: false },
  { color: '#0077ff', current: false },
]

// const state = reactive({
//   localUserName: state.value.localUserName,
//   localUserId: state.value.localUserId,
//   localUserColor: state.value.localUserColor,
//   serverAddress: state.value.serverAddress,
//   serverToken: state.value.serverToken,
//   localLatestSpace: state.value.localLatestSpace,
//   localLatestDocument: state.value.localLatestDocument,
//   localLatestNode: state.value.localLatestNode,
// });
//
// defineExpose({ state: state });
</script>

<style scoped></style>
