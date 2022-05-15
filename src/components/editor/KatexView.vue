<template>
  <node-view-wrapper class="katex">
    <div id="katex" class="content">
      <button @cick="edit = true">edit</button>
      <span v-if="!edit" v-katex> {{ node.attrs.content }} </span>
      <input type="text" @keyup.enter="edit = false" v-if="edit" v-model="node.attrs.content"/>
    </div>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { computed, onMounted, ref } from "vue";

export default {
  components: {
    NodeViewWrapper
  },

  props: nodeViewProps,

  setup() {

    const latexRender = ref()
    const edit = ref(false)

    // onMounted(()=>{
    //
    // })

    return {
      latexRender,
      edit
    }
  }

}
</script>


