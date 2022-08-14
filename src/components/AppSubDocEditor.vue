<template>
  <div
    style="width: 100%; margin-top: -1px"
    class="mt-0 m-0 rounded-t-lg fixed z-20 top-0 flex bg-white bg-opacity-50 dark:bg-black/50 "
    :class="{
                'dark:bg-black bg-opacity-100':
                  !state.blurredInterface,
              }"
    v-if="editor"
  >
    <button
      v-if="!editorOnly"
      class="
        relative
        ml-3
        inline-flex
        items-center
        bg-transparent
        text-sm
        font-medium
        text-black
        dark:text-white
        opacity-70
        hover:opacity-100
        focus:outline-none
      "
      type="button"
      @click="emit('back')"
    >
      <i class="ri-arrow-left-circle-fill text-2xl" />
    </button>
    <button
      v-if="!editorOnly"
      class="
        relative
        ml-1
        inline-flex
        items-center
        bg-transparent
        text-sm
        font-medium
        text-black
        dark:text-white
        opacity-70
        hover:opacity-100
        focus:outline-none
      "
      type="button"
      @click="emit('forward')"
    >
      <i class="ri-arrow-right-circle-fill text-2xl" />
    </button>
    <MenuBar
      class="
        editor__header
        my-1.5
        w-auto
        mx-auto
        overflow-x-scroll
        whitespace-nowrap
        hs
      "
      :editor="editor"
    />
    <button
      v-if="!editorOnly"
      class="
        relative
        mr-1
        inline-flex
        items-center
        bg-transparent
        text-sm
        font-medium
        text-black
        dark:text-white
        opacity-70
        hover:opacity-100
        focus:outline-none
      "
      type="button"
      @click="emit('switch')"
    >
<!--            {{ paneState }}-->
      <i
        class="text-2xl"
        :class="{
          'ri-swap-fill': true
        }"
      />
    </button>
    <button
      v-if="!editorOnly"
      class="
        relative
        mr-3
        inline-flex
        items-center
        bg-transparent
        text-sm
        font-medium
        text-black
        dark:text-white
        opacity-70
        hover:opacity-100
        focus:outline-none
      "
      type="button"
      @click="emit('hide')"
    >
      <i class="ri-close-circle-fill text-2xl" />
    </button>
  </div>

  <editor-content
    @scroll="scrolling"
    v-if="editor"
    @click.self="!editor.isFocused ? editor.commands.focus('end') : null"
    class="
    rounded-t-lg
    hs
      editor__content
      dark:text-white
      fixed
      top-0
      bottom-0
      left-0
      right-0
      overflow-y-scroll
      p-3
      pb-12
      pt-12
      select-auto
      bg-opacity-5 dark:bg-black/50 backdrop-filter backdrop-blur-lg
    "    :class="{
                'dark:bg-black bg-opacity-100':
                  !state.blurredInterface,
              }"
    :editor="editor"
  />
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as Y from "yjs";
import { EditorContent } from "@tiptap/vue-3";

import MenuBar from "./editor/MenuBar.vue";

import { useDocEditor } from "../composables/useDocEditor";
import { useSettings } from "../composables/useSettings";
import { onBeforeUnmount, onMounted } from "vue";

const props = defineProps<{
  yRootDoc: Y.Doc;
  yRootDocs: any;
  jRootDocs: any;
  ySubDoc: any;
  ySubDocIndexedDb: any;
  ySubDocs: any;
  jSubDocs: any;
  spaceId: any;
  docId: any;
  nodeId: any;
  hocuspocusProvider: any;
  webRtcProvider: any;
  subStates: any;
  paneVisible: boolean;
  paneState: string;
  editorOnly: boolean;
}>();

const emit = defineEmits([
  "onFocus",
  "onBlur",
  "onUpdate",
  "bottom",
  "middle",
  "top",
  "hide",
  "back",
  "forward",
  "switch",
]);

const scrolling = () => {
  const elem = document.getElementsByClassName("editor__content")[0];
  if (elem.scrollTop <= -50) {
    emit("bottom");
  }
  // if (elem.scrollTop >= 20) {
  //   emit('middle')
  // }
  if (elem.scrollTop >= 50) {
    emit("top");
  }
};

const { state } = useSettings()

const { editor } = useDocEditor(emit, props.ySubDoc, props.nodeId, props.hocuspocusProvider, props.webRtcProvider, props.yRootDoc)

onBeforeUnmount(()=>{
  editor.destroy()
})

</script>

<style lang="scss">
//.has-focus {
//  border-radius: 3px;
//  box-shadow: 0 0 0 3px #68cef8;
//}

.bubble-menu {
  display: inline-flex;
  border-radius: 0.25rem;
  z-index: 150;
  button {
    opacity: 0.7;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}

.floating-menu {
  display: inline-flex;
  padding: 0;
  border-radius: 0.25rem;

  button {
    border: none;
    background: none;
    opacity: 0.7;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}

/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}

/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

/* Placeholder (on every new line) */
/*.ProseMirror p.is-empty::before {
content: attr(data-placeholder);
float: left;
color: #ced4da;
pointer-events: none;
height: 0;
}*/

/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}

ul[data-type="taskList"] {
  list-style: none !important;
  padding: 0 !important;

  li {
    display: flex !important;
    align-items: center !important;

    > label {
      flex: 0 0 auto !important;
      margin-right: 0.5rem !important;
      user-select: none !important;
    }

    > div {
      flex: 1 1 auto !important;

      > p {
        margin: 0 !important;
      }
    }
  }

  input[type="checkbox"] {
    cursor: pointer !important;
  }
}

.prose {
  max-width: 100% !important;
}

.ProseMirror:focus {
  outline: none;
}

/* Table-specific styling */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul {
    padding: 0 1.5rem;
  }
  ol {
    padding: 0 3rem;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }

  img {
    max-width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #68cef8;
    }
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }
  }
}

.tableWrapper {
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

.mention {
  cursor: pointer;
  border-radius: 0.3rem;
  padding: 0.1rem 0.3rem;
}

.meta {
  cursor: pointer;
  border-radius: 0.3rem;
  padding: 0.1rem 0.3rem;
}


/* Color swatches */
.color {
  white-space: nowrap;

  &::before {
    content: " ";
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 1px solid rgba(128, 128, 128, 0.3);
    vertical-align: middle;
    margin-right: 0.1em;
    margin-bottom: 0.15em;
    border-radius: 2px;
    background-color: var(--color);
  }
}

/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  a {
    color: #0094d0;
    text-decoration: underline dashed;
    cursor: pointer;
  }
}

/* Placeholder (at the top) */
/*.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}*/

/* Placeholder (on every new line) */
.ProseMirror .is-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #F98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #FBBC88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #B9F18D;
    }

    .hljs-title,
    .hljs-section {
      color: #FAF594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70CFF8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }
}

.ProseMirror {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }
}

.tableWrapper {
  padding: 1rem 0;
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>
