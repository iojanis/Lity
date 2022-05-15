<template>
  <div class="h-full flex flex-col overflow-hidden dark:text-white text-black">
    <app-info-modal />
    <app-loading />
<!--    <app-provider-selector-->
<!--      v-if="state"-->
<!--      :root-states="rootStates"-->
<!--      :hocuspocus-provider="rootHocuspocusProvider"-->
<!--      :web-rtc-provider="rootWebRtcProvider"-->
<!--    />-->
    <app-root-doc-selector
      v-if="rootState.hasLoadedRootDoc && !editorOnly"
      :y-root-doc="yRootDoc"
      :y-root-doc-indexed-db="yRootIndexedDb"
      :hocuspocus-provider="rootHocuspocusProvider"
      :web-rtc-provider="rootWebRtcProvider"
      :root-states="rootStates"
      :j-root-docs="jRootDocs"
      @create-document="setGravity"
    />
    <app-sub-doc
      v-if="rootState.hasLoadedRootDoc"
      :editor-only="editorOnly"
      :y-root-doc="yRootDoc"
      :y-root-doc-indexed-db="yRootIndexedDb"
      :y-root-docs="yRootDocs"
      :j-root-docs="jRootDocs"
      :key="route.params.space + route.params.document + computedUseWebRtc + computedUseHocuspocus"
      :space-id="route.params.space"
      :space-token="spaceToken"
      :space-url="spaceUrl"
      :doc-id="route.params.document"
      :node-id="route.params.node"
      :hocuspocus-provider="rootHocuspocusProvider"
      :web-rtc-provider="rootWebRtcProvider"
      :root-states="rootStates"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getMatches } from "@tauri-apps/api/cli";
import { appWindow } from "@tauri-apps/api/window";
import { useSettings } from "../composables/useSettings";
import { useRootDoc } from "../composables/useRootDoc";
import { useUtility } from "../composables/useUtility";
import { useRootProvider } from "../composables/useRootProvider";
import AppSubDoc from "./AppSubDoc.vue";
import AppRootDocSelector from "./AppRootDocSelector.vue";
import AppInfoModal from "./AppInfoModal.vue";
import AppProviderSelector from "./AppProviderSelector.vue";
import { useSpaces } from "../composables/useSpaces";
import AppLoading from "./AppLoading.vue";

const props = defineProps<{
  spaceId: any;
  spaceUrl: any;
  spaceToken: any;
  editorOnly: boolean;
}>();

const route = useRoute();

const { state, logger, toggleOnly } = useSettings();
const { osKey } = useUtility();
const { getSpace, setGravity, setIndex } = useSpaces();

const {
  rootState,
  yRootDoc,
  yRootDocs,
  yRootIndexedDb,
  jRootDocs
} = useRootDoc(props.spaceId);

const {
  rootStates,
  rootHocuspocusProvider,
  rootWebRtcProvider,
  rootAwareness,
  provideRootHocuspocus,
  provideRootWebRtc,
  destroyRootWebRtc,
  destroyRootHocuspocus,
} = useRootProvider(yRootDoc);


const currentSpace = getSpace(props.spaceId);

const computedUseWebRtc = computed(() => state.value.useWebRtc);
const computedUseHocuspocus = computed(() => state.value.useHocuspocus);

if (computedUseWebRtc.value) provideRootWebRtc();
if (computedUseHocuspocus.value) provideRootHocuspocus(props.spaceUrl, props.spaceToken);

const computedSpaceId = computed(() => route.params.space);
const computedDocId = computed(() => route.params.document);
const computedNodeId = computed(() => route.params.node);

watch(computedNodeId, () => {
  updateStates()
});
watch(computedDocId, () => {
  updateStates()
  if (!computedDocId.value) {
    setGravity()
  }
});
watch(computedSpaceId, () => {
  setIndex(props.spaceId, route.params.document)
});

const updateStates = () => {
  rootAwareness.setLocalStateField('user', {
    latestNode: computedNodeId.value ? computedNodeId.value : null,
    latestDocument: computedDocId.value ? computedDocId.value : null,
    latestSpace: props.spaceId || null,
    name: state.value.localUserName,
    color: state.value.localUserColor,
  })
  state.value.localLatestNode = computedNodeId.value ? computedNodeId.value : null;
  state.value.localLatestSpace = props.spaceId || null;
  state.value.localLatestDocument = computedDocId.value ? computedDocId.value : null;
}

// tauri related shortcuts
if (window.rpc && window.rpc.notify) {
  appWindow.listen("tauri://menu", ({ event, payload }) => {
    switch (payload) {
      case "Open Settings":
        break;
      case "Show Documents":
        break;
      case "New GravityDoc":
        break;
      case "Toggle Light/Dark":
        break;
      default:
    }
  });
}

watch(computedUseWebRtc,() => {
  if (computedUseWebRtc.value) provideRootWebRtc(); else destroyRootWebRtc()
})

watch(computedUseHocuspocus,() => {
  if (computedUseHocuspocus.value) provideRootHocuspocus(props.spaceUrl, props.spaceToken); else destroyRootHocuspocus()
})

// keyboard related shortcuts
const keys = (evt) => {
  if (evt.key === "p" && osKey(evt)) {
    evt.preventDefault();
    toggleOnly('selector');
  }
};

onMounted(() => {
  document.addEventListener("keydown", keys);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", keys);
});
</script>
