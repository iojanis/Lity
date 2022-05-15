import { reactive, ref } from "vue";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
// import { useUtility } from "./useUtility";
// import { useSettings } from "./useSettings";
// import { useSpaces } from "./useSpaces";

export const useRootDoc = (guid: string) => {
  // const { stringToSlug } = useUtility();
  // const { state, logger } = useSettings();
  // const { setIndex } = useSpaces();

  const rootState = reactive({
    hasLoadedRootDoc: false,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const yRootDoc = new Y.Doc({ guid, autoLoad: true });
  const yRootDocs = yRootDoc.getMap();
  const yRootSettings = yRootDoc.getMap("settings");
  const yRootLatestDoc = yRootDoc.getText("latest");
  const yRootIndexedDb = new IndexeddbPersistence(guid, yRootDoc);
  const jRootDocs = ref();

  yRootIndexedDb.once("synced", () => {
    rootState.hasLoadedRootDoc = true;

    jRootDocs.value = Object.entries(yRootDocs.toJSON());

    for (let i = 0; i < jRootDocs.value.length; i++) {
      if (!jRootDocs.value[i][1].filled) {
        yRootDocs.delete(jRootDocs.value[i][1].guid);
      }
    }

    yRootDocs.observe(() => {
      jRootDocs.value = Object.entries(yRootDocs.toJSON());
    });
  });

  return {
    rootState,
    yRootDoc,
    yRootDocs,
    yRootSettings,
    yRootLatestDoc,
    yRootIndexedDb,
    jRootDocs,
  };
};
