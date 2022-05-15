import { computed, reactive, ref } from "vue";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { useUtility } from "./useUtility";
import { useSettings } from "./useSettings";
import { useRoute, useRouter } from "vue-router";

export const useSubDoc = (yRootDoc: Y.Doc, spaceId: any, docId: any) => {
  const { state, logger } = useSettings();
  const subDocState = reactive({
    hasLoadedSubDoc: false,
  });

  const router = useRouter();
  const route = useRoute();

  // const docId = computed(() => route.params.document);
  const nodeId = computed(() => route.params.node);

  const yRootDocs = yRootDoc.getMap();

  let ySubDoc: Y.Doc;

  if (docId && docId.length >= 1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ySubDoc = new Y.Doc({ guid: docId, autoLoad: true });
  } else {
    ySubDoc = new Y.Doc({ autoLoad: true });
  }

  const ySubDocs = ySubDoc.getMap("nodes");
  const jSubDocs = ref();

  const ySubDocIndexedDb = new IndexeddbPersistence(ySubDoc.guid, ySubDoc);

  const deleteSubDoc = () => {
    yRootDocs.delete(ySubDoc.guid);
    const yNodes = ySubDoc.getMap("nodes");
    const yLinks = ySubDoc.getMap("links");
    const jNodes = yNodes.toJSON();
    const allNodeIds = Object.entries(jNodes);
    const jLinks = yLinks.toJSON();
    const allLinkIds = Object.entries(jLinks);

    for (let i = 0; i < allNodeIds.length; i++) {
      const xmlFrag = ySubDoc.getXmlFragment(allNodeIds[i][0]);
      xmlFrag.delete(0, xmlFrag.length);
      yNodes.delete(allNodeIds[i][0]);
    }

    for (let i = 0; i < allLinkIds.length; i++) {
      yLinks.delete(allLinkIds[i][0]);
    }

    // ySubDocIndexedDb.clearData().then((r) => console.log("cleared data", r));
  };

  const addDocumentOrUpdate = (id: string) => {
    const potential = yRootDocs.get(id);
    if (potential) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      potential.updatedAt = new Date().toString();
      yRootDocs.set(id, potential);
    } else {
      yRootDocs.set(id, {
        guid: id,
        title: "Index",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      });
    }
  };

  // const latestDoc = yRootDoc.getText("latest");
  // latestDoc.delete(0, latestDoc.length);
  // latestDoc.insert(0, ySubDoc.guid);

  ySubDocIndexedDb.once("synced", () => {
    subDocState.hasLoadedSubDoc = true;
    if (!docId || !nodeId.value) {
      addDocumentOrUpdate(ySubDoc.guid);
      // router.push(`/${spaceId.value}/${ySubDoc.guid}/index`);
    }

    jSubDocs.value = Object.entries(ySubDocs.toJSON());

    ySubDocs.observe(() => {
      jSubDocs.value = Object.entries(ySubDocs.toJSON());
    });
  });

  return {
    subDocState,
    ySubDoc,
    ySubDocIndexedDb,
    ySubDocs,
    jSubDocs,
    deleteSubDoc,
  };
};
