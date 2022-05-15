<template>
  <TransitionRoot
    :show="state.isSelectorOpen"
    as="template"
    @after-leave="rawQuery = ''"
  >
    <Dialog
      as="div"
      class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20"
      @close="toggleSelector"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-100"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogOverlay
          class="fixed inset-0 bg-white bg-opacity-50 transition-opacity"
        />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="ease-out duration-100"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="ease-in duration-100"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <Combobox
          as="div"
          class="mx-auto max-w-xl transform divide-y divide-black/5 overflow-hidden rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 transition-all"
          :class="{
            'bg-opacity-50 backdrop-blur-lg backdrop-filter dark:bg-lityblackblur':
              state.blurredInterface,
            'mt-32': hasNotch(),
          }"
          @update:modelValue="onSelect"
        >
          <div class="relative">
            <SearchIcon
              class="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <ComboboxInput
              class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Search..."
              @change="rawQuery = $event.target.value"
            />
          </div>

          <ComboboxOptions
            v-if="
              filteredProjects.length > 0 ||
              filteredUsers.length > 0 ||
              latestDocuments.length > 0
            "
            static
            class="max-h-80 scroll-py-10 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
          >
            <li v-if="filteredProjects.length > 0">
              <h2 class="text-xs font-semibold text-gray-900">Nodes</h2>
              <ul class="-mx-4 mt-2 text-sm text-gray-700">
                <ComboboxOption
                  v-for="project in filteredProjects"
                  :key="project.id"
                  :value="project"
                  as="template"
                  v-slot="{ active }"
                >
                  <li
                    :class="[
                      'mx-1 flex cursor-default select-none items-center rounded-md p-1',
                      active && 'bg-blue-600 bg-opacity-50 text-white',
                    ]"
                  >
                    <FolderIcon
                      :class="[
                        'h-6 w-6 flex-none',
                        active ? 'text-white' : 'text-gray-400',
                      ]"
                      aria-hidden="true"
                    />
                    <span class="ml-2 flex-auto truncate">{{
                      project.name
                    }}</span>
                  </li>
                </ComboboxOption>
              </ul>
            </li>
            <li v-if="filteredUsers.length > 0">
              <h2 class="text-xs font-semibold text-gray-900">Commands</h2>
              <ul class="-mx-4 mt-2 text-sm text-gray-700">
                <ComboboxOption
                  v-for="user in filteredUsers"
                  :key="user.id"
                  :value="user"
                  as="template"
                  v-slot="{ active }"
                >
                  <li
                    :class="[
                      'mx-1 flex cursor-default select-none items-center rounded-md p-1',
                      active && 'bg-blue-600 bg-opacity-50 text-white',
                    ]"
                  >
                    <img
                      :src="user.imageUrl"
                      alt=""
                      class="h-6 w-6 flex-none rounded-full"
                    />
                    <span class="ml-2 flex-auto truncate">{{ user.name }}</span>
                  </li>
                </ComboboxOption>
              </ul>
            </li>
            <li v-if="rawQuery === ''">
              <h2 class="text-xs font-semibold text-gray-900">Latest</h2>
              <ul class="-mx-4 mt-2 text-sm text-gray-700">
                <ComboboxOption
                  v-for="latest in latestDocuments"
                  :key="latest.id"
                  :value="latest"
                  as="template"
                  v-slot="{ active }"
                >
                  <li
                    :class="[
                      'mx-1 flex cursor-default select-none items-center rounded-md p-1',
                      active && 'bg-blue-600 bg-opacity-50 text-white',
                    ]"
                  >
                    <!--                    <img :src="latest.imageUrl" alt="" class="h-6 w-6 flex-none rounded-full" />-->
                    <span class="ml-2 flex-auto truncate">{{
                      latest.name
                    }}</span>
                  </li>
                </ComboboxOption>
              </ul>
            </li>
          </ComboboxOptions>

          <div
            v-if="rawQuery === '?'"
            class="py-14 px-6 text-center text-sm sm:px-14"
          >
            <SupportIcon
              class="mx-auto h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
            <p class="mt-4 font-semibold text-gray-900">Help with searching</p>
            <p class="mt-2 text-gray-500">
              Use this tool to quickly search for users and projects across our
              entire platform. You can also use the search modifiers found in
              the footer below to limit the results to just users or projects.
            </p>
          </div>

          <div
            v-if="
              query !== '' &&
              rawQuery !== '?' &&
              filteredProjects.length === 0 &&
              filteredUsers.length === 0
            "
            class="py-14 px-6 text-center text-sm sm:px-14"
          >
            <ExclamationIcon
              class="mx-auto h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
            <p class="mt-4 font-semibold text-gray-900">No results found</p>
            <p class="mt-2 text-gray-500">
              We couldn’t find anything with that term. Please try again.
            </p>
          </div>

          <div
            class="flex flex-wrap items-center py-2.5 px-4 text-xs text-gray-700"
          >
            <kbd
              :class="[
                'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                rawQuery.startsWith('@')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-gray-400 text-gray-900',
              ]"
              >@</kbd
            >
            <span class="sm:hidden">for projects,</span>
            <span class="hidden sm:inline">Nodes</span>
            <kbd
              :class="[
                'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                rawQuery.startsWith('/')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-gray-400 text-gray-900',
              ]"
              >/</kbd
            >
            Commands
            <kbd
              :class="[
                'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                rawQuery === '?'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-gray-400 text-gray-900',
              ]"
              >?</kbd
            >
            Help
          </div>
        </Combobox>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogTitle,
  DialogOverlay,
  Switch,
  SwitchGroup,
  SwitchLabel,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";
import { useDark, useToggle, useTimeAgo, useStorage } from "@vueuse/core";
import { UseTimeAgo } from "@vueuse/components";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import * as Y from "yjs";
import { useRoute, useRouter } from "vue-router";
import { useSettings } from "../composables/useSettings";
import { useSpaces } from "../composables/useSpaces";
import { useUtility } from "../composables/useUtility";

import { SearchIcon } from "@heroicons/vue/solid";
import {
  ExclamationIcon,
  FolderIcon,
  SupportIcon,
} from "@heroicons/vue/outline";

const route = useRoute();
const router = useRouter();
const { state, toggleInfo, toggleProvider, toggleSelector, toggleOnly } =
  useSettings();
const { localSpaces, resetSpaces, getSpace } = useSpaces();
const { hasNotch } = useUtility();

const emit = defineEmits(["change"]);

const projects = [
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  // More projects...
];

const latest = [
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  {
    id: 1,
    name: "Workflow Inc. / Website Redesign",
    category: "Projects",
    url: "#",
  },
  // More projects...
];

const users = [
  {
    id: 1,
    name: "Leslie Alexander",
    url: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 1,
    name: "Leslie Alexander",
    url: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 1,
    name: "Leslie Alexander",
    url: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 1,
    name: "Leslie Alexander",
    url: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More users...
];

const open = ref(true);
const rawQuery = ref("");
const query = computed(() => rawQuery.value.toLowerCase().replace(/^[#>]/, ""));
const filteredProjects = computed(() =>
  rawQuery.value === "@"
    ? projects
    : query.value === "" || rawQuery.value.startsWith("/")
    ? []
    : projects.filter((project) =>
        project.name.toLowerCase().includes(query.value)
      )
);
const filteredUsers = computed(() =>
  rawQuery.value === "/"
    ? users
    : query.value === "" || rawQuery.value.startsWith("@")
    ? []
    : users.filter((user) => user.name.toLowerCase().includes(query.value))
);
const latestDocuments = computed(() => latest);

const onSelect = (item: any) => {
  window.location = item.url;
};

const newColor = ref();
const enabled = ref();

// onMounted(()=> {
//   newColor.value = localState.value.localUserColor
// })

const selected = ref();
const selectedIndex = ref(0);

selected.value = localSpaces.value.spaces[0];

const searchContent = ref("");

const searchOpen = computed(() => state.value.isProviderOpen);

const searchDocs = computed(() => {
  if (localSpaces.value.spaces)
    return localSpaces.value.spaces
      .filter((item: any) => {
        return item.name
          .toLowerCase()
          .includes(searchContent.value.toLowerCase());
      })
      .slice(0, 10)
      .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

  return [];
});

watch(searchContent, () => {
  selectedIndex.value = 0;
});
watch(searchOpen, () => {
  if (searchOpen.value) {
    selectedIndex.value = 0;
  } else {
    searchContent.value = "";
  }
});

const selectItem = (id) => {
  if (id !== selected.value) {
    router.push(`/${id}/`);
    selected.value = id;
    toggleOnly("selector");
  }
};

const editItem = (id) => {
  if (id !== selected.value) {
    selected.value = id;
    toggleOnly("edit");
  }
};

const upHandler = () => {
  selectedIndex.value =
    (selectedIndex.value + searchDocs.value.length - 1) %
    searchDocs.value.length;
};

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % searchDocs.value.length;
};

const rightHandler = () => {
  editItem(searchDocs.value[selectedIndex.value].id);
};

const leftHandler = () => {
  toggleOnly("selector");
};

const enterHandler = () => {
  selectItem(searchDocs.value[selectedIndex.value].id);
};

const inputProviderRef = ref();

const selectInput = () => {
  if (searchOpen.value) {
    inputProviderRef.value.focus();
  }
};

const keys = (evt) => {
  selectInput();
};

onMounted(() => {
  document.addEventListener("keydown", keys);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", keys);
});

// const state = reactive({
//   localUserName: state.value.localUserName,
//   localUserId: state.value.localUserId,
//   localUserColor: state.value.localUserColor,
//   serverAddress: state.value.serverAddress,
//   serverToken: state.value.serverToken,
//   localLatestSpace: state.value.localLatestSpace,
//   localLatestDocument: state.value.localLatestDocument,
//   localLatestNode: state.value.localLatestNode,
// });
//
// defineExpose({ state: state });
</script>

<style scoped></style>
