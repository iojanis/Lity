// @ts-nocheck
import { Node, nodeInputRule, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey, NodeSelection, Selection } from "prosemirror-state";

const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

/**
 * TODO:
 *    * Handle paste image
 *    * Handle Drop event for Image at specific cursor point
 *    * Event on click
 */
export default Node.create({
  name: "image",

  defaultOptions: {
    inline: true,
    HTMLAttributes: {
      style: " max-height: 300px",
    },
  },

  inline: true,
  group: "inline",
  draggable: true,
  atom: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },
  addCommands() {
    return {
      /**
       * Add an image
       */
      setImage:
        (options) =>
        ({ tr, dispatch }) => {
          const { selection } = tr;
          const node = this.type.create(options);
          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node);
          }
          return true;
        },
    };
  },
  addInputRules() {
    return [
      nodeInputRule(inputRegex, this.type, (match) => {
        const [, alt, src, title] = match;
        return { src, alt, title };
      }),
    ];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("image"),
        props: {
          handleDoubleClickOn(view, pos, node, nodePos, event, direct) {
            if (node.type.name === "image") {
              const sel = NodeSelection.create(
                view.state.doc,
                Selection.atStart(node)
              );
              const transaction = view.state.tr.setSelection(sel);
              view.dispatch(transaction);
            }
          },
          handleDrop(view, event) {
            if (event.dataTransfer?.files?.length !== 1) {
              return;
            }

            const images = Array.from(event.dataTransfer.files).filter((file) =>
              /image/i.test(file.type)
            );
            if (images.length === 1) {
              event.preventDefault();
              event.stopImmediatePropagation();

              const { schema } = view.state;
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              const reader = new FileReader();
              reader.onload = (readerEvent) => {
                const node = schema.nodes.image.create({
                  src: readerEvent.target.result,
                  alt: images[0].name,
                });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              };
              reader.readAsDataURL(images[0]);
            }
          },
        },
      }),
    ];
  },
});
