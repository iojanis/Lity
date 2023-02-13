<template>
  <TransitionRoot :show="state.isSelectorOpen" as="template">
    <Dialog as="div" @close="toggleSelector">
      <div
        class="hs fixed inset-0 z-50 select-none overflow-y-auto bg-white bg-opacity-50 dark:bg-neutral-900 dark:bg-opacity-50"
      >
        <div class="text-center">
          <TransitionChild as="template">
            <DialogOverlay
              class="backdrop-blur2 fixed inset-0 backdrop-filter"
            />
          </TransitionChild>
          <span
            class="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
            >&#8203;</span
          >
          <TransitionChild as="template">
            <div
              class="mt-16 inline-block w-full transform overflow-hidden rounded-lg p-0 pb-4 text-left align-top shadow-xl transition-all sm:max-w-4xl border border-1 border-black/5"
              :class="{
                'bg-opacity-50 backdrop-blur-lg backdrop-filter dark:bg-black/50':
                  state.blurredInterface,
                'bg-white dark:bg-black':
                  !state.blurredInterface,
                'mt-32': hasNotch(),
              }"
            >
              <div class="m-3 text-black dark:text-white">
                <div
                  v-if="
                    rootStates.hocuspocus.awareness &&
                    rootStates.hocuspocus.awareness.length > 1
                  "
                  class="pb-4"
                >
                  <user-bubble
                    v-for="state in rootStates.hocuspocus.awareness.slice(1)"
                    :key="state.clientId"
                    :route="route"
                    :state="state"
                  />
                </div>
                <span
                  v-if="true"
                  class="relative z-0 mb-3 inline-flex w-full justify-between"
                >
                  <form class="w-full" @submit.prevent="">
                    <input
                      ref="inputRootRef"
                      @keydown.up.prevent="upHandler"
                      @keydown.down.prevent="downHandler"
                      @keydown.left="leftHandler"
                      @keydown.right="rightHandler"
                      @keydown.enter.prevent="enterHandler"
                      v-model="searchContent"
                      placeholder="Search Documents or Navigate"
                      autocomplete="off"
                      autocapitalize="off"
                      spellcheck="false"
                      autofocus
                      tabindex="0"
                      type="text"
                      name="search"
                      class="block h-8 w-full rounded-md border-0 bg-white bg-opacity-50 bg-opacity-100 bg-opacity-50 py-5 pl-3 pr-12 text-lg shadow-lg focus:ring-2 focus:ring-blue-600/70 dark:bg-neutral-800 dark:bg-opacity-50 dark:text-white"
                    />
                    <div class="absolute inset-y-0 right-0 flex py-0.5 pr-1.5">
                      <button
                        type="button"
                        class="relative -ml-px inline-flex items-center rounded-md p-1 pr-0 text-sm font-medium text-neutral-600 hover:opacity-50 focus:z-10 dark:text-neutral-200"
                        @click="toggleOnly('info')"
                      >
                        <i class="ri-information-fill text-2xl" />
                      </button>
                      <button
                        type="button"
                        class="relative -ml-px inline-flex items-center rounded-md p-1 text-sm font-medium text-neutral-600 hover:opacity-50 focus:z-10 dark:text-neutral-200"
                        @click="toggleSelector"
                      >
                        <i class="ri-close-circle-fill text-2xl" />
                      </button>
                    </div>
                  </form>
                </span>
                <div class="hs relative z-0 w-full overflow-y-scroll">
                  <span class="flex inline-flex flex-nowrap">
                    <!--                    <span-->
                    <!--                      class="-->
                    <!--                        ml-1-->
                    <!--                        p-1-->
                    <!--                        relative-->
                    <!--                        inline-flex-->
                    <!--                        items-center-->
                    <!--                        text-sm-->
                    <!--                        font-medium-->
                    <!--                        text-neutral-900-->
                    <!--                        dark:text-neutral-100-->
                    <!--                        disabled-->
                    <!--                        flex-nowrap-->
                    <!--                        focus:z-10-->
                    <!--                        font-sans-->
                    <!--                      "-->
                    <!--                    >-->
                    <!--                      <i-->
                    <!--                        class="ri-drag-move-fill text-2xl"-->
                    <!--                        title="Navigate using your keyboard"-->
                    <!--                      />-->
                    <!--                    </span>-->
                    <button
                      type="button"
                      class="relative m-1.5 ml-0.5 inline-flex items-center rounded-md bg-opacity-50 p-1 pl-2 pr-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 hover:bg-opacity-50 focus:z-10 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:bg-opacity-50"
                      :class="{
                        'bg-neutral-100 ring-2 ring-neutral-600 hover:bg-neutral-200 hover:bg-opacity-100 dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:hover:bg-opacity-100 ':
                          selectedActionIndex === 0,
                      }"
                      @click="selectAction(0)"
                    >
                      <i class="ri-focus-line pr-1.5 text-2xl" />
                      New
                    </button>
                    <button
                      type="button"
                      class="relative m-1.5 inline-flex items-center rounded-md bg-opacity-50 p-1 pl-2 pr-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 hover:bg-opacity-50 focus:z-10 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:bg-opacity-50"
                      :class="{
                        'bg-neutral-100 ring-2 ring-neutral-600 hover:bg-neutral-200 hover:bg-opacity-100 dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:hover:bg-opacity-100 ':
                          selectedActionIndex === 1,
                      }"
                      @dragenter="
                        toggleSelector();
                        toggleProvider();
                      "
                      @click="selectAction(1)"
                    >
                      <i
                        :class="{
                          'animate animate-pulse text-green-600 dark:text-green-500':
                            rootStates.hocuspocus.connected &&
                            state.useHocuspocus,
                        }"
                        class="ri-focus-2-line pr-1.5 text-2xl"
                      />
                      Spaces
                    </button>
                    <button
                      type="button"
                      class="relative m-1.5 inline-flex items-center rounded-md bg-opacity-50 p-1 pl-2 pr-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 hover:bg-opacity-50 focus:z-10 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:bg-opacity-50"
                      :class="{
                        'bg-neutral-100 ring-2 ring-neutral-600 hover:bg-neutral-200 hover:bg-opacity-100 dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:hover:bg-opacity-100':
                          selectedActionIndex === 2,
                      }"
                      @click="selectAction(2)"
                    >
                      <i
                        :class="{
                          'animate animate-pulse text-blue-600 dark:text-blue-500':
                            state.useWebRtc,
                        }"
                        class="ri-broadcast-line pr-1.5 text-2xl"
                      />
                      {{ state.useWebRtc ? "Sharing" : "Share" }}
                    </button>
                    <button
                      type="button"
                      class="relative m-1.5 inline-flex items-center rounded-md bg-opacity-50 p-1 pl-2 pr-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 hover:bg-opacity-50 focus:z-10 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:bg-opacity-50"
                      :class="{
                        'bg-neutral-100 ring-2 ring-neutral-600 hover:bg-neutral-200 hover:bg-opacity-100 dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:hover:bg-opacity-100':
                          selectedActionIndex === 3,
                      }"
                      @click="selectAction(3)"
                    >
                      <i
                        class="ri-fingerprint-line pr-1.5 text-2xl"
                        :style="'color: ' + state.localUserColor"
                      />
                      {{ state.localUserName }}
                    </button>
                    <!--            <button-->
                    <!--                type="button"-->
                    <!--                class="ml-1 p-1 pr-3 relative inline-flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:opacity-70 focus:z-10 focus:outline-none focus:ring-1 focus:ring-neutral-600"-->
                    <!--                @click="router.push(`/${route.params.space}`); store.dispatch('openSelector')"-->
                    <!--            >-->
                    <!--              <i-->
                    <!--                  class="ri-file-add-fill pr-1.5 text-2xl"-->
                    <!--              />-->
                    <!--              New Document-->
                    <!--            </button>-->
                    <!--            <button-->
                    <!--                type="button"-->
                    <!--                class="-ml-px p-1 pr-3 relative inline-flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:opacity-70 focus:z-10 focus:outline-none focus:ring-1 focus:ring-neutral-600"-->
                    <!--                @click="isShared = !isShared"-->
                    <!--            >-->
                    <!--              <i-->
                    <!--                  :class="{'ri-cloud-off-fill': isShared, 'ri-cloud-fill': !isShared}"-->
                    <!--                  class=" pr-1.5 text-2xl"-->
                    <!--              />-->
                    <!--              {{ isShared ? 'Stop Sharing' : 'Share Document' }}-->
                    <!--            </button>-->
                    <!--            <input-->
                    <!--                v-if="isShared"-->
                    <!--                v-model="docId"-->
                    <!--                readonly-->
                    <!--                type="text"-->
                    <!--                class="select-all dark:bg-transparent dark:text-white w-40 h-10 mr-2"-->
                    <!--            >-->
                  </span>
                </div>
              </div>
              <div
                class="hs relative z-0 w-full overflow-x-scroll overflow-ellipsis"
              >
                <ul role="list">
                  <li
                    class="group"
                    v-for="(doc, i) in searchDocs"
                    :key="doc[1].id"
                  >
                    <router-link
                      v-if="doc[1] && doc[1].title"
                      exact
                      class="hs m-3 mb-1 mt-1 block overflow-x-scroll rounded-md bg-white bg-opacity-50 text-black group-hover:bg-neutral-100 group-hover:bg-opacity-50 dark:bg-neutral-900 dark:bg-opacity-50 dark:text-white dark:group-hover:bg-neutral-800"
                      :class="{
                        'bg-neutral-100 ring-2 ring-neutral-600 hover:bg-neutral-200 group-hover:text-black dark:bg-neutral-700 dark:group-hover:bg-neutral-800 dark:group-hover:text-white':
                          i === selectedIndex,
                      }"
                      exact-active-class="bg-neutral-200 dark:bg-neutral-800"
                      :to="'/' + route.params.space + '/' + doc[0]"
                      @click="setStates(doc[0], i)"
                    >
                      <div style="min-width: 300px" class="px-2">
                        <div class="flex justify-between">
                          <div class="flex">
                            <p
                              class="mx-1 flex w-64 items-center overflow-hidden text-sm font-bold"
                            >
                              {{ getPlainText(doc[1].title) }}
                              <!--                              <span class="px-2 ml-2 text-xs w-48 overflow-hidden h-5 overflow-ellipsis leading-5 uppercase rounded-full bg-neutral-100 dark:bg-neutral-800 dark:text-white">-->
                              <!--                                {{ doc[0] }}-->
                              <!--                              </span>-->
                            </p>
                          </div>
                          <div
                            class="mt-1 flex items-center text-sm sm:mt-0"
                          ></div>
                          <div class="mt-1 flex items-center text-sm sm:mt-0">
                            <p
                              v-if="true"
                              class="w-28 px-1 text-sm font-medium"
                            >
                              <span
                                class="mr-2 text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300"
                                >nodes
                              </span>
                              {{ doc[1].count }}
                            </p>
                            <p class="text-md w-48 font-medium">
                              <span
                                class="mr-2 text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300"
                                >UPDATED
                              </span>
                              <UseTimeAgo
                                v-slot="{ timeAgo }"
                                :time="doc[1].updatedAt"
                              >
                                {{ timeAgo }}
                              </UseTimeAgo>
                            </p>

                            <p class="w-48 px-1 text-sm font-medium">
                              <span
                                class="mr-2 text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300"
                                >CREATED
                              </span>
                              <UseTimeAgo
                                v-slot="{ timeAgo }"
                                :time="doc[1].createdAt"
                              >
                                {{ timeAgo }}
                              </UseTimeAgo>
                            </p>
                            <p class="groups-hover:opacity-100 px-2 opacity-0">
                              <i class="ri-delete-bin-2-fill text-lg" />
                            </p>
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </li>
                </ul>
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
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useStore } from "../store";
import { UseTimeAgo } from "@vueuse/components";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { generateHTML } from "@tiptap/core";
import { Paragraph } from "@tiptap/extension-paragraph";
import { TaskList } from "@tiptap/extension-task-list";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskItem } from "@tiptap/extension-task-item";
import ExtensionDocument from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import UserBubble from "./AppRootDocSelectorUserBubble.vue";
import ContextMenu from "./ui/ContextMenu.vue";
import * as Y from "yjs";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "../composables/useUtility";
import { useTippy } from "vue-tippy";

const route = useRoute();
const router = useRouter();

const {
  state,
  toggleSelector,
  toggleProvider,
  toggleShare,
  toggleUser,
  toggleOnly,
} = useSettings();

const { getPlainText, hasNotch } = useUtility();

const props = defineProps<{
  yRootDoc: Y.Doc;
  yRootDocIndexedDb: any;
  jRootDocs: any;
  hocuspocusProvider: any;
  webRtcProvider: any;
  rootStates: any;
}>();

const emit = defineEmits(["createDocument"]);

const searchContent = ref("");
const selectedIndex = ref(null);
const selectedActionIndex = ref(null);

const setStates = (id: string, index: any) => {
  selectItem(id, index);
};

const selectorOpen = computed(() => state.value.isSelectorOpen);

watch(selectorOpen, () => {
  if (selectorOpen.value) {
    selectedIndex.value = null;
    selectedActionIndex.value = 0;
  } else {
    searchContent.value = "";
  }
});

const searchDocs = computed(() => {
  if (props.jRootDocs)
    return props.jRootDocs
      .filter(
        (item) =>
          item[1].title &&
          getPlainText(item[1].title)
            .toLowerCase()
            .includes(searchContent.value.toLowerCase())
      )
      .sort((a, b) =>
        a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0
      )
      .sort((a, b) =>
        getPlainText(a.title) > getPlainText(b.title)
          ? 1
          : getPlainText(b.title) > getPlainText(a.title)
          ? -1
          : 0
      );

  return [];
});

const SelectorRef = ref(null);

const { show } = useTippy(SelectorRef, {
  content: ContextMenu,
  placement: "bottom-start",
  trigger: "manual",
  interactive: true,
  animation: "fade",
  delay: 0,
  duration: 100,
  arrow: false,
  theme: "",
  offset: [0, 0],
});

const actions = [
  {
    name: "New Gravity",
    command: "/new gravity",
    icon: "focus-line",
    condition: () => false,
    action: () => {
      emit("createDocument");
      toggleSelector();
    },
  },
  {
    name: "Spaces",
    command: "/spaces",
    icon: "focus-2-line",
    condition: () =>
      props.rootStates.hocuspocus.connected && state.value.useHocuspocus,
    action: () => {
      toggleSelector();
      toggleProvider();
    },
  },
  {
    name: state.value.useWebRtc ? "Sharing" : "Share",
    command: "/share",
    icon: "broadcast-line",
    condition: () => state.value.useWebRtc,
    action: () => {
      toggleSelector();
      toggleShare();
    },
  },
  {
    name: state.value.localUserName,
    command: "/new gravity",
    icon: "focus-line",
    condition: () => false,
    action: () => {
      toggleSelector();
      toggleUser();
    },
  },
];

const upHandler = () => {
  selectedActionIndex.value = null;
  selectedIndex.value =
    selectedIndex.value === null
      ? searchDocs.value.length - 1
      : (selectedIndex.value + searchDocs.value.length - 1) %
        searchDocs.value.length;
};

const downHandler = () => {
  selectedActionIndex.value = null;
  selectedIndex.value =
    selectedIndex.value === null
      ? 0
      : (selectedIndex.value + 1) % searchDocs.value.length;
};

const rightHandler = () => {
  if (!searchContent.value) {
    selectedIndex.value = null;
    selectedActionIndex.value =
      selectedActionIndex.value === null
        ? 0
        : (selectedActionIndex.value + 1) % 4;
  }
};

const leftHandler = () => {
  if (!searchContent.value) {
    selectedIndex.value = null;
    selectedActionIndex.value =
      selectedActionIndex.value === null
        ? 3
        : (selectedActionIndex.value + 4 - 1) % 4;
  }
};

const enterHandler = () => {
  if (searchContent.value.startsWith("http"))
    router.push(searchContent.value.split("#")[1]);
  if (searchContent.value.startsWith("/")) router.push(searchContent.value);
  else if (searchContent.value.startsWith("{"))
    importDocument(searchContent.value);
  else
    selectedIndex.value !== null
      ? selectItem(
          searchDocs.value[selectedIndex.value][0],
          selectedIndex.value
        )
      : selectAction(selectedActionIndex.value);
};

const selectItem = (id, index) => {
  selectedIndex.value = index;
  toggleSelector();
  router.push("/" + route.params.space + "/" + id + "/index");
  if (index >= searchDocs.value.length) {
  }
};

const selectAction = (actionIndex) => {
  selectedActionIndex.value = actionIndex;
  actions[actionIndex].action();
};

watch(searchDocs, () => {
  if (selectedIndex.value === null) selectedIndex.value = 0;
  selectedActionIndex.value = null;
});

const importDocument = (doc) => {
  if (doc) {
    searchContent.value = "";
    const jDoc = JSON.parse(doc);
    console.log(jDoc)
    if (jDoc.nodes && jDoc.links && jDoc.documents) {
      const newYDoc = new Y.Doc();
      router.push(`/${route.params.space}/${newYDoc.guid}/index`);
      const links = Object.entries(jDoc.links);
      const nodes = Object.entries(jDoc.nodes);

      const yNodes = newYDoc.getMap("nodes");
      const yLinks = newYDoc.getMap("links");

      for (let i = 0; i < nodes.length; i++) {
        console.log(nodes[i][0], nodes[i][1])
        yNodes.set(nodes[i][0], nodes[i][1]);
      }
      for (let i = 0; i < links.length; i++) {
        yLinks.set(links[i][0], links[i][1]);
        console.log(links[i][0], links[i][1])
      }
      for (let i = 0; i < jDoc.documents.length; i++) {
        // console.log(jDoc.documents[i])
      }
    }
  }
};

const inputRootRef = ref();

const selectInput = () => {
  if (selectorOpen.value) {
    inputRootRef.value.focus();
  }
};

const keys = (evt) => {
  selectInput();
};

onMounted(() => {
  document.addEventListener("keydown", keys);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", keys);
});
</script>
