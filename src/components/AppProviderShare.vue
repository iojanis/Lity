<template>
  <TransitionRoot :show="state.isShareOpen" as="template">
    <Dialog as="div" @close="toggleShare">
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
                dark:text-white dark:bg-black
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

              :class="{
                'bg-opacity-50 dark:bg-black backdrop-filter backdrop-blur':
                  state.blurredInterface,
                'dark:bg-black bg-white':
                  !state.blurredInterface,
                  'mt-32': hasNotch()
              }"

            >
              <div>
                <div class="">
                  <div class="">
                    <div class="mt-5">
                      <div class="mb-3">
                        <label
                          class="
                          block
                          text-sm
                          font-medium
                          text-zinc-700
                          dark:text-zinc-200
                        "
                        >Room Password<span
                          class="text-sm text-zinc-500 dark:text-zinc-400"
                        >
                            </span
                            ></label
                        >
                        <div class="mt-1 relative rounded-md shadow-sm">
                          <input
                            :disabled="state.useWebRtc"
                            @keydown.enter="state.useWebRtc = !state.useWebRtc"
                            type="text"
                            name="webrtc-password"
                            autocapitalize="off"
                            spellcheck="false"
                            autocomplete="off"
                            autofocus
                            tabindex="0"
                            v-model="state.localWebRtcPassword"
                            class="
                      h-8
                      bg-white
                      border-0
                      dark:bg-white dark:text-white
                      bg-opacity-50 dark:bg-opacity-5
                      focus:ring-2 focus:ring-blue-600
                      text-lg
                      shadow-lg
                      bg-opacity-1
                      block
                      w-full
                      pl-3
                      py-5
                      rounded-lg
                          "
                            placeholder="leave blank for no password protection"
                          />
                        </div>
                      </div>
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Share your Gravity using WebRTC</span>
                        </SwitchLabel>
                        <Switch v-model="state.useWebRtc" :class="[state.useWebRtc ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-800', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500']">
                          <span aria-hidden="true" :class="[state.useWebRtc ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-750']" />
                        </Switch>
                      </SwitchGroup>
                    </div>
                    <div v-if="state.useWebRtc" class="mt-2">
                      <label
                        for="company-website"
                        class="
                          block
                          text-sm
                          font-medium
                          text-zinc-700
                          dark:text-zinc-200
                        "
                        >Share Link</label
                      >
                      <div class="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          name="webrtc-password"
                          readonly
                          :value="computedLink"
                          class="
                      h-8on
                      bg-white
                      border-0
                      dark:bg-white dark:text-white
                      bg-opacity-50 dark:bg-opacity-5
                      focus:ring-2 focus:ring-blue-600
                      text-lg
                      shadow-lg
                      bg-opacity-1
                      block
                      w-full
                      pl-3
                      py-5
                      rounded-lg
                          select-all
                          "
                          placeholder="Share Link"
                        />
                      </div>

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
                      @click="toggleShare"
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
import { useRoute, useRouter } from "vue-router";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "../composables/useUtility";

const route = useRoute();
const router = useRouter();
const { state, toggleShare, toggleOnly } = useSettings()
const { hasNotch } = useUtility()

const emit = defineEmits(["share", "stop-sharing"]);

const newColor = ref();
const enabled = ref();
const shareLink = ref();

const computedLink = computed(()=>{
  return 'https://app.lity.cc/#/' + route.params.space + '/' + route.params.document + '/index?share=true'
} )


// onMounted(()=> { // todo: reactive
//   const match = window.location.href.match("(.*)#\\/(.+)");
//
//   if (match && match.length > 1) shareLink.value = 'https://app.lity.cc/#/' + match[2]
// })


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
