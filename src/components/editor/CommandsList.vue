<template>
  <div
    class="
      items
      text-sm
      bg-white
      dark:bg-black
      shadow-xl
      backdrop-filter backdrop-blur2 backdrop-blur-lg
      font-mono
      p-0.5
    "
  >
    <button
      v-for="(item, index) in items"
      :key="index"
      class="item text-gray-700 dark:text-gray-200 rounded-sm"
      :class="{
        'dark:bg-zinc-600 bg-zinc-300 text-white ring-2 ring-zinc-600 ': index === selectedIndex,
      }"
      @click="selectItem(index)"
    >
      <i :class="'ri-'+item.icon"></i> {{ item.title }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }

      return false
    },

    upHandler() {
      this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },

    enterHandler() {
      this.selectItem(this.selectedIndex)
    },

    selectItem(index) {
      const item = this.items[index]

      if (item) {
        this.command(item)
      }
    },
  },
}
</script>

<style lang="scss">
.items {
  position: relative;
  border-radius: 0.25rem;
  overflow: hidden;
  font-size: 0.9rem;
}

.item {
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  padding: 0.2rem 0.5rem;

  &.is-selected,
  &:hover {
  }
}
</style>
