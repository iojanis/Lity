<template>
  <div
    class="-mt-1 select-none border border-gray-300 bg-gray-50 py-1 shadow-xl"
    style="border-radius: 4px; min-width: 15vw"
  >
    <div
      v-for="item in servers"
      :key="item.name"
    >
      <a
        href="#"
        :class="[
          item.current
            ? 'bg-gray-200 text-gray-800'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900',
          'group flex items-center px-3 text-sm font-medium active:bg-gray-300',
        ]"
        :aria-current="item.current ? 'page' : undefined"
        @click="item.open = !item.open"
      >
        <span class="inline-flex truncate py-1">
          <button
            type="button"
            class="mr-2 ml-0.5 inline-flex items-center rounded-sm border border-transparent text-base text-gray-500 hover:bg-gray-300 focus:bg-gray-400 focus:outline-none active:bg-gray-400"
            @click.stop="item.open = !item.open"
          >
            <ChevronRightIcon
              v-if="!item.open"
              style="height: 18px; width: 18px"
              aria-hidden="true"
            />
            <ChevronDownIcon
              v-else
              style="height: 18px; width: 18px"
              aria-hidden="true"
            />
          </button>
          {{ item.name }}
        </span>
        <span
          v-tippy="{ content: 'Server Options', placement: 'right' }"
          :class="['ml-auto hidden group-hover:block']"
        >
          <button
            type="button"
            class="mt-1 inline-flex items-center rounded-sm border border-transparent text-base text-gray-800 hover:bg-gray-300 focus:bg-gray-400 focus:outline-none active:bg-gray-400"
            @click.stop=""
          >
            <DotsHorizontalIcon
              style="height: 18px; width: 18px"
              aria-hidden="true"
            />
          </button>
        </span>
      </a>
      <span
        v-if="item.open"
        :href="item.href"
        :class="[
          item.current ? 'bg-gray-200 text-gray-400' : 'text-gray-400  ',
          'group flex items-center px-3 pl-6 text-sm font-medium ',
        ]"
        :aria-current="item.current ? 'page' : undefined"
      >
        <span class="inline-flex truncate py-1 pl-5"> No spaces inside </span>
      </span>
    </div>
    <div
      style="height: 1px"
      class="my-1 bg-gray-100"
    />
    <a
      v-for="item in actions"
      :key="item.name"
      v-tippy="{ content: item.name, placement: 'right' }"
      href="#"
      :href="item.href"
      :class="[
        item.current
          ? 'bg-gray-200 text-gray-800'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900',
        'group flex items-center px-3 text-sm font-medium active:bg-gray-300',
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
  </div>
</template>

<script setup lang="ts">
import {
  StatusOnlineIcon,
  TrashIcon,
  StarIcon,
  DuplicateIcon,
  ClipboardCopyIcon,
  PencilIcon,
  ServerIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  SearchIcon,
  ClockIcon,
  CogIcon,
  PlusIcon,
} from '@heroicons/vue/solid';
import events from 'events';
import { ref } from 'vue';

const servers = ref([
  { name: 'Client.CC', open: false, icon: ServerIcon, count: '5' },
  { name: 'Jun.is', open: false, icon: ServerIcon },
]);
const navigation = [
  { name: 'Delete', href: '#', icon: TrashIcon, count: '5' },
  { name: 'Add to Favorites', href: '#', icon: StarIcon },
  { name: 'Duplicate', href: '#', icon: DuplicateIcon, count: '19' },
  { name: 'Copy Link', href: '#', icon: ClipboardCopyIcon, count: '20+' },
  { name: 'Rename', href: '#', icon: PencilIcon },
];
const actions = [
  {
    name: 'Add a remote server',
    icon: PlusIcon,
    current: false,
    count: '5',
  },
];
</script>

<style>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
