// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { reactive, ref } from "vue";
import * as Y from "yjs";
import { useEditor, Editor, VueRenderer } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Typography from "@tiptap/extension-typography";
import { Mention } from "../components/editor/Mention";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Focus from "@tiptap/extension-focus";
// import Gapcursor from "@tiptap/extension-gapcursor";
// import Dropcursor from "@tiptap/extension-dropcursor";
// import Image from "../components/editor/Image";
import MentionList from "../components/editor/MentionList.vue";
import tippy from "tippy.js";
import { Collaboration } from "@tiptap/extension-collaboration";
import { CollaborationCursor } from "@tiptap/extension-collaboration-cursor";
import ExtensionDocument from "@tiptap/extension-document";
import { useUtility } from "./useUtility";
import { useRoute, useRouter } from "vue-router";
import { useSettings } from "./useSettings";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Image } from "@tiptap/extension-image";
import { lowlight } from "lowlight";
import { useSubProvider } from "./useSubProvider";
import { Meta } from "../components/editor/Meta";
import { Formula } from "../components/editor/formula";
import Commands from "../components/editor/commands";
import CommandsList from "../components/editor/CommandsList.vue";
// import KatexElem from "../components/editor/formula/entensionInline.ts";

const Document = ExtensionDocument.extend({
  content: "heading block*",
});

export const useDocEditor = (
  emit: any,
  ySubDoc: any,
  nodeId: any,
  hocuspocusProvider: any,
  webRtcProvider: any,
  yRootDoc: any
) => {
  const { state, logger } = useSettings();

  const { subHocuspocusProvider, subWebRtcProvider } = useSubProvider();

  const route = useRoute();
  const router = useRouter();

  const docUsers = ref([]);

  const { isMobile, getPlainText, delay } = useUtility();

  const yNodes = ySubDoc.getMap("nodes");
  const yLinks = ySubDoc.getMap("links");
  const yRootDocs = yRootDoc.getMap();
  let jAllNodes = [];

  yRootDocs.observe(() => {
    jAllNodes = getAllNodesFromCurrentRootDoc();
  });

  const getAllNodesFromCurrentRootDoc = () => {
    const jRootDocs = Object.values(yRootDocs.toJSON());
    const spread = [];
    for (let i = 0; i < jRootDocs.length; i++) {
      if (jRootDocs[i].nodes) {
        for (let j = 0; j < jRootDocs[i].nodes.length; j++) {
          const obk = jRootDocs[i].nodes[j];
          obk.space = yRootDoc.guid + "/" + jRootDocs[i].guid;
          obk.spaceLabel = getPlainText(jRootDocs[i].title);
          spread.push(obk);
          // console.log(obk);
        }
      }
    }
    return spread;
  };

  jAllNodes = getAllNodesFromCurrentRootDoc();

  const currentNode = yNodes.get(nodeId);

  // watch(nodeId, ()=> {
  //   (async () => {
  //     await delay(1000);
  //     editor.value.commands.focus()
  //   })();
  // })

  let resize: any;

  const extensions = [
    Document,
    StarterKit.configure({
      history: false,
      document: false,
      codeBlock: false,
      commands: false,
    }),
    // Formula,
    CodeBlockLowlight.configure({
      lowlight,
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === "heading") {
          if (currentNode && currentNode.href)
            return "Type a title for " + currentNode.href;
          return "Type a title for " + nodeId;
        }
        return "/";
      },
    }),
    Link,
    Highlight,
    TaskList,
    TaskItem,
    Focus.configure({
      className: "has-focus",
      mode: "all",
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Underline,
    Subscript,
    Superscript,
    Typography,
    Image,
    Mention.configure({
      HTMLAttributes: {
        class: "mention",
      },
      ySubDoc: ySubDoc,
      suggestion: {
        allowSpaces: true,
        items: ({ query }) => {
          const nodes = Object.values(yNodes.toJSON());
          const newNodes = [];
          const isSlash = query.startsWith("/");
          const usedNodes = query.startsWith("/") ? jAllNodes : nodes;
          usedNodes.forEach((node) => {
            let title =
              node.id !== node.title ? getPlainText(node.title) : node.title;
            if (node.id === "index") title = "Index";
            if (
              node.space &&
              node.space.split("/")[1] === route.params.document
            ) {
              newNodes.push({
                id: node.id,
                space: null,
                label: title,
              });
            } else {
              newNodes.push({
                id: node.id,
                label: node.space ? node.spaceLabel + " / " + title : title,
                space: node.space,
                spaceLabel: node.spaceLabel,
              });
            }
          });
          if (query.length > 0 && !isSlash) {
            newNodes.push({
              id: Math.floor(new Date().getTime() + Math.random()),
              label: query,
              new: true,
              space: null,
            });
          }
          let returnNodes = [];
          const splitted = query.startsWith("/")
            ? query.toLowerCase().substring(1).split(" ")
            : query.toLowerCase().split(" ");
          returnNodes = newNodes
            .filter((item) => item.label.toLowerCase().includes(splitted[0]))
            .sort((a, b) =>
              a.label > b.label ? 1 : b.label > a.label ? -1 : 0
            )
            .slice(0, 10);
          if (splitted.length > 1) {
            returnNodes = returnNodes.filter((item) =>
              item.label.toLowerCase().includes(splitted[1])
            );
          }
          return returnNodes;
        },

        render: () => {
          let component;
          let popup;

          return {
            onStart: (props) => {
              component = new VueRenderer(MentionList, {
                props,
                editor: props.editor,
              });

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                arrow: false,
                placement: "bottom-start",
              });
            },

            onUpdate(props) {
              component.updateProps(props);

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup[0].hide();

                return true;
              }

              return component.ref?.onKeyDown(props);
            },

            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      },
    }),
    Collaboration.configure({
      document: ySubDoc,
      field: nodeId,
    }),
  ];

  const useMeta = false;

  if (useMeta) {
    extensions.push(
      Meta.configure({
        HTMLAttributes: {
          class: "meta",
        },
        suggestion: {
          allowSpaces: true,
          items: ({ query }) => {
            const matters = Object.values(yRootDoc.getMap("matter").toJSON());
            const newMatter = [];
            matters.forEach((matter) => {
              const title =
                matter.id !== matter.title
                  ? getPlainText(matter.title)
                  : matter.title;
              newMatter.push({ id: matter.id, label: title });
            });
            if (query.length > 0) {
              newMatter.push({
                id: stringToSlug(query.toLowerCase()),
                label: query,
              });
            }
            return newMatter
              .filter((item) =>
                item.label.toLowerCase().includes(query.toLowerCase())
              )
              .slice(0, 10);
          },

          render: () => {
            let component;
            let popup;

            return {
              onStart: (props) => {
                component = new VueRenderer(MentionList, {
                  props,
                  editor: props.editor,
                });

                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  arrow: false,
                  placement: "bottom-start",
                });
              },

              onUpdate(props) {
                component.updateProps(props);

                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },

              onKeyDown(props) {
                if (props.event.key === "Escape") {
                  popup[0].hide();

                  return true;
                }

                return component.ref?.onKeyDown(props);
              },

              onExit() {
                popup[0].destroy();
                component.destroy();
              },
            };
          },
        },
      })
    );
  }

  const useCommands = false;

  if (useCommands) {
    extensions.push(
      Commands.configure({
        suggestion: {
          items: ({ query }) => {
            return [
              {
                icon: "h-1",
                title: "Heading 1",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 1 })
                    .run();
                },
              },
              {
                icon: "h-2",
                title: "Heading 2",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 2 })
                    .run();
                },
              },
              {
                icon: "bold",
                title: "Bold",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("bold")
                    .run();
                },
              },
              {
                icon: "italic",
                title: "Italic",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                icon: "strikethrough",
                title: "Strike",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Inline Code",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Highlight",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Mention",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Keyword",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                icon: "paragraph",
                title: "Paragraph",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                icon: "list-unordered",
                title: "Bullet List",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                icon: "list-ordered",
                title: "Ordered List",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                icon: "list-check-2",
                title: "Task List",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                icon: "table",
                title: "Table",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Code Block",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Formula",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Image",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Blockquote",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Horizontal Rule",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Hard Break",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Clear Format",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Go to first line",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                title: "Go to last line",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                icon: "arrow-go-back-line",
                title: "Undo",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
              {
                icon: "arrow-go-forward-line",
                title: "Redo",
                command: ({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark("italic")
                    .run();
                },
              },
            ]
              .filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase())
              )
              .slice(0, 10);
          },

          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props) => {
                component = new VueRenderer(CommandsList, {
                  // using vue 2:
                  // parent: this,
                  // propsData: props,
                  props,
                  editor: props.editor,
                });

                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  arrow: false,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              },

              onUpdate(props) {
                component.updateProps(props);

                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },

              onKeyDown(props) {
                if (props.event.key === "Escape") {
                  popup[0].hide();

                  return true;
                }

                return component.ref?.onKeyDown(props);
              },

              onExit() {
                popup[0].destroy();
                component.destroy();
              },
            };
          },
        },
      })
    );
  }

  if (hocuspocusProvider && state.value.showOtherCursors) {
    extensions.push(
      CollaborationCursor.configure({
        provider: hocuspocusProvider,
        user: {
          name: state.value.localUserName,
          color: state.value.localUserColor,
        },
      })
    );
  }

  if (webRtcProvider && !hocuspocusProvider && state.value.showOtherCursors) {
    extensions.push(
      CollaborationCursor.configure({
        provider: webRtcProvider,
        user: {
          name: state.value.localUserName,
          color: state.value.localUserColor,
        },
      })
    );
  }

  let init = false;

  const editor = new Editor({
    autofocus: false,
    extensions: extensions,
    onCreate({ editor }) {
      managePane(editor);
      changePane();
      resize = setTimeout(() => {
        if (!isMobile())
          editor.commands.focus("end", { scrollIntoView: false });
      }, 250);
    },
    onUpdate({ editor }) {
      emit("onUpdate");

      changePane();

      function updateDocDates(yRootDocs, document) {
        let doclistitem = {};
        const remote = yRootDocs.getMap().get(document);
        if (remote) doclistitem = remote;
        doclistitem.updatedAt = new Date().toISOString();
        if (!doclistitem.guid) doclistitem.guid = document;
        doclistitem.filled = true;
        if (!doclistitem.createdAt)
          doclistitem.createdAt = new Date().toISOString();
        yRootDocs.getMap().set(document, doclistitem);
      }

      if (init) {
        updateDocDates(yRootDoc, route.params.document);
      }

      if (!init) init = true;

      if (resize) {
        clearTimeout(resize);
        resize = setTimeout(() => {
          managePane(editor);
        }, 200);
      }
    },
    onFocus({ editor }) {
      emit("onFocus");

      changePane();
    },
    onBlur({ editor }) {
      emit("onBlur");
    },
  });

  const getAllLinks = (obj) => {
    const allLinks = [];
    let newLink;

    function gooDeeper(flo) {
      if (Array.isArray(flo)) {
        for (let i = 0; i < flo.length; i++) {
          if (Array.isArray(flo[i].content)) {
            for (let j = 0; j < flo[i].content.length; j++) {
              if (
                Array.isArray(flo[i].content) &&
                Array.isArray(flo[i].content[j].marks)
              ) {
                const content = flo[i].content[j];
                if (content) {
                  newLink = {
                    title: undefined,
                    href: undefined,
                  };
                  newLink.title = flo[i].content[j].text;
                  for (let k = 0; k < flo[i].content[j].marks.length; k++) {
                    if (
                      flo[i].content[j].marks[k].attrs &&
                      flo[i].content[j].marks[k].attrs.href
                    ) {
                      newLink.href = flo[i].content[j].marks[
                        k
                      ].attrs.href.replace(/\/$/, "");
                      allLinks.push(newLink);
                    }
                  }
                }
              } else if (flo[i].content[j].content) {
                gooDeeper(flo[i].content[j].content);
              }
            }
          }
        }
      }
    }

    gooDeeper(obj);

    return allLinks;
  };

  const getAllMentions = (obj) => {
    const allMentions = [];
    let newLink;

    function gooDeeper(flo) {
      if (Array.isArray(flo)) {
        for (let i = 0; i < flo.length; i++) {
          if (Array.isArray(flo[i].content)) {
            for (let j = 0; j < flo[i].content.length; j++) {
              if (Array.isArray(flo[i].content)) {
                const content = flo[i].content[j];
                if (content.type === "mention") {
                  newLink = {
                    title: content.attrs.label,
                    id: content.attrs.id,
                  };
                  if (!content.attrs.space) {
                    allMentions.push(newLink);
                  }
                } else if (content.content) {
                  gooDeeper(content.content);
                }
              }
            }
          }
        }
      }
    }

    gooDeeper(obj);

    return allMentions;
  };

  function stringToSlug(str) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  }

  function managePane(editor) {
    let node = {
      id: nodeId,
      title: nodeId,
      group: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      neighbors: [],
      links: [],
    };
    const remoteNode = yNodes.get(nodeId);

    if (remoteNode) {
      node = remoteNode;
      // node.updated = new Date().toISOString();
      if (!node.created) {
        node.created = new Date().toISOString();
        yNodes.set(nodeId, node);
      }
    }

    const jsonContent = editor.getJSON().content;

    if (jsonContent && jsonContent[0]) {
      const content = jsonContent[0].content ? jsonContent[0].content : "";

      if (content && getPlainText(content) !== getPlainText(node.title)) {
        node.title = content;
        yNodes.set(nodeId, node);
        if (nodeId === "index") {
          function updateDocIndex(yRootDocs, document) {
            let doclistitem = {};
            const remote = yRootDocs.getMap().get(document);
            if (remote) doclistitem = remote;
            doclistitem.title = node.title;
            doclistitem.updatedAt = new Date().toISOString();
            if (!doclistitem.guid) doclistitem.guid = document;
            doclistitem.filled = true;
            if (!doclistitem.createdAt)
              doclistitem.createdAt = new Date().toISOString();
            yRootDocs.getMap().set(document, doclistitem);
          }
          updateDocIndex(yRootDoc, route.params.document);
        } else {
          function updateDoc(yRootDocs, document) {
            let doclistitem = {};
            const remote = yRootDocs.getMap().get(document);
            if (remote) doclistitem = remote;
            doclistitem.updatedAt = new Date().toISOString();
            if (!doclistitem.guid) doclistitem.guid = document;
            doclistitem.filled = true;
            if (!doclistitem.createdAt)
              doclistitem.createdAt = new Date().toISOString();
            yRootDocs.getMap().set(document, doclistitem);
          }
          updateDoc(yRootDoc, route.params.document);
        }
      }

      if (!content) {
        if (
          jsonContent[0] &&
          !jsonContent[0].content &&
          node.id !== getPlainText(node.title)
        ) {
          // node.title = "";
          yNodes.set(nodeId, node);
          if (node.href) {
            editor.commands.setContent(
              `<a href="${node.href}">${node.title}</a>`
            );
          } else {
            editor.commands.setContent(node.title);
          }
        }
      }

      if (jsonContent && jsonContent.length >= 1) {
        const allFoundMentions = getAllMentions(jsonContent);
        const allFoundLinks = getAllLinks(jsonContent);
        for (let i = 0; i < allFoundMentions.length; i++) {
          const source = nodeId.toString();
          const targetId = allFoundMentions[i].id.toString();
          const possibleLink = yLinks.get(source + "_" + targetId);
          const possibleNode = yNodes.get(targetId);
          if (!possibleLink && !possibleNode) {
            yNodes.set(targetId, {
              id: targetId,
              group: 1,
              title: "" + allFoundMentions[i].title + "",
              created: new Date().toISOString(),
              updated: new Date().toISOString(),
              neighbors: [source],
              links: [source],
            });

            // yxmlText.insert(0, allFoundMentions[i].title, { h1: {} })

            // ySubDoc.getXmlFragment(targetId).insert(0, [yxmlText])

            (async () => {
              await delay(100);
              yLinks.set(source + "_" + targetId, {
                target: targetId,
                source: source,
                value: 0,
              });
            })();
          } else if (!possibleLink && possibleNode) {
            (async () => {
              await delay(100);
              yLinks.set(source + "_" + targetId, {
                target: targetId,
                source: source,
                value: 0,
              });
            })();
          }
        }
        for (let i = 0; i < allFoundLinks.length; i++) {
          const source = nodeId;
          const target = allFoundLinks[i].href;
          const targetId = stringToSlug(target);
          const possible = yNodes.get(targetId);
          if (!possible || possible.href !== target) {
            yNodes.set(targetId, {
              id: targetId,
              group: 1,
              title: target,
              created: new Date().toISOString(),
              updated: new Date().toISOString(),
              href: target,
              neighbors: [source],
              links: [source],
            });
            yLinks.set(targetId + "_" + source, {
              target: source,
              source: targetId,
              value: 0,
            });
          }
          if (possible) {
            const source = nodeId;
            const targetId = stringToSlug(target);
            const possibleLink = yNodes.get(targetId + "_" + source);
            if (!possibleLink) {
              yLinks.set(targetId + "_" + source, {
                target: source,
                source: targetId,
                value: 0,
              });
            }
          }
        }
      }
    }
  }

  function changePane() {
    const el = document.getElementsByClassName("ProseMirror")[0];
    if (el && el.clientHeight <= 35) emit("bottom");
    else if (el && el.clientHeight >= 36 && el.clientHeight <= 229)
      emit("middle");
    if (el && el.clientHeight >= 230) emit("top");
    // if (!isMobile() && el) {
    //
    // } else if (el) {
    //   if (el.clientHeight > 35 && el.clientHeight <= 100) emit("middle");
    //   if (el.clientHeight >= 230) emit("top");
    // }
  }

  const focusEditor = (position: string) => {
    editor.commands.focus(position);
  };

  return {
    yNodes,
    yLinks,
    currentNode,
    editor,
    getAllLinks,
    getAllMentions,
    stringToSlug,
    managePane,
    changePane,
    focusEditor,
  };
};
