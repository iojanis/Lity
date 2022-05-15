<template>
  <div class="h-screen w-screen">
    <SplitPane :layout="layout">
      <template #left>
        <div
          class="flex cursor-default select-none w-full flex-row bg-zinc-100 p-1 pb-0.5 pl-16 text-md dark:bg-zinc-900 dark:text-white" data-tauri-drag-region
        >
<!--          <span data-tauri-drag-region>-->
<!--            <h1 data-tauri-drag-region class="ml-1">uti<strong data-tauri-drag-region>Lity</strong> Alpha</h1>-->
<!--          </span>-->
          <span
            v-tippy="{ content: 'Hide Sidebar', placement: 'bottom' }"
            :class="['ml-auto']"
          >
            <button
              type="button"
              class="inline-flex items-center rounded-sm border border-transparent py-0.5 px-0.5 text-base text-zinc-800 hover:bg-zinc-200 focus:bg-zinc-300 focus:outline-none active:bg-zinc-300 dark:text-zinc-100"
              @click.stop=""
            >
              <ChevronDoubleLeftIcon
                style="height: 18px; width: 18px"
                aria-hidden="true"
              />
            </button>
          </span>
        </div>
        <div class="h-full w-full bg-zinc-100 dark:bg-zinc-900">
          <nav class="" aria-label="Sidebar">
            <a
              ref="SelectorRef"
              href="#"
              :class="[
                ' group flex items-center px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 hover:text-zinc-900 active:bg-zinc-300 dark:text-zinc-100',
              ]"
            >
              <span class="group inline-flex truncate py-1">
                <div
                  class="mx-auto ml-0.5 mr-2 flex h-5 w-5 transform items-center justify-center rounded-full bg-blue-500 shadow-md transition transition-all duration-500 ease-in-out hover:shadow-lg"
                >
                  <div
                    class="flex h-4 w-4 scale-75 transform items-center justify-center rounded-full bg-black transition transition-all duration-500 ease-in-out group-hover:scale-90 dark:bg-white"
                  />
                </div>
                <span class="font-bold">Workspace</span>
                <SelectorIcon
                  class="ml-1"
                  style="margin-top: 1px; height: 18px; width: 18px"
                />
              </span>
            </a>
            <a
              v-for="item in actions"
              :key="item.name"
              v-tippy="{ content: item.name, placement: 'right' }"
              :href="item.href"
              :class="[
                item.current
                  ? 'bg-zinc-200 text-zinc-800 dark:text-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-100',
                'group flex items-center px-3 text-sm font-medium active:bg-zinc-300',
              ]"
              :aria-current="item.current ? 'page' : undefined"
            >
              <span class="inline-flex truncate py-1">
                <Component
                  :is="item.icon"
                  class="mx-1 mr-2"
                  style="margin-top: 1px; height: 18px; width: 18px"
                />
                {{ item.name }}
              </span>
            </a>
          </nav>
          <nav ref="FinderRef" class="no-drag mt-3" aria-label="Sidebar">
            <div v-for="item in navigation" :key="item.name">
              <DragDropItem
                draggable="true"
                :item="item"
                @open-menu="openMenu($event)"
                @toggle-content="item.open = !item.open"
              />
              <Drop>
                <div
                  v-if="item.open"
                  :href="item.href"
                  :class="[
                    item.current
                      ? 'bg-zinc-200 text-zinc-400 dark:text-zinc-50 '
                      : 'text-zinc-400 dark:text-zinc-50 ',
                    'group flex-row items-center text-sm font-medium ',
                  ]"
                  :aria-current="item.current ? 'page' : undefined"
                >
                  <!--                    <span class="py-1 pl-5 inline-flex truncate">-->
                  <!--                      No pages inside-->
                  <!--                    </span>-->
                  <div
                    v-for="item in navigation2"
                    :key="item.name"
                    class="truncate"
                  >
                    <DragDropItem
                      class="px-3 pl-6"
                      draggable="true"
                      :item="item"
                      @open-menu="openMenu($event)"
                      @toggle-content="item.open = !item.open"
                    />
                    <Drop>
                      <span
                        v-if="item.open"
                        :href="item.href"
                        :class="[
                          item.current
                            ? 'bg-zinc-200 text-zinc-400 dark:text-zinc-200 '
                            : 'text-zinc-400 dark:text-zinc-200 ',
                          'group flex items-center px-3 pl-6 text-sm font-medium ',
                        ]"
                        :aria-current="item.current ? 'page' : undefined"
                      >
                        <span class="inline-flex truncate py-1 pl-5">
                          No pages inside
                        </span>
                      </span>
                    </Drop>
                  </div>
                </div>
              </Drop>
            </div>
          </nav>
        </div>
      </template>
      <template #right>
        <div class="h-full w-full dark:bg-zinc-800">
          <div class="w-full p-[0px] pl-2 pr-2 dark:bg-zinc-800" data-tauri-drag-region >
            <header class="drag" data-tauri-drag-region>
              <nav class="mx-auto" aria-label="Top" data-tauri-drag-region>
                <div class="flex w-full items-center justify-between" data-tauri-drag-region>
                  <div class="flex items-center" data-tauri-drag-region>
                    <nav class="flex" aria-label="Breadcrumb" data-tauri-drag-region>
                      <ol role="list" class="flex items-center space-x-1">
                        <li
                          v-tippy="{ content: 'Go Back', placement: 'bottom' }"
                        >
                          <button
                            type="button"
                            class="mt-1 inline-flex items-center rounded-sm border border-transparent py-0.5 px-0.5 text-base text-zinc-800 shadow-sm hover:bg-zinc-200 focus:bg-zinc-300 focus:outline-none active:bg-zinc-300 dark:text-zinc-100"
                          >
                            <ArrowLeftIcon
                              style="height: 18px; width: 18px"
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                        <li v-for="page in pages" :key="page.name">
                          <div class="flex items-center">
                            <svg
                              class="h-5 w-5 flex-shrink-0 text-zinc-300"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"
                              />
                            </svg>
                            <button
                              type="button"
                              class="inline-flex items-center rounded-sm border border-transparent py-0.5 px-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-200 focus:bg-zinc-300 focus:outline-none active:bg-zinc-300 dark:text-zinc-100"
                            >
                              {{ page.name }}
                            </button>
                          </div>
                        </li>
                      </ol>
                    </nav>
                  </div>
                  <div class="ml-10 space-x-4">
                    <nav class="flex" aria-label="Breadcrumb">
                      <ol role="list" class="flex items-center space-x-1">
                        <li
                          v-tippy="{
                            content: 'Toggle Gravity',
                            placement: 'bottom',
                          }"
                        >
                          <button
                            type="button"
                            class="mt-1 inline-flex items-center rounded-sm border border-transparent py-0.5 px-0.5 text-base text-zinc-800 shadow-sm hover:bg-zinc-200 focus:bg-zinc-300 focus:outline-none active:bg-zinc-300 dark:text-zinc-100"
                          >
                            <ShareIcon
                              style="height: 18px; width: 18px"
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                        <li
                          v-tippy="{
                            content: 'Page Options',
                            placement: 'bottom',
                          }"
                        >
                          <button
                            type="button"
                            class="mt-1 inline-flex items-center rounded-sm border border-transparent py-0.5 px-0.5 text-base text-zinc-800 shadow-sm hover:bg-zinc-200 focus:bg-zinc-300 focus:outline-none active:bg-zinc-300 dark:text-zinc-100"
                          >
                            <DotsHorizontalIcon
                              style="height: 18px; width: 18px"
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </nav>
            </header>
          </div>
        </div>
      </template>
    </SplitPane>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SplitPane from "@/components/ui/SplitPane.vue";
import DragDropItem from "@/components/ui/DragDropItem.vue";
import { Drag, Drop } from "@/components/ui/drag-drop/index.js";

import {
  ArrowLeftIcon,
  ChevronDoubleLeftIcon,
  ClockIcon,
  CogIcon,
  DotsHorizontalIcon,
  SearchIcon,
  SelectorIcon,
  ShareIcon,
} from "@heroicons/vue/solid";
import AppProvider from "@/components/AppProvider.vue";

const layout = ref();

const actions = [
  { name: "Quick Look", icon: SearchIcon, current: false, count: "5" },
  { name: "All Updates", icon: ClockIcon, current: false },
  { name: "Manage Space", icon: CogIcon, current: false, count: "19" },
];

const navigation = ref([
  { name: "🥘 Recepies", href: "#", open: true },
  { name: "🫑 Vegetables", href: "#", open: false },
  { name: "🌶 Spices", href: "#", open: false },
  { name: "🌱 Garden", href: "#", open: false },
  { name: "💡 Drafts", href: "#", open: false },
  { name: "🌍 Public", href: "#", open: false },
]);

const navigation2 = ref([
  { name: "🍔 Burgers", href: "#", open: false },
  { name: "🌭 Hot D0gs", href: "#", open: false },
  { name: "🥗 Ceasar's Salad", href: "#", open: false },
  { name: "🥙 Taco", href: "#", open: false },
  { name: "🍱 Sushi", href: "#", open: true },
  { name: "🥘 Goulash", href: "#", open: false },
]);

const pages = [
  { name: "🥘 Recepies", href: "#", current: false },
  { name: "🥗 Ceasar's Salad", href: "#", current: true },
];
</script>


