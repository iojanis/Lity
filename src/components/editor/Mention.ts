import { Node, mergeAttributes } from "@tiptap/core";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { PluginKey, Plugin } from "prosemirror-state";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import * as Y from "yjs";
import {useUtility} from "@/composables/useUtility";

export type MentionOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: {
    options: MentionOptions;
    node: ProseMirrorNode;
  }) => string;
  suggestion: Omit<SuggestionOptions, "editor">;
  ySubDoc: any;
  allDocs: any;
};

const { getPlainText } = useUtility();

export const MentionPluginKey = new PluginKey("mention");

export const Mention = Node.create<MentionOptions>({
  name: "mention",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options, node }) {
        console.dir(node)
        let title = node.attrs.id
        if (options.allDocs && node.attrs.id) {
          const found = options.allDocs.find(el => el.id === node.attrs.id.toString());
          if (found && found.title) return `${getPlainText(found.title)}`;
        }
        title = node.attrs.label
        return `${title}`;
      },
      suggestion: {
        char: "@",
        pluginKey: MentionPluginKey,
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

      space: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-space"),
        renderHTML: (attributes) => {
          if (!attributes.space) {
            return {};
          }

          return {
            "data-space": attributes.space,
          };
        },
      },

      spaceLabel: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-space-label"),
        renderHTML: (attributes) => {
          if (!attributes.spaceLabel) {
            return {};
          }

          return {
            "data-space-label": attributes.spaceLabel,
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
        tag: "span[data-mention]",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        {
          "data-mention": "",
          class: "bg-blue-200 dark:bg-blue-700 dark:text-blue-200",
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
          let isMention = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMention = true;
              tr.insertText(
                this.options.suggestion.char || "",
                pos,
                pos + node.nodeSize
              );

              return false;
            }
          });

          return isMention;
        }),
      "Mod-Shift-k": () =>
        this.editor.commands.command(({ tr, state }) => {
          const isMention = false;
          const { selection } = state;
          const { empty, anchor, content } = selection;

          const newId = Math.floor(new Date().getTime() + Math.random());
          // increase range.to by one when the next node is of type "text"
          // and starts with a space character
          // const nodeAfter = selection.$from.nodeAfter.text;
          // const overrideSpace = nodeAfter?.text?.startsWith(" ");
          //
          // if (overrideSpace) {
          //   selection.to += 1;
          //
          //
          // const yXmlText = new Y.XmlText();
          //
          // yXmlText.insert(0, allFoundMentions[i].title, { h1: {} })

          // const yXmlText = new Y.XmlText();

          // yXmlText.insert(0, , {
          //   h1: {},
          // });

          // this.options.ySubDoc
          //   .getXmlFragment(newId.toString())
          //   .insert(0, [yXmlText]);

          return this.editor
            .chain()
            .focus()
            .insertContentAt(selection, [
              {
                type: this.name,
                attrs: {
                  space: null,
                  id: newId.toString(),
                  label: selection.$from.doc.textBetween(
                    selection.from,
                    selection.to,
                    ""
                  ),
                },
              },
              {
                type: "text",
                text: " ",
              },
            ])
            .run();
        }),
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
      new Plugin({
        key: new PluginKey("handleClick"),
        props: {
          handleClick: (view, pos, event) => {
            // const attrs = this.editor.getMarkAttributes('link')
            const link = (event.target as HTMLElement)?.closest("span.mention");

            if (link) {
              const match = window.location.href.match("(.*)#\\/(.+)\\/");
              const space = link.getAttribute("data-space");

              console.log(space);

              // @ts-ignore
              if (space) {
                window.location.href =
                  // @ts-ignore
                  match[1] + "#/" + space + "/" + link.getAttribute("data-id");
              } else {
                window.location.href =
                  // @ts-ignore
                  match[1] +
                  "#/" +
                  match[2] +
                  "/" +
                  link.getAttribute("data-id");
              }
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});
