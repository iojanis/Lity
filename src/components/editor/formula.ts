import { Node, nodeInputRule, mergeAttributes } from "@tiptap/core";

import { mathPlugin } from "@benrbray/prosemirror-math";

export const regex = /(?:^|\s)((?:\$)((?:[^*]+))(?:\$))$/;

export const Formula = Node.create({
  name: "math_inline",
  group: "inline math",
  content: "text*", // important!
  draggable: true,
  inline: true, // important!
  atom: true, // important!
  code: true,

  parseHTML() {
    return [
      {
        tag: "math-inline", // important!
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "math-inline",
      mergeAttributes({ class: "math-node" }, HTMLAttributes),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [mathPlugin];
  },

  addInputRules() {
    return [nodeInputRule({ find: regex, type: this.type })];
  },
});
