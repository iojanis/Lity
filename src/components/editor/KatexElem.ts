import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import KatexComponent from "./formula/KatexComponent.vue";

export default Node.create({
  name: "KatexComponent",

  group: "inline",

  draggable: true,

  inline: true,

  atom: true,

  addAttributes() {
    return {
      katex: {
        default: "x=\\frac{-4b\\pm \\sqrt{b^2-4ac}}{2a}",
      },
      inline: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "katex-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["katex-component", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(KatexComponent);
  },
});
