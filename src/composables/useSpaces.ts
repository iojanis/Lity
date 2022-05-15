// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import { useUtility } from "./useUtility";

// watch(docId, () => {
//   localState.value.localLatestSpace = spaceId.value || null;
//   localState.value.localLatestDocument = docId.value || null;
// });
//
// watch(isSelectorOpen, () => {
//   if (isSelectorOpen.value === true) {
//     jsonDocuments.value = Object.entries(yRootDocs.toJSON());
//   }
// });

// watch(spaceId, () => {
//   if (!spaceId.value) router.push(`/y/`);
//   if (spaceId.value === "undefined") router.push(`/y/`);
// });
//
// if (!route.params.space) {
//   router.push(`/y/`);
// }
//
// if (
//   !spaceId.value &&
//   !docId.value &&
//   localState.value.localLatestSpace &&
//   localState.value.localLatestDocument &&
//   localState.value.localLatestNode
// ) {
//   router.push(
//     `/${localState.value.localLatestSpace}/${localState.value.localLatestDocument}/${localState.value.localLatestNode}/`
//   );
// } else if (
//   !spaceId.value &&
//   !docId.value &&
//   localState.value.localLatestSpace &&
//   localState.value.localLatestDocument
// ) {
//   router.push(
//     `/${localState.value.localLatestSpace}/${localState.value.localLatestDocument}/`
//   );
// } else if (!spaceId.value && localState.value.localLatestSpace) {
//   router.push(`/${localState.value.localLatestSpace}/`);
// }

interface space {
  id: string;
  title: string;
  url: string;
  token: string;
}

const localSpaces = useStorage("local-lity-spaces", {
  spaces: [],
});

export const useSpaces = () => {
  const { uuid, stringToSlug } = useUtility();
  const router = useRouter();
  const route = useRoute();

  const isRedirected = ref(false);
  const spaceId = computed(() => route.params.space);
  const spaceUrl = computed(() =>
    route.params.space && getSpace(route.params.space)
      ? getSpace(route.params.space).url
      : ""
  );
  const spaceToken = computed(() =>
    route.params.space && getSpace(route.params.space)
      ? getSpace(route.params.space).token
      : ""
  );

  const redirect = () => {
    // if (!route.params.space) {
    //   setSpace();
    // }
    // if (!route.params.document) {
    //   router.push(`/${route.params.space}/index`);
    // }
    // if (!route.params.node) {
    //   router.push(`/${route.params.space}/index/index`);
    // }
    createDefaultSpace();
    isRedirected.value = true;
  };

  const createSpace = (
    id?: string,
    name?: string,
    url?: string,
    token?: string
  ) => {
    const slug = name ? stringToSlug(name) : uuid();
    const blankSpace = {
      id: id || slug,
      name: name || "LocalStorage",
      url: url || null,
      token: token || null,
      index: route.params.document || uuid(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localSpaces.value.spaces.push(blankSpace);
  };

  const doesSpaceExist = (name: string) => {
    if (name) return false; // todo
  };

  const getSpace = (id: string) => {
    for (let i = 0; i < localSpaces.value.spaces.length; i++) {
      if (localSpaces.value.spaces[i].id === id)
        return localSpaces.value.spaces[i];
    }
    return null;
  };

  const getDefaultSpace = () => {
    return localSpaces.value.spaces[0];
  };

  const createDefaultSpace = () => {
    if (localSpaces.value.spaces.length === 0) {
      resetSpaces();
    } else {
      // todo: bugs!!
      if (route.params.space) {
        if (!getSpace(route.params.space)) {
          createSpace(route.params.space, "Shared Space", null, null);
        }
      }
      if (!route.params.space) {
        setSpaceIndex(getDefaultSpace());
      }
      if (route.params.space && !route.params.document) {
        setSpaceIndex(getSpace(route.params.space));
      }
    }
  };

  const resetSpaces = () => {
    localSpaces.value.spaces = [];
    createSpace();
    createSpace(
      "causa-lity-cc",
      "Lity.CC",
      "wss://causa.lity.cc",
      "A54F-G454-47CA-FHRD"
    );
    createSpace(
      "local",
      "LocalHost",
      "ws://localhost:3000",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ3NTU4Mjg2LCJleHAiOjE2NDc1NjE4ODZ9.wILTR5R7zD-FZrV3-d9FzJnH9q__chNxC_glxaacRhc"
    );
    if (!route.params.space) {
      setSpaceIndex(getDefaultSpace());
    } else {
      if (!getSpace(route.params.space)) {
        createSpace(route.params.space, "Shared Space", null, null);
      }
    }
  };

  const setSpace = (spaceId) => {
    router.push(`/${spaceId}`);
  };

  const setIndex = (spaceId, docId) => {
    if (spaceId && docId) {
      for (let i = 0; i < localSpaces.value.spaces.length; i++) {
        if (localSpaces.value.spaces[i].id === spaceId)
          localSpaces.value.spaces[i].index = docId;
      }
    }
  };

  const setSpaceIndex = (space) => {
    router.push(`/${space.id}/${space.index}/index`);
  };

  const setGravity = (id?: string) => {
    const document = id || uuid();
    router.push(`/${route.params.space}/${document}/index`);
  };

  return {
    localSpaces,
    resetSpaces,
    redirect,
    isRedirected,
    spaceId,
    spaceUrl,
    spaceToken,
    setIndex,
    getSpace,
    createSpace,
    setGravity,
    createDefaultSpace,
  };
};
