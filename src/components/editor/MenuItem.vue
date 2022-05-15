<template>
  <button
    class="
      menu-item
      text-black
      dark:text-white
      hover:bg-opacity-50 hover:bg-zinc-300 dark:hover:bg-zinc-800
    "
    :class="{
      'bg-zinc-200 dark:bg-zinc-900 text-blue-500 dark:text-blue-500': isActive
        ? isActive()
        : null,
    }"
    :title="title"
    @click="action"
  >
    <svg class="remix">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>
</template>

<script>
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";

export default {
  props: {
    icon: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    action: {
      type: Function,
      required: true,
    },

    isActive: {
      type: Function,
      default: null,
    },
  },

  data() {
    return {
      remixiconUrl,
    };
  },
};
</script>

<style lang="scss">
.menu-item {
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 0.4rem;
  padding: 0.25rem;
  margin-right: 0.25rem;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
}
</style>
