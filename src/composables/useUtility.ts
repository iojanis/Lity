import { computed, watch } from "vue";

// const route = useRoute();
// const router = useRouter();

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

const isMac = () => {
  return navigator.userAgent.indexOf("Mac OS X") !== -1;
};

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const truncate = (str, n) =>
  str.length > n ? str.substr(0, n - 1) + "..." : str;

const hasNotch = () => {
  let proceed = false;
  const div = document.createElement("div");
  if (CSS.supports("padding-bottom: env(safe-area-inset-bottom)")) {
    div.style.paddingBottom = "env(safe-area-inset-bottom)";
    proceed = true;
  } else if (CSS.supports("padding-bottom: constant(safe-area-inset-bottom)")) {
    div.style.paddingBottom = "constant(safe-area-inset-bottom)";
    proceed = true;
  }
  if (proceed) {
    document.body.appendChild(div);
    const calculatedPadding = parseInt(
      window.getComputedStyle(div).paddingBottom
    );
    document.body.removeChild(div);
    if (calculatedPadding > 0) {
      return true;
    }
  }
  return false;
};

function osKey(evt: any) {
  if (isMac()) return evt.metaKey;
  return evt.ctrlKey;
}

function osKeySymbol() {
  if (isMac()) return "⌘";
  return "CTRL";
}

const uuid = () =>
  "xxx-xxx-xxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const getRandomElement = (list: any) => {
  return list[Math.floor(Math.random() * list.length)];
};

const getRandomUser = () => {
  return getRandomElement([
    "Isaac Newton",
    "Friedrich Nietzsche",
    "Johann Wolfgang von Goethe",
    "Carl Jung",
    "Steve Jobs",
    "Ernesto Guevara",
    "Robert M. Pirsig",
    "Nikola Tesla",
    "Leonardo da Vinci",
    "Archimedes",
    "Johannes Gutenberg",
    "Galileo Galilei",
    "Albert Einstein",
    "Carl Benz",
    "Steve Wozniak",
    "Alfred Nobel",
    "Hedy Lamarr",
    "Ada Lovelace",
    "Stephanie Kwolek",
    "Grace Hopper",
    "Konrad Zuse",
  ]);
};

const getRandomColor = () => {
  return getRandomElement(getColors());
};

const getColors = () => {
  return [
    "#00a492",
    "#00b1ff",
    "#ffc711",
    "#F98181",
    "#b7f981",
    "#81eff9",
    "#8183f9",
    "#d181f9",
    "#f9ab81",
    "#f9e181",
  ];
};

const getPlainText = (obj: any) => {
  let plainText = "";
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      plainText += obj[i].text;
    }
  } else {
    plainText = obj;
  }

  return plainText;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const stringToSlug = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
};

const awarenessStatesToArray = (states: Map<number, Record<string, any>>) => {
  return Array.from(states.entries()).map(([key, value]) => {
    return {
      clientId: key,
      ...value.user,
    };
  });
};

const isDesktop = () => {

}

function updateDoc(yRootDocs, document, node) {
  let doclistitem = {};
  const remote = yRootDocs.getMap().get(document);
  if (remote) doclistitem = remote;
  doclistitem.title = node.title;
  doclistitem.count = 3;
  doclistitem.updatedAt = new Date().toISOString();
  if (!doclistitem.guid) doclistitem.guid = document;
  doclistitem.filled = true;
  if (!doclistitem.createdAt) doclistitem.createdAt = new Date().toISOString();
  yRootDocs.getMap().set(document, doclistitem);
}

export const useUtility = () => {
  return {
    isMac,
    isMobile,
    hasNotch,
    osKey,
    uuid,
    delay,
    getPlainText,
    getRandomElement,
    getRandomUser,
    getRandomColor,
    stringToSlug,
    updateDoc,
    truncate,
    awarenessStatesToArray,
    osKeySymbol,
    isDesktop
  };
};
