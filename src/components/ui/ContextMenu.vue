<template>
  <div
    class="select-none border border-gray-300 bg-gray-50 shadow-xl"
    style="border-radius: 4px"
  >
    <nav
      class="w-full py-1"
      aria-label="Sidebar"
    >
      <a
        v-for="item in navigation"
        :key="item.name"
        v-tippy="{ content: item.name, placement: 'right' }"
        :href="item.href"
        :class="[
          item.current
            ? 'bg-gray-200 text-gray-800'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900',
          'group flex items-center px-2 py-1 text-sm font-medium active:bg-gray-300',
        ]"
        :aria-current="item.current ? 'page' : undefined"
      >
        <span class="inline-flex truncate">
          <Component
            :is="item.icon"
            class="mx-0 mr-2"
            style="margin-top: 1px; height: 18px; width: 18px"
          />
          {{ item.name }}
        </span>
      </a>
    </nav>
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
  ShareIcon,
} from '@heroicons/vue/solid';

const navigation = [
  { name: 'Delete', href: '#', icon: TrashIcon, count: '5' },
  { name: 'Add to Favorites', href: '#', icon: StarIcon },
  { name: 'Focus in Gravity', href: '#', icon: ShareIcon },
  { name: 'Duplicate', href: '#', icon: DuplicateIcon, count: '19' },
  { name: 'Copy Link', href: '#', icon: ClipboardCopyIcon, count: '20+' },
  { name: 'Rename', href: '#', icon: PencilIcon },
];
</script>

<style scoped></style>
