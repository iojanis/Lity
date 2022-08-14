import { computed, reactive } from "vue";
import { useStorage } from "@vueuse/core";
import { useUtility } from "./useUtility";

const { uuid, getRandomUser, getRandomColor } = useUtility();

const versionString =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_APP_VERSION + "-dev"
    : import.meta.env.VITE_APP_VERSION;

const tokenString = import.meta.env.VITE_APP_SERVER_TOKEN
  ? import.meta.env.VITE_APP_SERVER_TOKEN.toString()
  : "";

const apiString = import.meta.env.VITE_APP_SERVER_URL
  ? import.meta.env.VITE_APP_SERVER_URL.toString()
  : "";

const signalingString = import.meta.env.VITE_APP_SIGNALING_SERVER_URL
  ? import.meta.env.VITE_APP_SIGNALING_SERVER_URL.toString()
  : "";

const debugMode = import.meta.env.MODE === "development";

const debugLog: any[] = [];

const logger = (message: any) => {
  if (state.value.debug) console.log(message);
  if (state.value.debug) debugLog.push(message);
};

const defaultValues = {
  debug: debugMode,
  version: versionString,
  useHocuspocus: true,
  serverAddress: apiString,
  serverToken: tokenString,
  useWebRtc: false,
  signalingServerAddress: signalingString,
  localUserName: getRandomUser(),
  localUserId: uuid(),
  localUserColor: getRandomColor(),
  localWebRtcPassword: "",
  localLatestSpace: null,
  localLatestDocument: null,
  localLatestNode: null,
  isSettingsOpen: false,
  isLoading: false,
  isInfoOpen: false,
  isSelectorOpen: false,
  isSearchOpen: false,
  isUserOpen: false,
  isShareOpen: false,
  isProviderOpen: false,
  isEditOpen: false,
  blurredInterface: false,
  darkInterface: true,
  useLatestDocument: true,
  showOtherColors: true,
  showOtherUsers: true,
  showOtherCursors: true,
  useStrongGravity: false,
  fixNodesOnDrag: true,
  unfixLastNode: true,
  zoomInOnNodeClick: true,
  followNewlyCreatedNode: true,
  followNewlyCreatedNodeMention: true,
  useTimeStampAsNodeId: false,
};

const state = useStorage("local-lity-states", defaultValues);

const setDefaults = () => {
  state.value = defaultValues;
};

const setAppDefaults = () => {
  state.value.isLoading = true;
  state.value.isSelectorOpen = false;
  state.value.isSearchOpen = false;
  state.value.isSettingsOpen = false;
  state.value.isInfoOpen = false;
  state.value.isProviderOpen = false;
  state.value.isEditOpen = false;
  state.value.isUserOpen = false;
  state.value.isShareOpen = false;
  state.value.useWebRtc = false;

  if (state.value.version < versionString) {
    state.value.version = versionString;
    state.value.isInfoOpen = true;
  }

  if (state.value.blurredInterface) {
    state.value.blurredInterface = false;
    setTimeout(() => {
      state.value.blurredInterface = true;
    }, 1000);
  }
};

const checkForOpenWindows = () => {};

const toggleOnly = (value: string) => {
  state.value.isSelectorOpen =
    value === "selector" ? !state.value.isSelectorOpen : false;
  state.value.isSearchOpen =
    value === "search" ? !state.value.isSearchOpen : false;
  state.value.isSettingsOpen =
    value === "settings" ? !state.value.isSettingsOpen : false;
  state.value.isInfoOpen = value === "info" ? !state.value.isInfoOpen : false;
  state.value.isProviderOpen =
    value === "provider" ? !state.value.isProviderOpen : false;
  state.value.isEditOpen = value === "edit" ? !state.value.isEditOpen : false;
  state.value.isUserOpen = value === "user" ? !state.value.isUserOpen : false;
  state.value.isShareOpen =
    value === "share" ? !state.value.isShareOpen : false;
};

const isAnyOpen = () => {
  if (state.value.isSelectorOpen) return true;
  if (state.value.isSearchOpen) return true;
  if (state.value.isSettingsOpen) return true;
  if (state.value.isInfoOpen) return true;
  if (state.value.isProviderOpen) return true;
  if (state.value.isEditOpen) return true;
  if (state.value.isUserOpen) return true;
  if (state.value.isShareOpen) return true;
  return false;
};

const toggleSelector = (value?: boolean) => {
  state.value.isSelectorOpen = !state.value.isSelectorOpen;
};
const toggleSearch = (value?: boolean) => {
  state.value.isSearchOpen = !state.value.isSearchOpen;
};
const toggleSettings = (value?: boolean) => {
  state.value.isSettingsOpen = !state.value.isSettingsOpen;
};
const toggleInfo = (value?: boolean) => {
  state.value.isInfoOpen = !state.value.isInfoOpen;
};
const toggleProvider = (value?: boolean) => {
  state.value.isProviderOpen = !state.value.isProviderOpen;
};
const toggleUser = (value?: boolean) => {
  state.value.isUserOpen = !state.value.isUserOpen;
};
const toggleShare = (value?: boolean) => {
  state.value.isShareOpen = !state.value.isShareOpen;
};

setAppDefaults();

export const useSettings = () => {
  return {
    state,
    debug: debugMode,
    debugLog,
    toggleOnly,
    logger,
    checkForOpenWindows,
    toggleSelector,
    toggleSearch,
    toggleSettings,
    toggleProvider,
    toggleInfo,
    toggleUser,
    toggleShare,
    setDefaults,
    setAppDefaults,
    isAnyOpen,
  };
};
