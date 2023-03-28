<template>
  <div
    style="max-width: 20.5em"
    class="hs top-pane follower-bar absolute left-0 right-0 z-20 ml-auto mr-auto overflow-y-scroll rounded-lg ring-1 ring-black ring-opacity-5 transition transition-all duration-500 ease-in-out bg-white dark:bg-black"
    :class="{
      'bg-opacity-50 backdrop-blur backdrop-filter bg-white/50 dark:bg-black/50':
        state.blurredInterface,
      blur2: isDark,
    }"
  >
    <div
      class="hs relative z-0 flex flex-col flex-nowrap items-center rounded-t-md rounded-b-md"
      style="width: 20.5em"
    >
      <span class="hs inline-flex">
        <input id="input" class="hidden" type="text" />
        <button
          class="tooltip relative -ml-px inline-flex items-center pl-2 pr-0.5 text-sm font-medium text-black opacity-70 hover:opacity-100 focus:z-10 focus:outline-none dark:text-white"
          type="button"
          @click="toggleSelector"
          v-tippy="{
            content: 'Documents <kbd>' + osKeySymbol() + ' + P</kbd>',
            placement: 'bottom',
          }"
        >
          <i class="ri-focus-2-fill text-2xl" />
        </button>

        <span
          class="my-2 ml-1 mr-1 bg-gray-100 dark:bg-gray-700"
          style="width: 1px"
        />
        <!--                <button-->
        <!--                  type="button"-->
        <!--                  class="tooltip -ml-px p-1 relative inline-flex items-center text-sm font-medium text-black dark:text-white opacity-70  hover:opacity-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600"-->
        <!--                  @click="newDocUrl"-->
        <!--                >-->
        <!--                  <span-->
        <!--                    class="tooltiptext bg-white rounded-xl shadow-xl blur text-black"-->
        <!--                  >New Document</span>-->
        <!--                  <DocumentIcon class="h-6 w-6" />-->
        <!--                </button>-->
        <!--                <button-->
        <!--                  type="button"-->
        <!--                  class="-ml-px p-1 relative inline-flex items-center text-sm font-medium text-black dark:text-white opacity-70  hover:opacity-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600"-->
        <!--                >-->
        <!--                  <DocumentDownloadIcon class="h-6 w-6" />-->
        <!--                </button>-->
        <!--                <button-->
        <!--                  type="button"-->
        <!--                  class="-ml-px p-1 relative inline-flex items-center text-sm font-medium text-black dark:text-white opacity-70  hover:opacity-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600"-->
        <!--                >-->
        <!--                  <FolderOpenIcon class="h-6 w-6" />-->
        <!--                </button>-->

        <!--                <span-->
        <!--                  class="inline-flex relative mt-1 -ml-px p-1 items-center justify-center h-6 w-6 rounded-full bg-gray-500 mr-1"-->
        <!--                >-->
        <!--                  <span class="text-xs font-medium leading-none text-white overflow-hidden">-->
        <!--                    {{ users?.length }}-->
        <!--                  </span>-->
        <!--                </span>-->
        <!--                <button-->
        <!--                  type="button"-->
        <!--                  class="-ml-px p-1 relative inline-flex items-center text-sm font-medium text-black dark:text-white opacity-70  hover:opacity-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600"-->
        <!--                >-->
        <!--                  <UsersIcon class="h-6 w-6" />-->
        <!--                </button>-->
<!--        <button-->
<!--          class="tooltip relative -ml-px inline-flex items-center p-1 text-sm font-medium text-black opacity-70 hover:opacity-100 focus:z-10 focus:outline-none dark:text-white"-->
<!--          type="button"-->
<!--          v-tippy="{-->
<!--            content: 'Refresh Graph <kbd>' + osKeySymbol() + ' + R</kbd>',-->
<!--            placement: 'bottom',-->
<!--          }"-->
<!--          @click="emit('refreshGraph')"-->
<!--        >-->
<!--          <i class="ri-refresh-line text-2xl" />-->
<!--        </button>-->


                <button
                    type="button"
                    class="
                    tooltip
                    p-1
                    relative
                    inline-flex
                    items-center
                    text-sm
                    font-medium
                    text-black
                    dark:text-white
                    opacity-70
                    hover:opacity-100
                    focus:z-10 focus:outline-none
                  "
                    @click="toggleSearch"
                    v-tippy="{ content: 'Search <kbd>'+osKeySymbol()+' + F</kbd>', placement: 'bottom' }"
                >
                  <i class="ri-search-line text-2xl" />
                </button>
        <span
          class="my-2 ml-1 mr-1 bg-gray-100 dark:bg-gray-700"
          style="width: 1px"
        />
        <button
          :class="{
            'text-black': !props.linkingNodes,
            'animate-pulse text-blue-500 dark:text-blue-500':
              props.linkingNodes,
          }"
          class="tooltip relative -ml-px inline-flex items-center p-1 text-sm font-medium opacity-70 hover:opacity-100 focus:z-10 focus:outline-none dark:text-white"
          type="button"
          v-tippy="{
            content: props.linkingNodes
              ? 'Select Node(s) to Link them'
              : 'Link Nodes <kbd>'+osKeySymbol()+' + J</kbd>',
            placement: 'bottom',
          }"
          @click="emit('linkNodes')"
        >
          <i :class="{'animate-pulse text-blue-500 dark:text-blue-500': props.linkingNodes,}" class="ri-share-fill text-inherit text-2xl" />
        </button>
        <button
          class="tooltip relative -ml-px inline-flex items-center p-1 text-sm font-medium text-black opacity-70 hover:opacity-100 focus:z-10 focus:outline-none dark:text-white"
          type="button"
          v-tippy="{ content: 'Create new Node <kbd>'+osKeySymbol()+' + K</kbd>', placement: 'bottom' }"
          @click="emit('createNode')"
        >
          <i class="ri-add-circle-fill text-2xl" />
        </button>
        <span
          class="my-2 ml-1 mr-1 bg-gray-100 dark:bg-gray-700"
          style="width: 1px"
        />
        <button
          :class="{
            'text-black': !props.deletingNodes,
            'animate-pulse text-red-500 dark:text-red-500': props.deletingNodes,
          }"
          class="tooltip relative -ml-px inline-flex items-center p-1 text-sm font-medium opacity-70 hover:opacity-100 focus:z-10 focus:outline-none dark:text-white"
          type="button"
          v-tippy="{ content: 'Delete  <kbd>'+osKeySymbol()+' + Backspace</kbd>', placement: 'bottom' }"
          @click="emit('deleteNode')"
        >
          <i :class="{'animate-pulse text-red-500 dark:text-red-500': props.deletingNodes,}" class="ri-delete-bin-fill text-2xl" />
        </button>
        <button
          :class="{
            'text-black': !props.unlinkingNodes,
            'animate-pulse text-yellow-500 dark:text-yellow-500':
              props.unlinkingNodes,
          }"
          class="tooltip relative -ml-px inline-flex items-center p-1 text-sm font-medium opacity-70 hover:opacity-100 focus:z-10 focus:outline-none dark:text-white"
          type="button"
          v-tippy="{ content: 'Unlink Nodes  <kbd>'+osKeySymbol()+' + L</kbd>', placement: 'bottom' }"
          @click="emit('unlinkNodes')"
        >
          <i  :class="{'animate-pulse text-yellow-500 dark:text-yellow-500': props.unlinkingNodes,}" class="ri-scissors-fill text-2xl" />
        </button>

        <span
          class="my-2 ml-1 mr-1 bg-gray-100 dark:bg-gray-700"
          style="width: 1px"
        />
        <button
          class="tooltip relative -ml-px inline-flex items-center p-0.5 text-sm font-medium opacity-70 hover:opacity-100 focus:z-10 focus:outline-none dark:text-white"
          type="button"
          v-tippy="{ content: 'Undo Gravity Changes', placement: 'bottom' }"
          @click="emit('undo')"
        >
          <i class="ri-arrow-go-back-fill text-2xl" />
        </button>
        <button
          class="tooltip relative -ml-px inline-flex items-center p-0.5 text-sm font-medium opacity-70 hover:opacity-100 focus:z-10 focus:outline-none dark:text-white"
          type="button"
          v-tippy="{ content: 'Redo Gravity Changes', placement: 'bottom' }"
          @click="emit('redo')"
        >
          <i class="ri-arrow-go-forward-fill text-2xl" />
        </button>

        <span
          class="my-2 ml-1 mr-1 bg-gray-100 dark:bg-gray-700"
          style="width: 1px"
        />
        <button
          class="tooltip relative -ml-px inline-flex items-center p-1 pr-2 text-sm font-medium text-black opacity-70 hover:opacity-100 focus:z-10 focus:outline-none dark:text-white"
          type="button"
          v-tippy="{
            content: 'Show Settings <kbd>' + osKeySymbol() + ' + ,</kbd>',
            placement: 'bottom',
          }"
          @click="toggleSettings"
        >
          <i class="ri-settings-5-fill text-2xl" />
        </button>
        <!--        <button-->
        <!--          id="copy"-->
        <!--          type="button"-->
        <!--          :class="{ 'text-gray-300': !isShared, 'text-black dark:text-white opacity-70': isShared, 'opacity-70': (!isShared) }"-->
        <!--          class="tooltip -ml-px p-1 relative inline-flex items-center text-sm font-medium   hover:opacity-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600"-->
        <!--        >-->
        <!--          <span-->
        <!--            class="tooltiptext bg-white rounded-xl shadow-xl blur text-black"-->
        <!--          >Copy Link</span>-->
        <!--          <ClipboardCopyIcon class="h-6 w-6" />-->
        <!--        </button>-->
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";
import { useSettings } from "../composables/useSettings";
import { useUtility } from "@/composables/useUtility";

const isDark = useDark();
const toggleDark = useToggle(isDark);

const { osKeySymbol } = useUtility();

const { state, toggleInfo, toggleSettings, toggleSearch, toggleSelector } =
  useSettings();

const isOpen = () => state.value.isSearchOpen;

const props = defineProps<{
  unlinkingNodes: boolean;
  linkingNodes: boolean;
  deletingNodes: boolean;
}>();

const emit = defineEmits([
  "linkNodes",
  "unlinkNodes",
  "createNode",
  "deleteNode",
  "refreshGraph",
  "undo",
  "redo",
]);
</script>
