<template>
  <div class="overflow-hidden">
    <div
      style="bottom: 130px"
      class="nav-bar fixed z-50 m-0 mt-0 ml-2 flex"
      :class="{ hidden: nodeId }"
    >
      <button
        class="relative ml-3 inline-flex items-center bg-transparent p-1 pt-0 pr-0 pl-0 text-sm font-medium text-black opacity-70 hover:opacity-100 focus:outline-none dark:text-white"
        type="button"
        @click="goBack"
      >
        <i class="ri-arrow-left-circle-fill text-2xl" />
      </button>
      <button
        class="relative ml-1 inline-flex items-center bg-transparent p-1 pt-0 pl-0 pr-0 text-sm font-medium text-black opacity-70 hover:opacity-100 focus:outline-none dark:text-white"
        @click="goForward"
        type="button"
      >
        <i class="ri-arrow-right-circle-fill text-2xl" />
      </button>
    </div>
    <div
      class="cupertino-pane editor-pane select-none ring-1 ring-black ring-opacity-5"
      :class="{
        blurry: state ? state.blurredInterface && !isDark : false,
        'blurry-dark': state ? state.blurredInterface && isDark : false,
        dark: state && !state.blurredInterface && isDark,
      }"
    >
      <transition name="fade" mode="in-out" duration="200">
        <div
          v-if="
            (subDocState.hasLoadedSubDoc &&
              nodeId &&
              (editorPaneState.paneCreated || editorOnly)) ||
            (state.useHocuspocus &&
              subStates.hocuspocus.connected &&
              subDocState.hasLoadedSubDoc &&
              nodeId &&
              (editorPaneState.paneCreated || editorOnly)) ||
            (state.useWebRtc &&
              subStates.rtc.connected &&
              subDocState.hasLoadedSubDoc &&
              nodeId &&
              (editorPaneState.paneCreated || editorOnly))
          "
        >
          <app-sub-doc-editor
            :editor-only="editorOnly"
            :key="spaceId + docId + nodeId"
            :y-root-doc="yRootDoc"
            :y-root-docs="yRootDocs"
            :j-root-docs="jRootDocs"
            :y-sub-doc="ySubDoc"
            :y-sub-doc-indexed-db="ySubDocIndexedDb"
            :y-sub-docs="ySubDocs"
            :j-sub-docs="jSubDocs"
            :space-id="spaceId"
            :doc-id="docId"
            :node-id="nodeId"
            :hocuspocus-provider="hocuspocusProvider"
            :web-rtc-provider="webRtcProvider"
            :sub-states="subStates"
            :pane-visible="editorPaneState.paneVisible"
            :pane-state="editorPaneState.paneState"
            @on-focus="!editorOnly ? moveToFocus() : null"
            @bottom="!editorOnly ? moveTo('bottom') : null"
            @middle="!editorOnly ? moveTo('middle') : null"
            @top="!editorOnly ? moveTo('top') : null"
            @hide="unsetId()"
            @back="goBack()"
            @forward="goForward()"
            @switch="switchPane()"
          />
        </div>
      </transition>
    </div>
    <app-sub-doc-galaxy
      v-if="
        subDocState.hasLoadedSubDoc &&
        docId &&
        editorPaneState.paneCreated &&
        !editorOnly
      "
      :key="spaceId + docId"
      :y-root-doc="yRootDoc"
      :y-sub-doc="ySubDoc"
      :y-sub-doc-indexed-db="ySubDocIndexedDb"
      :y-sub-docs="ySubDocs"
      :j-sub-docs="jSubDocs"
      :space-id="spaceId"
      :doc-id="docId"
      :node-id="nodeId"
      :hocuspocus-provider="hocuspocusProvider"
      :web-rtc-provider="webRtcProvider"
      :sub-states="subStates"
      :root-states="rootStates"
      :pane-visible="editorPaneState.paneVisible"
      @hide="hidePane"
      @show="showPane"
      @delete-index="deleteModalVisible = true"
    />
    <app-delete-modal
      :open="deleteModalVisible"
      @action="
        deleteSubDoc(props.docId);
        deleteModalVisible = false;
      "
      @cancel="deleteModalVisible = false"
    ></app-delete-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as Y from "yjs";
import AppSubDocEditor from "./AppSubDocEditor.vue";
import AppSubDocGalaxy from "./AppSubDocGalaxy.vue";
import { appWindow } from "@tauri-apps/api/window";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "../composables/useUtility";
import { useEditorPane } from "../composables/useEditorPane";
import { useSubDoc } from "../composables/useSubDoc";
import { useSubProvider } from "../composables/useSubProvider";
import {useClipboard, useDark} from "@vueuse/core";
import AppDeleteModal from "./AppDeleteModal.vue";

const props = defineProps<{
  yRootDoc: Y.Doc;
  yRootDocIndexedDb: any;
  yRootDocs: any;
  jRootDocs: any;
  spaceId: any;
  spaceUrl: any;
  spaceToken: any;
  docId: any;
  nodeId: any;
  hocuspocusProvider: any;
  webRtcProvider: any;
  rootStates: any;
  editorOnly: boolean;
}>();

const router = useRouter();
const route = useRoute();

const { state, logger, toggleSearch, toggleOnly, isAnyOpen } = useSettings();

const { osKey } = useUtility();
const deleteModalVisible = ref(false);

const hocuspocusProvider = ref();
const webRtcProvider = ref();

const {
  editorPaneState,
  editorPane,
  destroyPane,
  moveToFocus,
  showPane,
  hidePane,
  moveTo,
  switchPane,
  unsetId,
  goForward,
  goBack,
  createPane,
  recalcPane,
} = useEditorPane(props.spaceId, props.editorOnly);

const {
  subDocState,
  ySubDoc,
  ySubDocIndexedDb,
  ySubDocs,
  jSubDocs,
  deleteSubDoc,
} = useSubDoc(props.yRootDoc, props.spaceId, props.docId ? props.docId : null);

const { subStates, provideAwareness, provideSubHocuspocus, provideSubWebRtc } =
  useSubProvider();

const subAwareness = provideAwareness(ySubDoc);

const computedNodeId = computed(() => props.nodeId);
const computedDocId = computed(() => props.docId);
const computedUseWebRtc = computed(() => state.value.useWebRtc);
const computedUseHocuspocus = computed(() => state.value.useHocuspocus);
const mounted = ref(false);
const isDark = useDark();

if (computedUseWebRtc.value && !webRtcProvider.value)
  webRtcProvider.value = provideSubWebRtc();
if (computedUseHocuspocus.value && !hocuspocusProvider.value)
  hocuspocusProvider.value = provideSubHocuspocus(
    props.spaceUrl,
    props.spaceToken
  );

if (window.rpc && window.rpc.notify) {
  appWindow.listen("tauri://menu", ({ event, payload }) => {
    switch (payload) {
      case "Open Search":
        toggleSearch();
        break;
      case "Toggle Editor Breaks":
        switchPane();
        break;
      default:
    }
  });
}


const source = ref('')

const { copy } = useClipboard({source});

const keys = (evt) => {
  if (evt.key === "Escape") {
    if (!isAnyOpen()) {
      evt.preventDefault();
      router.push(`/${props.spaceId}/${props.docId}`);
    }
  }
  if (evt.key === "Enter") {
    if (!isAnyOpen() && !props.nodeId) {
      evt.preventDefault();
      router.push(`/${props.spaceId}/${props.docId}/index`);
    }
  }
  if (evt.key === "Tab" && evt.shiftKey && !evt.altKey) {
    evt.preventDefault();
    switchPane();
  }
  if (evt.key === "f" && osKey(evt)) {
    evt.preventDefault();
    toggleOnly("search");
  }
  if (evt.key === "Backspace" && evt.shiftKey && osKey(evt)) {
    evt.preventDefault();
    deleteSubDoc(props.docId);
  }
  if (evt.key === "e" && osKey(evt)) {
    evt.preventDefault();


    const yExport = {
      nodes: [],
      links: [],
      documents: [],
    };

    yExport.nodes = ySubDoc.getMap("nodes").toJSON();
    yExport.links = ySubDoc.getMap("links").toJSON();

    const iterNodes = Object.entries(yExport.nodes);

    for (let i = 0; i < iterNodes.length; i++) {
      const iN = iterNodes[i][1];
      const doc = ySubDoc.getXmlFragment(iN.id);
      yExport.documents.push([iN.id, JSON.stringify(doc)]);
    }

    source.value = JSON.stringify(yExport)
    copy()
  }
};

watch(computedNodeId, () => {
  if (computedNodeId.value && computedNodeId.value.length >= 3) {
    showPane();
  } else {
    hidePane();
  }
  // subAwareness.setLocalStateField('user', {
  //   latestNode: computedNodeId.value ? computedNodeId.value : null,
  //   latestDocument: route.params.document || null,
  //   latestSpace: props.spaceId || null,
  //   name: state.value.localUserName,
  //   color: state.value.localUserColor,
  // })
});

// if (computedDocId.value && computedNodeId.value && state.value.serverAddress) {
//   // props.provider.setAwarenessField("user", {
//   //   latestDocument: computedDocId.value,
//   //   latestNode: computedNodeId.value,
//   //   name: state.value.localUserName,
//   //   color: state.value.localUserColor,
//   // });
// }
// if (computedDocId.value && computedNodeId.value.length <= 3 && state.value.serverAddress) {
//   // props.provider.setAwarenessField("user", {
//   //   latestDocument: computedDocId.value,
//   //   latestNode: null,
//   //   name: state.value.localUserName,
//   //   color: state.value.localUserColor,
//   // });
// }

watch(computedUseWebRtc, () => {
  if (computedUseWebRtc.value) webRtcProvider.value = provideSubWebRtc();
  else if (webRtcProvider.value) webRtcProvider.value.destroy();
});

watch(computedUseHocuspocus, () => {
  if (computedUseHocuspocus.value)
    hocuspocusProvider.value = provideSubHocuspocus(
      props.spaceUrl,
      props.spaceToken
    );
  else if (hocuspocusProvider.value) hocuspocusProvider.value.destroy();
});

onMounted(() => {
  console.log(route.query);
  if (route.query.share === "true") {
    toggleOnly("share");
  }

  appWindow.show();

  document.addEventListener("keydown", keys);
  let resize: any;

  window.addEventListener("resize", () => {
    // if (editorPaneState.paneCreated) destroyPane();
    // clearTimeout(resize);
    // resize = setTimeout(() => {
    //   createPane();
    // }, 1000);
    recalcPane();
  });
});

onBeforeUnmount(() => {
  // editorPane.destroy();
  if (webRtcProvider.value) webRtcProvider.value.destroy();
  if (hocuspocusProvider.value) hocuspocusProvider.value.destroy();
  document.removeEventListener("keydown", keys);
});
</script>
