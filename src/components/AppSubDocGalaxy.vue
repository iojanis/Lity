<template>
  <app-sub-doc-selector
    :y-sub-doc="ySubDoc"
    :sub-states="subStates"
    :j-sub-docs="jSubDocs"
    :hocuspocus-provider="hocuspocusProvider"
    :web-rtc-provider="webRtcProvider"
  />
  <transition name="fade">
    <app-sub-doc-galaxy-toolbar
      :linking-nodes="galaxyState.linkingNodes"
      :unlinking-nodes="galaxyState.unlinkingNodes"
      :deleting-nodes="galaxyState.deletingNodes"
      @refresh-graph="reRenderGraph()"
      @undo="yUndoManagerNodes.undo()"
      @redo="yUndoManagerNodes.redo()"
      @link-nodes="linkNodes"
      @unlink-nodes="unlinkNodes2"
      @create-node="
      nodeId
        ? doAction(false, { id: nodeId })
        : doAction(false, true)
    "
      @delete-node="deleteNodes2"
    />
  </transition>
  <div
    id="graph"
    :class="{ 'dark-bg': isDark }"
    class="select-none fixed z-0 top-0 left-0 right-0 bottom-0"
  />
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as Y from "yjs";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppSubDocGalaxyToolbar from "./AppSubDocGalaxyToolbar.vue";
import { useDark } from "@vueuse/core";
import { appWindow } from "@tauri-apps/api/window";
import AppSubDocSelector from "./AppSubDocSelector.vue";
import { useGalaxy } from "../composables/useGalaxy";
import { useUtility } from "../composables/useUtility";
import { useSettings } from "../composables/useSettings";
const isDark = useDark();

const { state, toggleOnly } = useSettings()

const props = defineProps<{
  yRootDoc: Y.Doc;
  ySubDoc: any;
  ySubDocIndexedDb: any;
  ySubDocs: any;
  jSubDocs: any;
  spaceId: any;
  docId: any;
  nodeId: any;
  hocuspocusProvider: any;
  webRtcProvider: any;
  subStates: any;
  rootStates: any;
  paneVisible: boolean;
}>();

const emit = defineEmits([
  "onBackgroundClick",
  "onBackgroundRightClick",
  "onNodeHover",
  "onNodeClick",
  "onNodeRightClick",
  "onNodeDrag",
  "onNodeDragEnd",
  "onLinkRightClick",
  "onZoom",
  "onZoomEnd",
  "onLinkHover",
  "onLinkClick",
  "onLinkRightClick",
  "onEngineTick",
  "onEngineStop",
  "deleteIndex",
  "hide",
  "show",
]);

const {
  osKey,
} = useUtility()

const {
  galaxyState,
  graph,
  computedNodeId,
  gravityOn,
  gravityOff,
  reRenderGraph,
  Escape,
  deleteNodes2,
  unLinkNodes,
  unlinkNodes2,
  doAction,
  linkNodes,
  jsonDocuments,
  zoomIn,
  zoomOut,
  deleteNode,
  yUndoManagerNodes
} = useGalaxy(props.ySubDoc, emit, props.docId, props.rootStates, props.hocuspocusProvider, props.yRootDoc);

const { isAnyOpen } = useSettings()

if (window.rpc && window.rpc.notify) {
  appWindow.listen("tauri://menu", ({ event, payload }) => {
    switch (payload) {
      case "Center-Gravity":
        gravityOn();
        break;
      case "No-Gravity":
        gravityOff();
        break;
      case "Unfix-Gravity":
        reRenderGraph();
        break;
      case "Previous Node":
        break;
      case "Next Node":
        break;
      case "Exit Node":
        Escape();
        break;
      case "Delete Node":
        deleteNodes2();
        break;
      case "Cut Node-Links":
        unlinkNodes2();
        break;
      case "New Root-Node":
        doAction(false, false);
        break;
      case "New Child-Node":
        doAction(false, { id: props.nodeId });
        break;
      case "Link Nodes":
        linkNodes();
        break;
      default:
    }
  });
}

const keys = (evt) => {
  // if (evt.key === 'Escape') {
  //   if (myPane.value.currentBreak() === 'bottom') {
  //     unsetID()
  //     if (isSearchVisible.value) isSearchVisible.value = false
  //     Actions.selectNode(undefined, false)
  //     graph.zoomToFit(300, 20)
  //   }
  //   move('bottom')
  // }
  if (evt.key === "Escape") {
    evt.preventDefault();
    if (!isAnyOpen()) {
      Escape();
    } else {
      console.log('escape')
      toggleOnly('none')
    }
  }
  // if (evt.key === "Backspace") {
  //   evt.preventDefault();
  //   if (isAnyOpen()) {
  //     toggleOnly('selector')
  //   }
  // }
  if (evt.key === "k" && osKey(evt) && !evt.shiftKey) {
    evt.preventDefault();
    doAction(false, { id: props.nodeId });
  }
  if (evt.key === "o" && osKey(evt)) {
    evt.preventDefault();
    // createOneExample()
  }
  if (evt.key === "j" && osKey(evt)) {
    evt.preventDefault();
    doAction(false, true);
  }
  if (evt.key === "l" && osKey(evt)) {
    evt.preventDefault();
    unLinkNodes(props.nodeId);
  }
  if (evt.key === "+" && osKey(evt)) {
    evt.preventDefault();
    zoomIn();
  }
  if (evt.key === "." && osKey(evt)) {
    evt.preventDefault();
    state.value.useStrongGravity = !state.value.useStrongGravity
  }
  // if (evt.key === "," && osKey(evt)) {
  //   evt.preventDefault();
  //   gravityOff();
  // }
  if (evt.key === "-" && osKey(evt)) {
    evt.preventDefault();
    zoomOut();
  }
  if (evt.key === "Backspace" && osKey(evt)) {
    evt.preventDefault();
    deleteNode(props.nodeId);
  }
};

onMounted(()=> {
  document.addEventListener("keydown", keys);
})

onBeforeUnmount(()=>{
  document.removeEventListener("keydown", keys);
})
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 3s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>
