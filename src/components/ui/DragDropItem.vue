<template>
  <drop
    :class="{ grabbing: dragEnter }"
    @dragenter="dragEnter = true"
    @dragleave="dragEnter = false"
    @drop="handleDrop"
  >
    <drag :transfer-data="item">
      <slot>
        <span
          href="#"
          :class="[
            item.current
              ? 'bg-zinc-200 text-zinc-800 dark:text-zinc-50 '
              : 'text-zinc-600 dark:text-zinc-50  hover:bg-zinc-200 hover:text-zinc-900',
            'group flex items-center px-3 text-sm font-medium active:bg-zinc-300',
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          <span class="py-1 inline-flex truncate">
            <button
              type="button"
              class="inline-flex mr-2 ml-1 items-center border border-transparent rounded-sm text-base text-zinc-500 dark:text-zinc-200 hover:bg-zinc-300 focus:outline-none focus:bg-zinc-300 active:bg-zinc-300"
              @click="emit('toggleContent')"
            >
              <ChevronRightIcon
                class="transition-all duration-200 ease-in-out transform rotate-45"
                :class="{ 'rotate-0': !item.open }"
                style="height: 18px; width: 18px"
                aria-hidden="true"
              />
            </button>
            {{ item.name }}
          </span>
          <span class="ml-auto text-zinc-500 inline-flex">
            <span
              v-tippy="{
                content: 'Page Options',
                placement: 'right',
                offset: [0, 30],
              }"
              :class="['hidden group-hover:block']"
            >
              <button
                type="button"
                class="inline-flex items-center border border-transparent mt-1 rounded-sm text-base text-zinc-800 hover:bg-zinc-300 focus:outline-none focus:bg-zinc-400 active:bg-zinc-400"
                @click="emit('openMenu')"
              >
                <DotsHorizontalIcon
                  style="height: 18px; width: 18px"
                  aria-hidden="true"
                />
              </button>
            </span>
            <span
              v-tippy="{ content: 'Add Page', placement: 'right' }"
              :class="['hidden group-hover:block']"
            >
              <button
                type="button"
                class="inline-flex items-center border border-transparent mt-1 ml-0.5 rounded-sm text-base text-zinc-800 hover:bg-zinc-300 focus:outline-none focus:bg-zinc-400 active:bg-zinc-400"
              >
                <PlusIcon
                  style="height: 18px; width: 18px"
                  aria-hidden="true"
                />
              </button>
            </span>
          </span>
        </span>
      </slot>
    </drag>
  </drop>
</template>
<script setup lang="ts">
import { Drag, Drop } from '@/components/ui/drag-drop';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import {
  ChevronRightIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from '@heroicons/vue/solid';

const props = defineProps<{
  item: any;
  // receivedData: any;
}>();

const emit = defineEmits(['openMenu', 'toggleContent']);

const dragEnter = ref(false);

const handleDrop = (data, event) => {
  dragEnter.value = false;
  console.log(data, event);
};
</script>
