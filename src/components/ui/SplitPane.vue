<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useTippy } from 'vue-tippy';
import { useWindowSize } from '@vueuse/core';
import SelectorMenu from '/@/components/SelectorMenu.vue';

const { width, height } = useWindowSize();

const props = defineProps<{ layout?: string }>();
const isVertical = computed(() => props.layout === 'vertical');

const DraggerRef = ref(null);

useTippy(DraggerRef, {
  content:
    '<strong>Drag</strong> to resize<br><strong>Click</strong> to toggle',
  placement: 'right',
  followCursor: 'initial',
  animation: 'fade',
  delay: [300, 50],
  duration: [50, 50],
  arrow: false,
});

const container = ref();

const showOutput = ref(true);

const state = reactive({
  dragging: false,
  split: 200,
  inverse: width.value - 200,
});

const boundSplit = computed(() => {
  const { split } = state;
  return split < 200 ? 200 : split > 500 ? 500 : split;
});

const boundInverse = computed(() => {
  const { split } = state;
  return width.value - split;
});

let startPosition = 0;
let startSplit = 0;

const dragStart = (e: MouseEvent) => {
  state.dragging = true;
  startPosition = isVertical.value ? e.pageY : e.pageX;
  startSplit = boundSplit.value;
};

const dragMove = (e: MouseEvent) => {
  if (state.dragging) {
    const position = isVertical.value ? e.pageY : e.pageX;
    const totalSize = isVertical.value
      ? container.value.offsetHeight
      : container.value.offsetWidth;
    const dp = position - startPosition;
    if (startSplit + dp < 500) {
      state.split = startSplit + dp;
      state.inverse = totalSize - state.split;
    }
  }
};

const dragEnd = () => {
  state.dragging = false;
};
</script>

<template>
  <div
    ref="container"
    class="split-pane"
    :class="{
      dragging: state.dragging,
      'show-output': showOutput,
      vertical: isVertical,
    }"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div
      class="left"
      :style="{ [isVertical ? 'height' : 'width']: boundSplit + 'px' }"
    >
      <div class="h-full w-full bg-zinc-50">
        <slot name="left" />
      </div>
    </div>
    <!--    <div-->
    <!--      class="middle bg-zinc-50"-->
    <!--      :style="{ [isVertical ? 'height' : 'width']: boundSplit + 'px' }"-->
    <!--    >-->
    <!--      <slot name="middle" />-->
    <!--      <div-->
    <!--        class="dragger bg-zinc-200"-->
    <!--        @mousedown.prevent="dragStart"-->
    <!--      />-->
    <!--    </div>-->
    <div
      class="right w-full"
      :style="{ [isVertical ? 'height' : 'width']: boundInverse + 'px' }"
    >
      <div
        ref="DraggerRef"
        class="dragger group"
        @mousedown.prevent="dragStart"
      >
        <div
          class="inside-dragger mt-8 mb-3 h-full w-auto group-hover:bg-black/20 group-active:bg-black/30 ring-black/50 transition-all group-hover:ring-2 group-hover:ring-black/5 group-active:ring-2 group-active:ring-black/10"
        />
      </div>
      <slot name="right" />
    </div>

    <button
      class="toggler"
      @click="showOutput = !showOutput"
    >
      {{ showOutput ? '< Code' : 'Output >' }}
    </button>
  </div>
</template>

<style scoped>
.split-pane {
  display: flex;
  height: 100%;
  position: relative;
}
.split-pane.dragging {
  cursor: ew-resize;
}
.dragging .left,
.dragging .right {
  pointer-events: none;
}
.left,
.middle,
.right {
  position: relative;
  transition: width 0s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}
.dragger {
  position: absolute;
  z-index: 3;
  top: 0;
  bottom: 0;
  left: -5px;
  width: 15px;
  cursor: ew-resize;
}
.inside-dragger {
  position: relative;
  left: 4px;
  right: 4px;
  width: 2px !important;
}
.toggler {
  display: none;
  z-index: 3;
  /*font-family: var(--font-code);*/
  /*color: var(--text-light);*/
  position: absolute;
  left: 50%;
  bottom: 20px;
  background-color: #bbb;
  padding: 8px 12px;
  border-radius: 8px;
  transform: translateX(-50%);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}

.dark .toggler {
  /*background-color: var(--bg);*/
}

/* vertical */
@media (min-width: 721px) {
  .split-pane.vertical {
    display: block;
  }

  .split-pane.vertical.dragging {
    cursor: ns-resize;
  }

  .vertical .dragger {
    top: auto;
    height: 10px;
    width: 100%;
    left: 0;
    right: 0;
    bottom: -5px;
    cursor: ns-resize;
  }

  .vertical .left,
  .vertical .right {
    width: 100%;
  }
  .vertical .left {
    border-right: none;
    /*border-bottom: 1px solid var(--border);*/
  }
}

/* mobile */
@media (max-width: 720px) {
  .left,
  .right {
    width: 100% !important;
    height: 100% !important;
  }
  .dragger {
    display: none;
  }
  .split-pane .toggler {
    display: block;
  }
  .split-pane .right {
    display: none;
  }
  .split-pane.show-output .right {
    display: block;
  }
  .split-pane.show-output .left {
    display: none;
  }
}
</style>
