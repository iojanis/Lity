import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import * as Y from "yjs";
import { useSettings } from "./useSettings";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { WebrtcProvider } from "y-webrtc";
import { useUtility } from "./useUtility";
import * as awarenessProtocol from "y-protocols/awareness.js";

export const useRootProvider = (yRootDoc: Y.Doc) => {
  const { awarenessStatesToArray } = useUtility();
  const { state, logger } = useSettings();

  const rootStates = reactive({
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

  let rootHocuspocusProvider: any;
  let rootWebRtcProvider: any;
  const rootAwareness = new awarenessProtocol.Awareness(yRootDoc);

  const provideRootHocuspocus = (url: string, token: string) => {
    if (!url) {
    } else {
      rootHocuspocusProvider = new HocuspocusProvider({
        url: url,
        name: yRootDoc.guid,
        document: yRootDoc,
        token: token,
        awareness: rootAwareness,
        onAwarenessUpdate: ({ states }) => {
          rootStates.hocuspocus.awareness = states;
        },
        onConnect: () => {
          rootStates.hocuspocus.connected = true;
        },
        onAuthenticated: () => {},
        onAuthenticationFailed: () => {
          // rootStates.hocuspocus.readonly = true;
        },
        onMessage: ({ event, message }) => {
          // logger({ onMessage: "Root:" + `[message] ◀️ ${message.name}`, event });
        },
        // onOutgoingMessage: ({ message }) => {
        //   console.info(
        //     "Root:" + `[message] ▶️ ${message.name} (${message.description})`
        //   );
        // },
        onClose: ({ event }) => {
          rootStates.hocuspocus.connected = false;
        },
        onDisconnect: ({ event }) => {
          rootStates.hocuspocus.connected = false;
        },
      });
      rootStates.hocuspocus.init = true;
      rootHocuspocusProvider.setAwarenessField("user", {
        name: state.value.localUserName,
        color: state.value.localUserColor,
      });
    }
  };

  const provideRootWebRtc = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rootWebRtcProvider = new WebrtcProvider(yRootDoc.guid, yRootDoc, {
      awareness: rootAwareness,
      password: state.value.localWebRtcPassword,
    });
    rootStates.rtc.init = true;
    rootStates.rtc.connected = true;
    rootWebRtcProvider.awareness.setLocalStateField("user", {
      name: state.value.localUserName,
      color: state.value.localUserColor,
    });
    rootWebRtcProvider.awareness.on("update", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      rootStates.rtc.awareness = awarenessStatesToArray(
        rootWebRtcProvider.awareness.states
      );
    });
  };

  const destroyRootHocuspocus = () => {
    rootHocuspocusProvider.destroy();
    rootStates.hocuspocus.connected = false;
  };
  const destroyRootWebRtc = () => {
    rootWebRtcProvider.destroy();
    rootStates.rtc.connected = false;
  };

  onBeforeUnmount(() => {
    if (rootHocuspocusProvider) destroyRootHocuspocus();
    if (rootWebRtcProvider) destroyRootWebRtc();
  });

  return {
    rootStates,
    rootHocuspocusProvider,
    rootWebRtcProvider,
    rootAwareness,
    provideRootHocuspocus,
    provideRootWebRtc,
    destroyRootHocuspocus,
    destroyRootWebRtc,
  };
};
