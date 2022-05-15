import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useSettings } from "./useSettings";
import { WebrtcProvider } from "y-webrtc";
import { useUtility } from "./useUtility";
import * as awarenessProtocol from "y-protocols/awareness.js";

export const useSubProvider = () => {
  const { awarenessStatesToArray } = useUtility();
  const { state, logger } = useSettings();

  const subStates = reactive({
    init: false,
    hocuspocus: {
      init: false,
      connected: false,
      authenticated: false,
      readOnly: false,
      awareness: [],
    },
    rtc: {
      init: false,
      connected: false,
      readOnly: false,
      awareness: [],
    },
  });

  let subAwareness: any;
  let ySubDoc: any;

  const provideAwareness = (SubDoc: Y.Doc) => {
    ySubDoc = SubDoc;
    subAwareness = new awarenessProtocol.Awareness(ySubDoc);
    return subAwareness;
  };

  let subHocuspocusProvider: any;
  let subWebRtcProvider: any;

  const provideSubHocuspocus = (url: string, token: string) => {
    if (!url && !token) {
    } else {
      subHocuspocusProvider = new HocuspocusProvider({
        url: url,
        name: ySubDoc.guid,
        document: ySubDoc,
        token: token,
        awareness: subAwareness,
        onAwarenessUpdate: ({ states }) => {
          subStates.hocuspocus.awareness = states;
        },
        onConnect: () => {
          subStates.hocuspocus.connected = true;
        },
        onAuthenticated: () => {
          subStates.hocuspocus.authenticated = true;
        },
        onAuthenticationFailed: () => {
          subStates.hocuspocus.authenticated = false;
        },
        onMessage: ({ event, message }) => {
          subStates.hocuspocus.init = true;
        },
        onClose: ({ event }) => {
          subStates.hocuspocus.init = false;
        },
        onDisconnect: ({ event }) => {
          subStates.hocuspocus.connected = false;
          subStates.hocuspocus.authenticated = false;
        },
      });
      subStates.hocuspocus.init = true;
      subHocuspocusProvider.setAwarenessField("user", {
        name: state.value.localUserName,
        color: state.value.localUserColor,
      });
      testAwareness();
      return subHocuspocusProvider;
    }
    return null;
  };

  const provideSubWebRtc = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    subWebRtcProvider = new WebrtcProvider(ySubDoc.guid, ySubDoc, {
      awareness: subAwareness,
      password: state.value.localWebRtcPassword,
    });
    subStates.rtc.init = true;
    subStates.rtc.connected = true;
    subWebRtcProvider.awareness.setLocalStateField("user", {
      test1: true,
      name: state.value.localUserName,
      color: state.value.localUserColor,
    });
    subWebRtcProvider.awareness.on("update", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      subStates.rtc.awareness = awarenessStatesToArray(
        subWebRtcProvider.awareness.states
      );
    });
    return subWebRtcProvider;
  };

  const testAwareness = () => {
    subAwareness.setLocalStateField("user", {
      latestDocument: "route.params.document",
      latestNode: "route.params.node",
      test: true,
      name: state.value.localUserName,
      color: state.value.localUserColor,
    });
  };

  return {
    subStates,
    subAwareness,
    subWebRtcProvider,
    subHocuspocusProvider,
    provideAwareness,
    provideSubHocuspocus,
    provideSubWebRtc,
  };
};
