<template>
  <TransitionRoot :show="state.isProviderOpen" as="template">
    <Dialog as="div" @close="toggleProvider">
      <div
        class="
          fixed
          dark:bg-zinc-900
          bg-white bg-opacity-50
          dark:bg-opacity-50
          inset-0
          z-50
          overflow-y-auto
        "
      >
        <div class="text-center">
          <TransitionChild
            as="template"
            enter="duration-75 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-50"
            leave="duration-75 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0" />
          </TransitionChild>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <TransitionChild
            as="template"
            enter="ease-out duration-75"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-75"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              class="
                inline-block
                align-bottom
                bg-white
                dark:text-white dark:bg-black/50
                rounded-lg
                mt-2
                px-4
                pt-5
                pb-4
                text-left
                overflow-hidden
                shadow-xl
                transform
                transition-all
                m-3
                sm:align-middle sm:max-w-md sm:w-full sm:p-6
              "
              :class="{
                'bg-opacity-50 dark:bg-black/50 backdrop-filter backdrop-blur-lg':
                  state.blurredInterface,
                'mt-32': hasNotch(),
              }"
            >
              <div>
                <div class="">
                  <span
                    v-if="true"
                    class="relative z-0 w-full mb-4 inline-flex justify-between"
                  >
                    <form class="w-full" @submit.prevent="">
                      <input
                        ref="inputProviderRef"
                        @keydown.up.prevent="upHandler"
                        @keydown.down.prevent="downHandler"
                        @keydown.left="leftHandler"
                        @keydown.right="rightHandler"
                        @keydown.enter.prevent="enterHandler"
                        v-model="searchContent"
                        placeholder="Search for Spaces"
                        autocomplete="off"
                        autocapitalize="off"
                        spellcheck="false"
                        autofocus
                        tabindex="0"
                        type="text"
                        name="search"
                        class="
                          border-0
                          h-8
                          bg-white
                          dark:bg-zinc-800 dark:text-white
                          bg-opacity-50
                          dark:bg-opacity-50
                          focus:ring-2 focus:ring-gray-600
                          text-lg
                          shadow-lg
                          bg-opacity-100
                          block
                          w-full
                          pl-3
                          py-5
                          pr-12
                          rounded-lg
                          bg-opacity-50
                          dark:bg-opacity-50
                        "
                      />
                      <div
                        class="absolute inset-y-0 right-0 flex py-0.5 pr-1.5"
                      >
                        <button
                          type="button"
                          class="
                            -ml-px
                            p-1
                            pr-0
                            relative
                            inline-flex
                            items-center
                            text-sm
                            font-medium
                            text-zinc-600
                            dark:text-zinc-200
                            hover:opacity-50
                            rounded-md
                            focus:z-10
                          "
                          @click="toggleOnly('selector')"
                        >
                          <i class="ri-arrow-left-circle-fill text-2xl" />
                        </button>
                        <button
                          type="button"
                          class="
                            -ml-px
                            p-1
                            relative
                            inline-flex
                            items-center
                            text-sm
                            font-medium
                            text-zinc-600
                            dark:text-zinc-200
                            hover:opacity-50
                            rounded-md
                            focus:z-10
                          "
                          @click="toggleProvider"
                        >
                          <i class="ri-close-circle-fill text-2xl" />
                        </button>
                      </div>
                    </form>
                  </span>
                  <!--                  <div class="pb-2">-->
                  <!--                    <SwitchGroup as="div" class="flex justify-between">-->
                  <!--                      <SwitchLabel as="span" class="">-->
                  <!--                        <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Synchronize</span>-->
                  <!--                      </SwitchLabel>-->
                  <!--                      <Switch v-model="state.useHocuspocus" :class="[state.useHocuspocus ? 'bg-green-600' : 'bg-zinc-200 dark:bg-zinc-800', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500']">-->
                  <!--                        <span aria-hidden="true" :class="[state.useHocuspocus ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']" />-->
                  <!--                      </Switch>-->
                  <!--                    </SwitchGroup>-->
                  <!--                  </div>-->
                  <div v-if="true" class="mt-2">
                    <div>
                      <div class="space-y-2">
                        <div
                          @click="selectItem(space.id)"
                          as="template"
                          v-for="(space, i) in searchDocs"
                          :key="space.id"
                        >
                          <div
                            class="border-transparent
                        dark:text-white dark:bg-zinc-900
                        bg-opacity-50
                        dark:bg-opacity-50
"
                            :class="[
                              i !== selectedIndex
                                ? ' '
                                : ' ring-3 ring-gray-600 bg-gray-300 dark:bg-gray-600 ',
                              space.id === route.params.space
                                ? ' ring-2 ring-gray-600 bg-gray-300 dark:bg-gray-700'
                                : ' dark:bg-opacity-50 bg-opacity-50 hover:bg-opacity-30 hover:bg-zinc-100 hover:bg-opacity-50 dark:hover:bg-zinc-800 dark:hover:bg-opacity-50',
                              'relative block border rounded-lg shadow-sm px-6 py-4 cursor-pointer sm:flex sm:justify-between focus:outline-none',
                            ]"
                          >
                            <div
                              class="
                                flex
                                dark:text-white
                                text-black
                                items-center
                              "
                            >
                              <div class="text-sm">
                                <div
                                  as="p"
                                  class="
                                    font-medium
                                    text-zinc-900
                                    dark:text-zinc-100
                                  "
                                >
                                  {{ space.name }}
                                </div>
                                <div
                                  as="div"
                                  class="
                                    text-zinc-900
                                    dark:text-zinc-100"
                                >
                                  <p class="sm:inline">
                                    {{ space.url ? space.url : 'LocalStorage' }} / {{ space.id }}
                                  </p>
                                </div>

                                <div class="" v-if="space.id === route.params.space">
                                  <div class="my-2 w-full">
                                    <label
                                      for="company-website"
                                      class="
                                        block
                                        text-sm
                                        font-medium
                                        text-zinc-700
                                        dark:text-zinc-200
                                      "
                                      >Server Address</label
                                    >
                                    <div
                                      class="mt-1 relative rounded-md shadow-sm"
                                    >
                                      <input
                                        v-model="space.url"
                                        tabindex="0"
                                        type="text"
                                        @click.prevent
                                        name="lity-server"
                                        class="
                                          h-8
                                          bg-white
                                          border-0
                                          dark:bg-white dark:text-white
                                          bg-opacity-50
                                          dark:bg-opacity-5
                                          focus:ring-2 focus:ring-gray-600
                                          text-lg
                                          shadow-lg
                                          bg-opacity-1
                                          block
                                          w-full
                                          pl-3
                                          py-5
                                          rounded-lg
                                        "
                                        placeholder="wss://causa.lity.cc"
                                      />
                                    </div>
                                  </div>

                                  <div class="my-1">
                                    <label
                                      for="company-website"
                                      class="
                                        block
                                        text-sm
                                        font-medium
                                        text-zinc-700
                                        dark:text-zinc-200
                                      "
                                      >Access Code</label
                                    >
                                    <div
                                      class="mt-1 relative rounded-md shadow-sm"
                                    >
                                      <!--                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">-->
                                      <!--                          <span class="text-zinc-500 sm:text-sm">-->
                                      <!--                            #-->
                                      <!--                          </span>-->
                                      <!--                        </div>-->
                                      <input
                                        v-model="space.token"
                                        type="text"
                                        name="lity-server"
                                        @click.prevent
                                        class="
                                          h-8
                                          bg-white
                                          border-0
                                          dark:bg-white dark:text-white
                                          bg-opacity-50
                                          dark:bg-opacity-5
                                          focus:ring-2 focus:ring-gray-600
                                          text-lg
                                          shadow-lg
                                          bg-opacity-1
                                          block
                                          w-full
                                          pl-3
                                          py-5
                                          rounded-lg
                                        "
                                        placeholder="xxxx-xxxx-xxxx-xxxx"
                                      />
                                    </div>
                                  </div>
                                  <p>
                                    Leave empty if you want this space to remain
                                    offline.
                                  </p>

                                  <button
                                    v-if="space.id !== route.params.space"
                                    type="button"
                                    class="
                                      mt-2
                                      rounded-lg
                                      p-3
                                      shadow-xl
                                      bg-gray-700
                                      text-white
                                      bg-opacity-50
                                    "
                                  >
                                    Set as current Space
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div
                              as="div"
                              class="
                                mt-2
                                flex
                                text-sm
                                sm:mt-0 sm:block sm:ml-4 sm:text-right
                              "
                            >
<!--                              <div-->
<!--                                class="-->
<!--                                  font-medium-->
<!--                                  text-zinc-900-->
<!--                                  dark:text-zinc-300-->
<!--                                "-->
<!--                              >-->
<!--                                <button @click.prevent="editItem(space.id)" class="p-3 hover:bg-zinc-100 hover:bg-opacity-5 rounded-md w-16" type="button"><i class="ri-settings-3-fill text-2xl" /><i class="ri-arrow-right-s-line text-2xl" /></button>-->
<!--                              </div>-->
                            </div>
                            <div
                              :class="[
                                space.id === route.params.space
                                  ? ''
                                  : '',
                                i === selectedIndex
                                  ? ''
                                  : 'border-opacity-50',
                                'absolute -inset-px rounded-lg pointer-events-none',
                              ]"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p
                    v-if="false"
                    class="text-sm text-zinc-500 dark:text-zinc-200 my-2"
                  >
                    Find out more about private servers
                    <a
                      class="underline"
                      target="_blank"
                      href="https://lity.cc/server"
                      >here</a
                    >. Host your own!
                  </p>

                  <div
                    v-if="true"
                    @click="resetSpaces()"
                    class="
                      cursor-pointer
                      text-xs
                      font-sans font-bold
                      m-3
                      text-zinc-500
                      uppercase
                      text-center
                      tracking-wider
                      underline
                    "
                  >
                    reset defaults
                  </div>
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
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
} from "@headlessui/vue";
import { useDark, useToggle, useTimeAgo, useStorage } from "@vueuse/core";
import { UseTimeAgo } from "@vueuse/components";
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import * as Y from "yjs";
import { useRoute, useRouter } from "vue-router";
import { useSettings } from "../composables/useSettings";
import { useSpaces } from "../composables/useSpaces";
import { useUtility } from "../composables/useUtility";

const route = useRoute();
const router = useRouter();
const { state, toggleInfo, toggleProvider, toggleSelector, toggleOnly } =
  useSettings();
const { localSpaces, resetSpaces, getSpace } = useSpaces();
const { hasNotch } = useUtility();

const emit = defineEmits(["change"]);

const newColor = ref();
const enabled = ref();

// onMounted(()=> {
//   newColor.value = localState.value.localUserColor
// })

const selected = ref();
const selectedIndex = ref(0);

selected.value = localSpaces.value.spaces[0];

const searchContent = ref("");

const searchOpen = computed(()=>state.value.isProviderOpen)



const searchDocs = computed(() => {
  if (localSpaces.value.spaces)
    return localSpaces.value.spaces
      .filter((item: any) => {
        return (item.name)
          .toLowerCase()
          .includes(searchContent.value.toLowerCase());
      }).slice(0, 10)
      .sort((a, b) =>
        (a.name) > (b.name)
          ? 1
          : (b.name) > (a.name)
            ? -1
            : 0
      );

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
  editItem(searchDocs.value[selectedIndex.value].id)
};

const leftHandler = () => {
  toggleOnly('selector')
};

const enterHandler = () => {
  selectItem(searchDocs.value[selectedIndex.value].id);
};

const inputProviderRef = ref()

const selectInput = ( )=> {
  if (searchOpen.value) {
    inputProviderRef.value.focus()
  }
}

const keys = (evt) => {
  selectInput()
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
