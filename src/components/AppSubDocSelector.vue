<template>
  <TransitionRoot :show="state.isSearchOpen" as="template">
    <Dialog as="div" @close="toggleSearch">
      <div
        class="hs fixed inset-0 z-50 select-none overflow-y-auto bg-white bg-opacity-50 dark:bg-neutral-900 dark:bg-opacity-50"
      >
        <div class="text-center">
          <TransitionChild as="template">
            <DialogOverlay data-tauri-drag-region class="fixed inset-0" />
          </TransitionChild>
          <span
            class="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
            >&#8203;</span
          >
          <TransitionChild as="template">
            <div
              class=" mt-16 inline-block w-full transform overflow-hidden rounded-lg p-0 pb-4 text-left align-top shadow-xl transition-all sm:max-w-4xl  border border-1 border-black/5"
              :class="{
                'bg-opacity-50 backdrop-blur backdrop-filter dark:bg-black/50':
                  state.blurredInterface,
                'bg-white dark:bg-black':
                  !state.blurredInterface,
                'mt-32': hasNotch(),
              }"
            >
              <div class="m-3">
                <div
                  v-if="
                    subStates.hocuspocus.awareness &&
                    subStates.hocuspocus.awareness.length > 1 &&
                    false
                  "
                  class="pb-4"
                >
                  <user-bubble
                    v-for="state in subStates.hocuspocus.awareness"
                    :key="state.clientId"
                    :route="route"
                    :state="state"
                  />
                </div>
                <span v-if="true" class="relative z-0 mb-3 inline-flex w-full">
                  <form class="w-full" @submit.prevent="">
                    <input
                      ref="inputSubRef"
                      @keydown.up.prevent="upHandler"
                      @keydown.down.prevent="downHandler"
                      @keydown.right.prevent="rightHandler"
                      @keydown.enter.prevent="enterHandler"
                      v-model="searchContent"
                      placeholder="Search Nodes or Navigate"
                      autocomplete="off"
                      autocapitalize="off"
                      spellcheck="false"
                      autofocus
                      type="text"
                      name="search"
                      class="bg-opacity-1 block h-8 w-full rounded-md border-0 bg-white bg-opacity-50 py-5 pl-3 pr-12 text-lg shadow-lg focus:ring-2 focus:ring-blue-600/70 dark:bg-neutral-800 dark:bg-opacity-50 dark:text-white"
                    />
                    <div class="absolute inset-y-0 right-0 flex py-0.5 pr-1.5">
                      <!--                <button-->
                      <!--                  type="button"-->
                      <!--                  class="-ml-px p-1 relative inline-flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-200 hover:opacity-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-neutral-600"-->
                      <!--                  @click="isHelpOpen = !isHelpOpen"-->
                      <!--                >-->
                      <!--                  <i-->
                      <!--                    class="ri-settings-2-fill text-2xl"-->
                      <!--                  />-->
                      <!--                </button>-->
                      <button
                        type="button"
                        class="relative -ml-px inline-flex items-center p-1 text-sm font-medium text-neutral-600 hover:opacity-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-neutral-600 dark:text-neutral-200"
                        @click="toggleSearch"
                      >
                        <i class="ri-close-circle-fill text-2xl" />
                      </button>
                    </div>
                  </form>
                </span>
                <div
                  v-if="false"
                  class="hs relative z-0 w-full overflow-y-scroll"
                >
                  <span class="flex inline-flex flex-nowrap">
                    <!--                    <button-->
                    <!--                      type="button"-->
                    <!--                      class="-->
                    <!--                        ml-1-->
                    <!--                        p-1-->
                    <!--                        pr-3-->
                    <!--                        relative-->
                    <!--                        inline-flex-->
                    <!--                        items-center-->
                    <!--                        text-sm-->
                    <!--                        font-medium-->
                    <!--                        text-neutral-900-->
                    <!--                        dark:text-neutral-100-->
                    <!--                        hover:opacity-70-->
                    <!--                        flex-nowrap-->
                    <!--                        focus:z-10 focus:outline-none-->
                    <!--                      "-->
                    <!--                      @click="-->
                    <!--                        emit('createNode');-->
                    <!--                        toggleSelector();-->
                    <!--                      "-->
                    <!--                    >-->
                    <!--                      <i class="ri-add-circle-fill pr-1.5 text-2xl" />-->
                    <!--                      New Node-->
                    <!--                    </button>-->
                    <!--                    <button-->
                    <!--                      type="button"-->
                    <!--                      aria-label="Link Nodes"-->
                    <!--                      class="-->
                    <!--                        ml-1-->
                    <!--                        p-1-->
                    <!--                        pr-3-->
                    <!--                        relative-->
                    <!--                        inline-flex-->
                    <!--                        items-center-->
                    <!--                        text-sm-->
                    <!--                        font-medium-->
                    <!--                        text-neutral-900-->
                    <!--                        dark:text-neutral-100-->
                    <!--                        hover:opacity-70-->
                    <!--                        focus:z-10 focus:outline-none-->
                    <!--                      "-->
                    <!--                      @click="-->
                    <!--                        toggleSelector();-->
                    <!--                        toggleShare();-->
                    <!--                      "-->
                    <!--                    >-->
                    <!--                      <i-->
                    <!--                        :class="{-->
                    <!--                          'animate animate-pulse text-neutral-600 dark:text-neutral-400':-->
                    <!--                            true,-->
                    <!--                        }"-->
                    <!--                        class="ri-share-fill pr-1.5 text-2xl"-->
                    <!--                      />-->
                    <!--                      {{ true ? "Linking" : "Link" }} Nodes-->
                    <!--                    </button>-->

                    <!--                    <span-->
                    <!--                      class="ml-1 p-1 pr-3 relative inline-flex items-center text-sm font-medium text-neutral-900 dark:text-neutral-100 disabled flex-nowrap focus:z-10 focus:outline-none font-sans"-->
                    <!--                    >-->
                    <!--                      <i-->
                    <!--                        class="ri-drag-move-fill pr-1.5 text-2xl"-->
                    <!--                        aria-label="Navigate using your keyboard"-->
                    <!--                      />-->
                    <!--                    </span>-->
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
                v-if="true"
                class="hs relative z-0 mt-0 w-full overflow-x-scroll overflow-ellipsis"
              >
                <ul role="list" style="max-height: 50vh">
                  <li v-for="(doc, i) in searchDocs" :key="doc">
                    <router-link
                      v-if="doc[1] && doc[1].title"
                      active-class="bg-neutral-200 dark:bg-neutral-800"
                      class="hs m-3 mb-1 mt-0.5 mb-0.5 block overflow-x-scroll rounded-md bg-white bg-opacity-50 text-black hover:bg-neutral-100 dark:bg-neutral-900 dark:bg-opacity-50 dark:text-white dark:hover:bg-neutral-800"
                      :class="{
                        'bg-neutral-100 ring-2 ring-neutral-600 hover:bg-neutral-200 hover:text-black dark:bg-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white':
                          i === selectedIndex,
                      }"
                      @click="selectItem(doc, i)"
                      :to="
                        '/' +
                        route.params.space +
                        '/' +
                        route.params.document +
                        '/' +
                        doc[0]
                      "
                    >
                      <div style="min-width: 300px" class="px-2 py-0">
                        <div class="flex justify-between">
                          <div class="flex">
                            <p
                              class="flex w-64 items-center overflow-ellipsis text-sm font-bold"
                            >
                              {{ truncate(getPlainText(doc[1].title), 32) }}
                              <span
                                v-if="doc[1].id === 'index'"
                                class="ml-2 h-5 overflow-hidden overflow-ellipsis rounded-md bg-neutral-100 px-2 text-xs uppercase leading-5 shadow-md dark:bg-neutral-800 dark:text-white"
                              >
                                {{ doc[0] }}
                              </span>
                            </p>
                          </div>
                          <div class="mt-2 mt-0 flex items-center"></div>
                          <div class="mt-1 mb-1 flex items-center">
                            <p class="w-28 px-2 text-sm font-medium">
                              <span
                                class="mr-2 text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300"
                                >Links
                              </span>
                              {{ doc[1].links.length }}
                            </p>
                            <p class="w-48 px-2 text-sm font-medium">
                              <span
                                class="mr-2 text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300"
                                >Created
                              </span>
                              <UseTimeAgo
                                v-slot="{ timeAgo }"
                                :time="doc[1].created"
                              >
                                {{ timeAgo }}
                              </UseTimeAgo>
                            </p>
                            <p class="w-48 text-sm font-medium">
                              <span
                                class="mr-2 text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300"
                                >Updated
                              </span>
                              <UseTimeAgo
                                v-slot="{ timeAgo }"
                                :time="doc[1].updated"
                              >
                                {{ timeAgo }}
                              </UseTimeAgo>
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
import * as Y from "yjs";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "../composables/useUtility";

const Document = ExtensionDocument.extend({
  content: "heading block*",
});

const route = useRoute();
const router = useRouter();

const { hasNotch, truncate } = useUtility();

const { state, toggleSearch } = useSettings();

const props = defineProps<{
  ySubDoc: any;
  jSubDocs: any;
  hocuspocusProvider: any;
  webRtcProvider: any;
  subStates: any;
}>();

const nodes = ref([]);

const searchContent = ref("");

const searchOpen = computed(() => state.value.isSearchOpen);

const searchDocs = computed(() => {
  if (props.jSubDocs)
    return props.jSubDocs
      .filter((item: any) => {
        return getPlainText(item[1].title)
          .toLowerCase()
          .includes(searchContent.value.toLowerCase());
      })
      .sort((a, b) =>
        getPlainText(a.title) > getPlainText(b.title)
          ? 1
          : getPlainText(b.title) > getPlainText(a.title)
          ? -1
          : 0
      );

  return [];
});

const selectedIndex = ref(0);

watch(searchContent, () => {
  selectedIndex.value = 0;
});
watch(searchOpen, (open) => {
  if (searchOpen.value) {
    selectedIndex.value = 0;
  } else {
    searchContent.value = "";
  }
});

const upHandler = () => {
  selectedIndex.value =
    (selectedIndex.value + searchDocs.value.length - 1) %
    searchDocs.value.length;
};

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % searchDocs.value.length;
};

const rightHandler = () => {
  searchContent.value = getPlainText(
    searchDocs.value[selectedIndex.value][1].title
  );
};

const enterHandler = () => {
  if (searchContent.value.startsWith("{")) importDocument(searchContent.value);
  else selectItem(searchDocs.value[selectedIndex.value], selectedIndex.value);
};

const selectItem = (id, index) => {
  selectedIndex.value = index;
  toggleSearch();
  router.push(
    "/" + route.params.space + "/" + route.params.document + "/" + id[0]
  );
  // if (index >= searchDocs.value.length) {
  // }
};

const importDocument = (doc) => {
  if (doc) {
    searchContent.value = "";
    const jDoc = JSON.parse(doc);
    if (jDoc.nodes && jDoc.links && jDoc.documents) {
      const links = Object.entries(jDoc.links);
      const nodes = Object.entries(jDoc.nodes);

      const yNodes = props.ySubDoc.getMap("nodes");
      const yLinks = props.ySubDoc.getMap("links");

      for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i][1].created) nodes[i][1].created = new Date();
        if (!nodes[i][1].updated) nodes[i][1].updated = new Date();
        yNodes.set(nodes[i][0], nodes[i][1]);
      }
      for (let i = 0; i < links.length; i++) {
        yLinks.set(links[i][0], links[i][1]);
      }
      for (let i = 0; i < jDoc.documents.length; i++) {
        props.ySubDoc.getXmlFragment();
      }
    }
  }
};

function getHTML(json) {
  return generateHTML(json, [
    Document,
    StarterKit.configure({
      history: false,
      document: false,
    }),
    Highlight,
    TaskList,
    TaskItem,
    Paragraph,
  ]);
}

const getPlainText = (obj) => {
  let plainText = "";
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      plainText += obj[i].text;
    }
  } else {
    plainText = obj;
  }

  return plainText;
};

const inputSubRef = ref();

const selectInput = () => {
  if (searchOpen.value) {
    inputSubRef.value.focus();
  }
};

const keys = (evt) => {
  selectInput();
};

onMounted(() => {
  document.addEventListener("keydown", keys);
  nodes.value = props.ySubDoc.getMap("nodes").toJSON();
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", keys);
});
</script>
