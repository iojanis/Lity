import { Node, mergeAttributes } from "@tiptap/core";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { PluginKey, Plugin } from "prosemirror-state";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";

export type MetaOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: {
    options: MetaOptions;
    node: ProseMirrorNode;
  }) => string;
  suggestion: Omit<SuggestionOptions, "editor">;
};

export const MetaPluginKey = new PluginKey("meta");

export const Meta = Node.create<MetaOptions>({
  name: "meta",

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options, node }) {
        return `${node.attrs.label}`;
      },
      suggestion: {
        char: "#",
        pluginKey: MetaPluginKey,
        command: ({ editor, range, props }) => {
          // increase range.to by one when the next node is of type "text"
          // and starts with a space character
          const nodeAfter = editor.view.state.selection.$to.nodeAfter;
          const overrideSpace = nodeAfter?.text?.startsWith(" ");

          if (overrideSpace) {
            range.to += 1;
          }

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: "text",
                text: " ",
              },
            ])
            .run();
        },
        allow: ({ editor, range }) => {
          const $from = editor.state.doc.resolve(range.from);
          const type = editor.schema.nodes[this.name];
          const allow = !!$from.parent.type.contentMatch.matchType(type);

          return allow;
        },
      },
    };
  },

  group: "inline",

  inline: true,

  draggable: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            "data-id": attributes.id,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-label"),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            "data-label": attributes.label,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-meta]",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      // "i",
      // mergeAttributes(
      //   {
      //     "data-meta": "",
      //     class:
      //       "dark:bg-gray-700 dark:text-gray-200 ri-" +
      //       node.attrs.label +
      //       "-fill",
      //   },
      //   this.options.HTMLAttributes,
      //   HTMLAttributes
      // ),
      mergeAttributes(
        {
          "data-meta": "",
          class: "bg-gray-200 dark:bg-gray-700 font-mono dark:text-gray-200",
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ];
  },

  renderText({ node }) {
    return this.options.renderLabel({
      options: this.options,
      node,
    });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMeta = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMeta = true;
              tr.insertText(
                this.options.suggestion.char || "",
                pos,
                pos + node.nodeSize
              );

              return false;
            }
          });

          return isMeta;
        }),
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
      // new Plugin({
      //   key: new PluginKey("handleClick"),
      //   props: {
      //     handleClick: (view, pos, event) => {
      //       // const attrs = this.editor.getMarkAttributes('link')
      //       const link = (event.target as HTMLElement)?.closest("span.meta");
      //
      //       if (link) {
      //         const match = window.location.href.match("(.*)#\\/(.+)\\/");
      //
      //         // @ts-ignore
      //         window.location.href =
      //           // @ts-ignore
      //           match[1] + "#/" + match[2] + "/" + link.getAttribute("data-id");
      //         return true;
      //       }
      //
      //       return false;
      //     },
      //   },
      // }),
    ];
  },
});
