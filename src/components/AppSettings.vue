<template>
  <TransitionRoot :show="state.isSettingsOpen" as="template">
    <Dialog as="div" @close="toggleSettings">
      <div
        class="backdrop-blur2 fixed inset-0 z-50 overflow-y-auto bg-white bg-opacity-50 backdrop-filter dark:bg-zinc-900 dark:bg-opacity-50"
      >
        <div class="text-center">
          <TransitionChild
            as="template"
          >
            <DialogOverlay class="fixed inset-0" />
          </TransitionChild>
          <span
            class="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
            >&#8203;</span
          >
          <TransitionChild
            as="template"
          >
            <div
              class="mt-16 inline-block w-full transform overflow-hidden rounded-lg bg-white px-3 text-left align-top shadow-xl transition-all dark:bg-lityblack dark:text-white sm:max-w-md"
              :class="{
                'bg-opacity-50 backdrop-blur-lg backdrop-filter dark:bg-black/50':
                  state.blurredInterface,
                'mt-32': hasNotch(),
              }"
            >
              <div>
                <button
                  type="button"
                  class="absolute focus:outline-none top-0 right-0 m-2 items-center rounded-full p-0 px-1 text-sm font-medium text-zinc-600 hover:opacity-50 focus:z-10 dark:text-zinc-200 "
                  @click="toggleSettings"
                >
                  <i class="ri-close-circle-fill text-2xl" />
                </button>
                <div class="mt-2">
                  <h1 class="text-center text-2xl">Settings</h1>
                  <div class="mt-1">
                    <div
                      v-if="false"
                      class="text-center font-sans text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >
                      general
                    </div>
                    <div v-if="false" class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Reopen last document on start</span
                          >
                        </SwitchLabel>
                        <Switch
                          v-model="state.useLatestDocument"
                          :class="[
                            state.useLatestDocument
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.useLatestDocument
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div v-if="false" class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Create new document on start</span
                          >
                          <!--                          <span class="text-sm text-zinc-500"> (connected)</span>-->
                        </SwitchLabel>
                        <Switch
                          v-model="state.useLatestDocument"
                          :class="[
                            !state.useLatestDocument
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              !state.useLatestDocument
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div
                      class="text-center font-sans text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >
                      visual
                    </div>

                    <div v-if="false" class="my-2">
                      <select v-model="$i18n.locale">
                        <option
                          v-for="locale in $i18n.availableLocales"
                          :key="`locale-${locale}`"
                          :value="locale"
                        >
                          {{ locale }}
                        </option>
                      </select>
                    </div>

                    <div class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Always enable dark mode</span
                          >
                        </SwitchLabel>
                        <Switch
                          v-model="state.darkInterface"
                          :class="[
                            state.darkInterface
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.darkInterface
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Enable blurred windows</span
                          >
                        </SwitchLabel>
                        <Switch
                          v-model="state.blurredInterface"
                          :class="[
                            state.blurredInterface
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.blurredInterface
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div
                      class="text-center font-sans text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >
                      collaboration
                    </div>

                    <div class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Show other online users in selectors</span
                          >
                          <!--                          <span class="text-sm text-zinc-500"> (connected)</span>-->
                        </SwitchLabel>
                        <Switch
                          v-model="state.showOtherUsers"
                          :class="[
                            state.showOtherUsers
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.showOtherUsers
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Dye nodes in user color</span
                          >
                          <!--                          <span class="text-sm text-zinc-500"> (connected)</span>-->
                        </SwitchLabel>
                        <Switch
                          v-model="state.showOtherColors"
                          :class="[
                            state.showOtherColors
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.showOtherColors
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Show cursors in nodes</span
                          >
                          <span class="text-sm text-zinc-500"></span>
                        </SwitchLabel>
                        <Switch
                          v-model="state.showOtherCursors"
                          :class="[
                            state.showOtherCursors
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.showOtherCursors
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div
                      class="text-center font-sans text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                    >
                      gravity
                    </div>

                    <div class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Use stronger gravity forces
                          </span>
                        </SwitchLabel>
                        <span class="float-right mx-2 text-sm text-zinc-500">
                          <kbd>{{ osKeySymbol() }} + .</kbd>
                        </span>
                        <Switch
                          v-model="state.useStrongGravity"
                          :class="[
                            state.useStrongGravity
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.useStrongGravity
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div v-if="false" class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Fix nodes when dragging around</span
                          >
                          <!--                          <span class="text-sm text-zinc-500"> (connected)</span>-->
                        </SwitchLabel>
                        <Switch
                          v-model="state.fixNodesOnDrag"
                          :class="[
                            state.fixNodesOnDrag
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.fixNodesOnDrag
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div v-if="false" class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Unfix last node when drag other</span
                          >
                          <!--                          <span class="text-sm text-zinc-500"> (connected)</span>-->
                        </SwitchLabel>
                        <Switch
                          v-model="state.unfixLastNode"
                          :class="[
                            state.unfixLastNode
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.unfixLastNode
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div v-if="false" class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Select node after creation</span
                          >
                          <span
                            class="text-sm text-zinc-500 dark:text-zinc-400"
                          >
                            (Gravity)</span
                          >
                        </SwitchLabel>
                        <Switch
                          v-model="state.followNewlyCreatedNode"
                          :class="[
                            state.followNewlyCreatedNode
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.followNewlyCreatedNode
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div v-if="false" class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Select node after creation</span
                          >
                          <span
                            class="text-sm text-zinc-500 dark:text-zinc-400"
                          >
                            (@Mention)</span
                          >
                        </SwitchLabel>
                        <Switch
                          v-model="state.followNewlyCreatedNodeMention"
                          :class="[
                            state.followNewlyCreatedNodeMention
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.followNewlyCreatedNodeMention
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div v-if="false" class="my-2">
                      <SwitchGroup as="div" class="flex justify-between">
                        <SwitchLabel as="span" class="">
                          <span
                            class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                            >Zoom in by selecting node</span
                          >
                          <!--                          <span class="text-sm text-zinc-500"> (connected)</span>-->
                        </SwitchLabel>
                        <Switch
                          v-model="state.zoomInOnNodeClick"
                          :class="[
                            state.zoomInOnNodeClick
                              ? 'bg-zinc-600'
                              : 'bg-zinc-200 dark:bg-zinc-800',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
                          ]"
                        >
                          <span
                            aria-hidden="true"
                            :class="[
                              state.zoomInOnNodeClick
                                ? 'translate-x-5'
                                : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            ]"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>

                    <div
                      @click="
                        setDefaults();
                        toggleSettings();
                      "
                      class="m-5 cursor-pointer text-center font-sans text-xs font-bold uppercase tracking-wider text-zinc-500"
                    >
                      reset default
                    </div>
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
  Switch,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";
import { useDark, useToggle, useTimeAgo, useStorage } from "@vueuse/core";
import { UseTimeAgo } from "@vueuse/components";
import { computed, onMounted, reactive, ref } from "vue";
import * as Y from "yjs";
import { useRoute, useRouter } from "vue-router";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "../composables/useUtility";

const route = useRoute();
const router = useRouter();
const { state, toggleInfo, toggleSettings, setDefaults } = useSettings();
const { hasNotch, osKeySymbol } = useUtility();

const emit = defineEmits(["change"]);

const newColor = ref();
const enabled = ref();

// onMounted(()=> {
//   newColor.value = localState.value.localUserColor
// })

const tabs = [
  { color: "#00a492", current: false },
  { color: "#00b1ff", current: false },
  { color: "#ffc711", current: false },
  { color: "#F98181", current: false },
  { color: "#b7f981", current: false },
  { color: "#81eff9", current: false },
  { color: "#8183f9", current: false },
  { color: "#d181f9", current: false },
  { color: "#f9ab81", current: false },
  { color: "#1d4dd0", current: false },
];

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
