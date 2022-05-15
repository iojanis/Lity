import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { CupertinoPane } from "cupertino-pane";
import { useSettings } from "./useSettings";
import { useUtility } from "./useUtility";
import { useRoute, useRouter } from "vue-router";

export const useEditorPane = (spaceId: any, editorOnly = false) => {
  const { isMobile, hasNotch } = useUtility();
  const { state, isAnyOpen } = useSettings();
  const router = useRouter();
  const route = useRoute();

  let editorPane: CupertinoPane;

  const docId = computed(() => route.params.document);
  const nodeId = computed(() => route.params.node);

  const editorPaneState = reactive({
    paneCreated: false,
    paneVisible: false,
    paneState: "",
    backupPaneState: "",
  });

  const moveToFocus = () => {
    if (isMobile()) {
      if (editorPane.currentBreak() === "top") {
      } else {
        editorPane.moveToBreak("middle");
      }
    }
  };

  const showPane = () => {
    editorPaneState.paneVisible = true;
    editorPane.present();
    // editorPane.showDraggable = true;
  };

  const hide = () => {
    // deprecated
    editorPane.hide();
    // editorPane.showDraggable = false;
  };

  const moveTo = (view: string) => {
    // if (view === 'top') editorPane.moveToHeight(window.innerHeight - 60)
    if (nodeId.value) editorPane.moveToBreak(view);
    editorPaneState.paneState = editorPane.currentBreak() || "bottom";
  };

  const switchPane = () => {
    if (!isAnyOpen()) {
      if (editorPane.currentBreak() === "top") {
        moveTo("bottom");
      } else if (editorPane.currentBreak() === "middle") {
        moveTo("top");
      } else if (editorPane.currentBreak() === "bottom") {
        moveTo("middle");
      }
    }
  };

  const hidePane = () => {
    if (editorPane.isPanePresented() && !editorPane.isHidden()) {
      editorPaneState.paneVisible = false;
      editorPane.hide();
    }
  };

  const unsetId = () => {
    router.push(`/${route.params.space}/${route.params.document}/`);
  };

  const goForward = () => {
    router.forward();
  };

  const goBack = () => {
    router.back();
  };

  const createPane = () => {
    editorPane = new CupertinoPane(".editor-pane", {
      breaks: {
        top: {
          enabled: true,
          height: window.innerHeight - (hasNotch() && isMobile() ? 90 : 60),
          bounce: false,
        },
        middle: {
          enabled: true,
          height: hasNotch() && isMobile() ? 400 : 300,
          bounce: false,
        },
        bottom: {
          enabled: true,
          height: hasNotch() && isMobile() ? 150 : 100,
          bounce: false,
        },
      },
      screenHeightOffset: "100",
      followerElement: "div.nav-bar",
      buttonClose: false,
      showDraggable: isMobile(),
      draggableOver: isMobile(),
      initialBreak: "bottom",
      dragBy: [".pane .draggable"],
      clickBottomOpen: false,
      fastSwipeClose: false,
      fitHeight: false,
      fitScreenHeight: false,
      // topperOverflowOffset: -200,
      bottomOffset: hasNotch() ? -40 : 0,

      onDidDismiss: () => {
        if (spaceId.value && docId.value)
          router.push(`/${spaceId.value}/${docId.value}/`);
        editorPaneState.paneVisible = false;
      },
      onWillPresent: () => {
        editorPaneState.paneVisible = true;
      },
      onDidPresent: () => {
        if (!nodeId.value) editorPane.hide();
      },
      onTransitionEnd: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        editorPaneState.paneState = editorPane.currentBreak()
          ? editorPane.currentBreak()?.toString()
          : "";
        if (editorPane.isPanePresented()) {
          if (!nodeId.value) editorPane.hide();
        } else {
          editorPane.present();
        }
      },
    });
    editorPaneState.paneCreated = true;
    if (editorPane.isPanePresented()) {
      if (!nodeId.value) editorPane.hide();
    } else {
      editorPane.present();
    }
    if (editorPaneState.backupPaneState)
      editorPane.moveToBreak(editorPaneState.backupPaneState);
  };

  const destroyPane = () => {
    editorPaneState.paneCreated = false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    editorPaneState.backupPaneState = editorPane.currentBreak()?.toString();
    editorPane.destroy();
  };

  const recalcPane = () => {
    // editorPane.setBreakpoints({
    //   top: {
    //     enabled: true,
    //     height: window.innerHeight - (hasNotch() && isMobile() ? 90 : 60),
    //     bounce: false,
    //   },
    //   middle: {
    //     enabled: true,
    //     height: hasNotch() && isMobile() ? 400 : 300,
    //     bounce: false,
    //   },
    //   bottom: {
    //     enabled: true,
    //     height: hasNotch() && isMobile() ? 150 : 100,
    //     bounce: false,
    //   },
    // });
    // destroyPane();
    // if (!editorOnly) createPane();
  };

  onMounted(() => {
    if (!editorOnly) createPane();
  });

  onBeforeUnmount(() => {
    destroyPane();
    editorPaneState.paneCreated = false;
  });

  return {
    editorPaneState,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    editorPane,
    moveToFocus,
    showPane,
    hidePane,
    moveTo,
    switchPane,
    hide,
    unsetId,
    goForward,
    goBack,
    destroyPane,
    createPane,
    recalcPane,
  };
};
