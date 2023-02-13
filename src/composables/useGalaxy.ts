// @ts-nocheck
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import ForceGraph from "force-graph";
import ForceGraph3D from "3d-force-graph";
import { forceCenter, forceCollide, forceX, forceY } from "d3-force";
import { scaleLinear } from "d3-scale";
import { hsl, rgb } from "d3-color";
import * as Y from "yjs";
import { useDark } from "@vueuse/core";
import { useUtility } from "./useUtility";
import { useSettings } from "./useSettings";
import { WebviewWindow, appWindow } from "@tauri-apps/api/window";

import { invoke } from "@tauri-apps/api/tauri";

const galaxyState = reactive({
  autoLink: false,
  linkingNodes: false,
  unlinkingNodes: false,
  deletingNodes: false,
  firstNode: undefined,
  secondNode: undefined,
  jsonDocuments: [],
});

export const useGalaxy = (
  yDoc: Y.Doc,
  emit: any,
  docId: any,
  hocuspocusStates: any,
  hocuspocusProvider: any,
  yRootDoc: Y.Doc
) => {
  const isDark = useDark();
  const { osKey, uuid } = useUtility();
  const { state, logger } = useSettings();

  const container = "graph";
  let elem: any;

  const route = useRoute();
  const router = useRouter();

  const computedNodeId = computed(() => route.params.node);
  const computedSpaceId = computed(() => route.params.space);

  const graph = ForceGraph();

  const yNodes = yDoc.getMap("nodes");
  const yLinks = yDoc.getMap("links");
  const ySelected = yDoc.getMap("selected");

  const yUndoManagerNodes = new Y.UndoManager([yNodes, yLinks]);

  const computedHocuspocusStates = computed(
    () => hocuspocusStates.hocuspocus.awareness
  );
  const computedRtcStates = computed(() => hocuspocusStates.rtc.awareness);

  const doneHistory = [];

  // const undo = () => {
  //   if (doneHistory[doneHistory.length]) {}
  // }
  //
  // const redo = () => {
  //
  // }

  const jsonDocuments = ref();

  const styleFallback = {
    background: "rgba(255,255,255,0)",
    fontSize: 16,
    lineColor: "#a7bac4",
    lineWidth: 1,
    particleWidth: 1.5,
    highlightedForeground: state.value.localUserColor || "#009dff",
    node: {
      note: "#00192a",
      placeholder: "#414141",
    },
  };

  const sizeScale = scaleLinear().domain([0, 30]).range([0.5, 2]).clamp(true);

  const labelAlpha = scaleLinear().domain([1.2, 2]).range([0, 1]).clamp(true);
  const labelHeadlineAlpha = scaleLinear().domain([1.2, 3]).range([0.6, 1]).clamp(true);
  const labelSubAlpha = scaleLinear().domain([.2, 1]).range([0, 1]).clamp(true);

  const defaultStyle = {
    background: styleFallback.background,
    fontSize: parseInt(styleFallback.fontSize) - 2,
    lineColor: styleFallback.lineColor,
    lineWidth: parseFloat(styleFallback.lineWidth),
    particleWidth: parseFloat(styleFallback.particleWidth),
    highlightedForeground: styleFallback.highlightedForeground,
    node: {
      note: styleFallback.node.note,
      placeholder: styleFallback.node.placeholder,
    },
  };

  const darkStyle = {
    background: "rgba(0,0,0,0)",
    fontSize: 16,
    lineColor: "#656565",
    lineWidth: 1,
    particleWidth: 1.5,
    highlightedForeground: state.value.localUserColor || "#009dff",
    node: {
      note: "#eaeaea",
      placeholder: "#a1a1a1",
    },
  };

  const model = {
    selectedNodes: new Set(),
    hoverNode: null,
    focusNodes: new Set(),
    focusLinks: new Set(),
    hoverNodes: new Set(),
    hoverLinks: new Set(),
    nodeInfo: {},
    data: {
      nodes: [],
      links: [],
    },

    style: defaultStyle,
  };

  const update = (patch) => {
    patch(model);

    const focusNodes = new Set();
    const focusLinks = new Set();
    const hoverNodes = new Set();
    const hoverLinks = new Set();
    if (model.hoverNode) {
      hoverNodes.add(model.hoverNode);
      const info = model.nodeInfo[model.hoverNode];
      if (info !== undefined) {
        info.neighbors.forEach((neighborId) => focusNodes.add(neighborId));
        info.links.forEach((link) => focusLinks.add(link));
      }
    }
    if (model.selectedNodes) {
      model.selectedNodes.forEach((nodeId) => {
        focusNodes.add(nodeId);
        const info = model.nodeInfo[nodeId];
        if (info !== undefined) {
          info.neighbors.forEach((neighborId) => focusNodes.add(neighborId));
          info.links.forEach((link) => focusLinks.add(link));
        }
      });
    }
    model.focusNodes = focusNodes;
    model.focusLinks = focusLinks;
    model.hoverNodes = hoverNodes;
    model.hoverLinks = hoverLinks;
  };

  const Actions = {
    refresh: (graphInfo) =>
      update((m) => {
        m.nodeInfo = graphInfo.nodes;
        const links = graphInfo.links;

        const nodeIdsToAdd = new Set(Object.keys(m.nodeInfo));
        const nodeIndexesToRemove = new Set();
        m.data.nodes.forEach((node, index) => {
          if (nodeIdsToAdd.has(node.id)) {
            nodeIdsToAdd.delete(node.id);
          } else {
            nodeIndexesToRemove.add(index);
          }
        });

        nodeIndexesToRemove.forEach((index) => {
          m.data.nodes.splice(index, 1);
        });
        nodeIdsToAdd.forEach((nodeId) => {
          if (yNodes.get(nodeId)) {
            m.data.nodes.push({
              id: nodeId,
              y: yNodes.get(nodeId).y,
              x: yNodes.get(nodeId).x,
            });
          }
        });
        m.data.links = links;

        m.hoverNode = m.nodeInfo[m.hoverNode] != null ? m.hoverNode : null;
        m.selectedNodes = new Set(
          Array.from(m.selectedNodes).filter((nId) => m.nodeInfo[nId] != null)
        );

        graph.graphData(m.data);
      }),
    selectNode: (nodeId, isAppend) =>
      update((m) => {
        if (!isAppend) {
          m.selectedNodes.clear();
        }
        if (nodeId != null) {
          m.selectedNodes.add(nodeId);
          const trueNodes = graph.graphData().nodes;
          for (const [key, value] of Object.entries(trueNodes)) {
            if (value.id === nodeId) {
              // eslint-disable-next-line no-unused-vars
              const keyX = key;
              graph.centerAt(value.x, value.y, 300);
              graph.zoom(7, 300);
              break;
            }
          }
        }
      }),
    highlightNode: (nodeId) =>
      update((m) => {
        m.hoverNode = nodeId;
      }),

    updateStyle: (newStyle) => {
      if (!newStyle) {
        return;
      }
      model.style = {
        ...defaultStyle,
        ...newStyle,
        lineColor:
          newStyle.lineColor ||
          (newStyle.node && newStyle.node.note) ||
          defaultStyle.lineColor,
        node: {
          ...defaultStyle.node,
          ...newStyle.node,
        },
      };
      graph.backgroundColor(model.style.background);
    },
  };

  const augmentGraphInfo = (data, noLinks = true) => {
    Object.values(data.nodes).forEach((node) => {
      node.neighbors = [];
      node.links = [];
    });
    if (!noLinks) {
      data.links.forEach((link) => {
        try {
          const a = data.nodes[link.source || link.source.id];
          const b = data.nodes[link.target || link.target.id];
          if (a && b) {
            a.neighbors.push(b.id);
            b.neighbors.push(a.id);
            a.links.push(link);
            b.links.push(link);
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
    return data;
  };

  function updateLinks() {
    const links = [];
    const linksArray = [];
    yLinks.forEach((value, key, map) => {
      linksArray.push(value);
    });
    for (let i = 0; i < linksArray.length; i++) {
      if (linksArray[i].source && linksArray[i].source.id) {
        if (
          yNodes.get(linksArray[i].source.id) &&
          yNodes.get(linksArray[i].target.id)
        ) {
          links.push({
            source: linksArray[i].source.id,
            target: linksArray[i].target.id,
            value: 0,
          });
        }
      } else {
        if (
          yNodes.get(linksArray[i].source) &&
          yNodes.get(linksArray[i].target)
        ) {
          links.push({
            source: linksArray[i].source,
            target: linksArray[i].target,
            value: 0,
          });
        }
      }
    }
    return links;
  }

  const updateAll = (noLinks = false) => {
    const links = updateLinks();

    const nodes = yNodes.toJSON();

    if (!yNodes.get("index")) {
      yNodes.set("index", {
        id: "index",
        group: 1,
        title: "",
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        neighbors: [],
        links: [],
      });
      Actions.selectNode("index");
    }

    function updateDoc(yRootDocs, document) {
      let update = false;
      let doclistitem = {};
      const remote = yRootDocs.getMap().get(document);
      if (remote) doclistitem = remote;
      const nodesLength = Object.entries(nodes).length;
      if (doclistitem.count !== nodesLength) {
        doclistitem.count = nodesLength;
        update = true;
      }
      doclistitem.nodes = Object.values(nodes);
      doclistitem.links = Object.values(links);
      doclistitem.updatedAt = new Date().toISOString();
      if (!doclistitem.guid) doclistitem.guid = document;
      doclistitem.filled = true;
      if (!doclistitem.createdAt)
        doclistitem.createdAt = new Date().toISOString();
      if (doclistitem.count.toString() !== nodesLength.toString()) {
        yRootDocs.getMap().set(document, doclistitem);
      }
    }
    updateDoc(yRootDoc, route.params.document);

    const data = {
      nodes: nodes,
      links: links,
    };

    const graphData = augmentGraphInfo(data, noLinks);
    Actions.refresh(graphData);
    graph.d3ReheatSimulation();
  };

  const zoomIn = () => {
    graph.zoom(graph.zoom() + 1, 300);
  };

  const zoomOut = () => {
    graph.zoom(graph.zoom() - 1, 300);
  };

  const gravityOn = () => {
    graph.d3Force("center", forceCenter(0, 0));
    // graph.zoomToFit(300, 20);
    graph.d3Force("x", forceX(0).strength(0.1));
    graph.d3Force("y", forceY(0).strength(0.1));
    reRenderGraph();
  };

  const gravityOff = () => {
    graph.d3Force("center", forceCenter(0, 0));
    // graph.zoomToFit(300, 20);
    graph.d3Force("x", forceX(0).strength(0.01));
    graph.d3Force("y", forceY(0).strength(0.01));
    reRenderGraph();
  };

  const nodesWithTitle = (title) => {
    const nodes = Object.values(yNodes.toJSON());
    const newNodes = [];
    for (let i = 0; i < nodes.length; i++) {
      if (title.toLowerCase() === getPlainText(nodes[i].title).toLowerCase()) {
        newNodes.push(nodes[i].id);
      }
    }
    return [];
  };

  const hasNodesWithTitle = (title) => {
    const nodes = nodesWithTitle(title);
    if (nodes.length >= 1) {
      return nodes[0];
    }
    return false;
  };

  const doesNodeExist = (id) => {
    const node = yNodes.get(id).getJSON();
    return !!node;
  };

  const createNodeOrUpdate = (target, title, content) => {
    yNodes.set(target, {
      id: target,
      group: 1,
      title: "" + title + "",
      neighbors: [],
      links: [],
    });
    return target;
    // todo: add content
  };

  const directLinkNodes = (source, target) => {
    // console.log(source + "_" + target)
    yLinks.set(source + "_" + target, {
      source: source,
      target: target,
      value: 0,
    });
    return source + "_" + target;
  };

  const createRootNode = (title, content) => {
    const random = Math.floor(new Date().getTime() + Math.random());
    const target = random.toString();
    return createNodeOrUpdate(target, title, content);
    // todo: add content
  };

  const createChildNode = (source, title, content) => {
    const random = Math.floor(new Date().getTime() + Math.random());
    const target = random.toString();
    const result = createNodeOrUpdate(target, title, content);
    directLinkNodes(source, target);
    return result;
    // todo: add content
  };

  const doAction = (coords, node) => {
    if (galaxyState.linkingNodes) galaxyState.linkingNodes = false;
    if (galaxyState.deletingNodes) galaxyState.deletingNodes = false;
    if (galaxyState.unlinkingNodes) galaxyState.unlinkingNodes = false;
    const random = Math.floor(new Date().getTime() + Math.random());
    let id;
    if (node) {
      const fallback = computedNodeId.value || null;
      const source = node.id ? node.id.toString() : fallback;
      const target = state.value.useTimeStampAsNodeId
        ? random.toString()
        : uuid();
      id = target;
      if (source) {
        yNodes.set(target, {
          id: target,
          group: 1,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          title: "" + target + "",
          neighbors: [source],
          links: [source],
        });
        yLinks.set(source + "_" + target, {
          source: source,
          target: target,
          value: 0,
        });
      } else {
        yNodes.set(target, {
          id: target,
          group: 1,
          title: "" + target + "",
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          neighbors: [],
          links: [],
        });
      }
    } else {
      id = random;
      yNodes.set(random.toString(), {
        id: random.toString(),
        group: 1,
        title: "" + random.toString() + "",
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        neighbors: [],
        links: [],
      });
    }
    const links = updateLinks();
    const data = {
      nodes: yNodes.toJSON(),
      links: links,
    };
    const n = yNodes.get(id);
    const graphData = augmentGraphInfo(data, false);
    Actions.refresh(graphData);
    Actions.selectNode(id);
    graph.centerAt(n.x, n.y, 300);
    router.push({
      path: `/${route.params.space}/${route.params.document}/${id}`,
    });
  };

  const initDataviz = () => {
    graph(elem)
      .cooldownTicks(50)
      .graphData(model.data)
      .backgroundColor(model.style.background)
      .linkHoverPrecision(8)
      .d3Force("collide", forceCollide(graph.nodeRelSize()))
      .linkWidth(() => model.style.lineWidth || styleFallback.lineWidth)
      .linkDirectionalParticles(1)
      .linkDirectionalParticleWidth((link) =>
        getLinkState(link, model) === "highlighted"
          ? model.style.particleWidth || styleFallback.particleWidth
          : 0
      )
      .nodeCanvasObject((node, ctx, globalScale) => {
        const info = model.nodeInfo[node.id];
        if (info == null) {
          console.error(`Could not find info for node ${node.id} - skipping`);
          return;
        }
        const size = sizeScale(info.neighbors.length);
        const { fill, border } = getNodeColor(node.id, model);
        const fontSize = (model.style.fontSize / globalScale) * 1.2;
        const nodeState = getNodeState(node.id, model);
        // eslint-disable-next-line no-unused-vars
        const textColor = fill.copy({
          opacity:
            nodeState === "regular"
              ? (info.neighbors.length > 3 ? labelHeadlineAlpha(globalScale) : (info.neighbors.length > 2 ? labelSubAlpha(globalScale) : labelAlpha(globalScale)))
              : nodeState === "highlighted"
              ? 1
              : Math.min(labelAlpha(globalScale), fill.opacity),
          // nodeState === 'highlighted'
          // ? 1
          // : nodeState === 'lessened'
          //   ? Math.min(0.2, labelAlpha)
          //   : labelAlpha
        });

        const borderColor = border.copy({
          opacity:
            nodeState === "regular"
              ? (info.neighbors.length > 3 ? labelHeadlineAlpha(globalScale) : (info.neighbors.length > 2 ? labelSubAlpha(globalScale) : labelAlpha(globalScale)))
              : nodeState === "highlighted"
              ? 1
              : Math.min(labelAlpha(globalScale), fill.opacity),
          // nodeState === 'highlighted'
          // ? 1
          // : nodeState === 'lessened'
          //   ? Math.min(0.2, labelAlpha)
          //   : labelAlpha
        });

        const getPlainText = (obj) => {
          let plainText = "";
          const marks = [];
          if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              plainText += obj[i].text;
            }
          } else {
            plainText = obj;
          }

          return { text: plainText, marks: marks };
        };

        const plainText = getPlainText(info.title);

        const label = plainText.text;
        const marks = JSON.stringify(info.title).toString();

        const matcher =
          /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
        const emoji = label.match(matcher);

        const emojiLabel = label.replace(matcher, "");

        const isWebLink = node.id.startsWith("http");

        // if (marks.length >= 0) console.log(marks)

        const highlighted = marks.includes("highlight");

        function truncate(str, n) {
          return str.length > n ? str.substr(0, n - 1) + "..." : str;
        }

        const transparent = rgb(textColor).copy({ opacity: 0.3 });

        const lessened = nodeState === "lessened";

        if (emoji && !highlighted) {
          Draw(ctx)
            .circle(node.x, node.y, size + 0.5, border)
            .circle(node.x, node.y, size, fill)
            .text(
              truncate(label, 48),
              node.x,
              node.y + size + 1,
              fontSize,
              borderColor
            );
          // .emoji(
          //   emoji[0],
          //   node.x,
          //   node.y - size * 10,
          //     fontSize,
          //   transparent
          // );
        } else if (highlighted && !emoji) {
          Draw(ctx)
            .circle(node.x, node.y, size + 0.5, border)
            .circle(node.x, node.y, size, fill)
            .highlighted(
              truncate(label, 48),
              node.x,
              node.y + size + 1,
              fontSize,
              borderColor,
              lessened,
              labelAlpha(globalScale)
            )
            .text(
              truncate(label, 48),
              node.x,
              node.y + size + 1,
              fontSize,
              borderColor
            );
        } else if (highlighted && emoji) {
          Draw(ctx)
            // .emoji(
            //   emoji[0],
            //   node.x + size / 2.5,
            //   node.y - size * 1 - 0.5,
            //   size * 1.5 + 1,
            //   transparent
            // )
            .highlighted(
              truncate(label, 48),
              node.x,
              node.y + size,
              fontSize,
              borderColor,
              lessened,
              labelAlpha(globalScale)
            )
            .text(
              truncate(label, 48),
              node.x,
              node.y - size + 1,
              fontSize,
              borderColor
            );
        } else if (isWebLink) {
          Draw(ctx)
            .circle(node.x, node.y, size, border)
            .text(
              truncate(label, 48),
              node.x,
              node.y + size + 1,
              fontSize,
              borderColor
            );
        } else {
          Draw(ctx)
            .circle(node.x, node.y, size + 0.5, fill)
            .circle(node.x, node.y, size, border)
            .text(
              truncate(label, 48),
              node.x,
              node.y + size + 1,
              fontSize,
              borderColor
            );
        }
      })
      .linkColor((link) => getLinkColor(link, model))
      .nodePointerAreaPaint((node, color, ctx) => {
        const size = 6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      })
      .onNodeHover((node) => {
        emit("onNodeHover", node);
        Actions.highlightNode(node?.id);
      })
      .onNodeClick((node, evt) => {
        emit("onNodeClick", node);
        if (galaxyState.unlinkingNodes) {
          unLinkNodes(node.id);
          return;
        }
        if (galaxyState.deletingNodes) {
          deleteNode(node.id);
          return;
        }
        if (osKey(evt)) {
          invoke('create_child_window', { id: node.id }).then(r => {
            if (r) {
              console.error(r);
            }
          });
          // const webview = new WebviewWindow(
          //   route.params.space + "/" + docId + "/" + node.id,
          //   {
          //     width: 600,
          //     height: 400,
          //     title: node.label,
          //     x: evt.screenX - 300,
          //     y: evt.screenY - 200,
          //     visible: false,
          //     resizable: true,
          //     decorations: true,
          //     transparent: false,
          //     fullscreen: false,
          //     fileDropEnabled: true,
          //     alwaysOnTop: false,
          //   }
          // );
          // webview
          //   .show()
          //   .then(() => {})
          //   .catch((err) => {
          //     webview.show();
          //     console.log(err);
          //   });
        } else {
          node.fx = node.x;
          node.fy = node.y;
          if (galaxyState.linkingNodes) {
            if (galaxyState.firstNode && galaxyState.firstNode.length > 3) {
              linkNodesPermanent(galaxyState.firstNode, node.id);
            } else {
              galaxyState.firstNode = node.id;
            }
          }
          graph.centerAt(node.x, node.y, 300);
          Actions.selectNode(node.id, false);
          // openModal(node.id)
          router.push({
            path: `/${route.params.space}/${route.params.document}/${node.id}`,
          });
        }
      })
      .onZoom((link, event) => {
        emit("onZoom");
      })
      .onZoomEnd((link, event) => {
        emit("onZoomEnd");
      })
      .onLinkHover((link, event) => {
        emit("onLinkHover");
      })
      .onLinkClick((link, event) => {
        emit("onLinkClick");
        if (galaxyState.unlinkingNodes) {
          deleteLink(link.source.id + "_" + link.target.id);
        }
      })
      .onLinkRightClick((link, event) => {
        emit("onLinkRightClick");
      })
      .onEngineTick((link, event) => {
        emit("onEngineTick");
      })
      .onEngineStop((link, event) => {
        emit("onEngineStop");
      })
      .onBackgroundClick(() => {
        emit("onBackgroundClick");
        Actions.selectNode(undefined, false);
        router.push({
          path: `/${route.params.space}/${route.params.document}`,
        });
      })
      .onBackgroundRightClick((event) => {
        emit("onBackgroundRightClick", event);
        const coords = graph.screen2GraphCoords(event.x, event.y);
        doAction(coords);
      })
      .onNodeRightClick((node) => {
        emit("onNodeRightClick", node);
        doAction(false, node);
      })
      .onNodeDrag((dragNode) => {
        emit("onNodeDrag", dragNode);
        // dragSourceNode = dragNode;
        // for (let node of yNodes.getJSON()) {
        //   if (dragNode === node) {
        //     continue;
        //   }
        //   // close enough: snap onto node as target for suggested link
        //   if (!interimLink && distance(dragNode, node) < snapInDistance) {
        //     setInterimLink(dragSourceNode, node);
        //   }
        //   // close enough to other node: snap over to other node as target for suggested link
        //   if (interimLink && node !== interimLink.target && distance(dragNode, node) < snapInDistance) {
        //     removeLink(interimLink);
        //     setInterimLink(dragSourceNode, node);
        //   }
        // }
        // // far away enough: snap out of the current target node
        // if (interimLink && distance(dragNode, interimLink.target) > snapOutDistance) {
        //   removeInterimLinkWithoutAddingIt();
        // }
      })
      .onNodeDragEnd((node) => {
        emit("onNodeDragEnd", node);
        // dragSourceNode = null;
        // interimLink = null;
        // const yNode = yNodes.get(node.id.toString())
        if (node.fx && node.fy) {
          node.fx = undefined;
          node.fy = undefined;
          // yNodes.set(node.id.toString(), yNode)
        } else {
          node.fx = node.x;
          node.fy = node.y;
          // yNodes.set(node.id.toString(), yNode)
        }
      });
  };

  const isWithUser = (id) => {
    const currentNodeUsers = [];
    const currentStates =
      hocuspocusStates.hocuspocus.awareness.length > 1
        ? Object.values(hocuspocusStates.hocuspocus.awareness)
        : hocuspocusStates.rtc.awareness.length > 1
        ? Object.values(hocuspocusStates.rtc.awareness)
        : [];
    if (currentStates) {
      for (let i = 0; i < currentStates.length; i++) {
        const currentUser = currentStates[i].user;
        if (
          currentUser &&
          currentUser.latestDocument &&
          currentUser.latestNode
        ) {
          if (
            currentUser.latestNode === id &&
            currentUser.latestDocument === route.params.document
          ) {
            currentNodeUsers.push(currentUser);
          }
        }
      }
    }
    // if (rtcStates) {
    //   for (let i = 0; i < rtcStates.length; i++) {
    //     const currentUser = rtcStates[i].user;
    //     if (
    //       currentUser &&
    //       currentUser.latestDocument &&
    //       currentUser.latestNode
    //     ) {
    //       if (currentUser.latestNode === id) {
    //         currentNodeUsers.push(currentUser);
    //       }
    //     }
    //   }
    // }
    return currentNodeUsers;
  };

  function getNodeColor(nodeId, model) {
    const info = model.nodeInfo[nodeId];
    const style = model.style;
    const textFill = rgb(style.node[info.type ?? "note"] ?? style.node.note);
    let typeFill = rgb(style.node[info.type ?? "note"] ?? style.node.note);
    const users = state.value.showOtherColors ? isWithUser(nodeId) : [];
    if (users.length >= 1) {
      typeFill = rgb(users[0].color);
    }
    if (nodeId === computedNodeId.value) {
      typeFill = rgb(state.value.localUserColor);
    }
    switch (getNodeState(nodeId, model)) {
      case "regular":
        let transparent0 = rgb(textFill).copy({ opacity: 0.7});
        let transparentTypeFill0 = rgb(typeFill).copy({ opacity: 0.7 });
        return { fill: transparentTypeFill0, text: transparent0, border: transparent0 };
      case "lessened":
        // eslint-disable-next-line no-case-declarations
        let transparent = rgb(textFill).copy({ opacity: 0.3 });
        let transparentTypeFill = rgb(typeFill).copy({ opacity: 0.3 });
        return {
          fill: transparent,
          text: transparentTypeFill,
          border: transparentTypeFill,
        };
      case "focused":
        return {
          fill: rgb(style.highlightedForeground),
          text: textFill,
          border: typeFill,
        };
      case "highlighted":
        return { fill: textFill, text: textFill, border: typeFill };
      default:
        throw new Error("Unknown type for node", nodeId);
    }
  }

  function getLinkColor(link, model) {
    const style = model.style;
    switch (getLinkState(link, model)) {
      case "regular":
        return style.lineColor;
      case "highlighted":
        return style.highlightedForeground;
      case "focused":
        return style.highlightedForeground;
      case "lessened":
        return hsl(style.lineColor).copy({ opacity: 0.5 });
      default:
        throw new Error("Unknown type for link", link);
    }
  }

  function getNodeState(nodeId, model) {
    return model.selectedNodes.has(nodeId)
      ? "highlighted"
      : model.hoverNode === nodeId
      ? "focused"
      : model.focusNodes.size === 0
      ? "regular"
      : model.focusNodes.has(nodeId)
      ? "regular"
      : "lessened";
  }

  function getLinkState(link, model) {
    return model.focusNodes.size === 0
      ? "regular"
      : model.focusLinks.has(link)
      ? "highlighted"
      : "lessened";
  }

  const Draw = (ctx) => ({
    circle: function (x, y, radius, color) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
      return this;
    },
    ring: function (x, y, radius, color) {
      ctx.beginPath();
      ctx.arc(x, y, radius * 2, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
      return this;
    },
    text: function (text, x, y, size, color) {
      ctx.font = `${size}px Sans-Serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      return this;
    },
    emoji: function (text, x, y, size, color) {
      ctx.font = `${size}px Sans-Serif`;
      ctx.textAlign = "center";
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      return this;
    },
    highlighted: function (text, x, y, size, color, lessened, alpha) {
      ctx.font = `${size}px Sans-Serif`;
      ctx.fillStyle = "rgba(255,251,0," + (alpha - 0.2) + ")";
      if (lessened) ctx.fillStyle = "rgba(255,251,0," + (alpha - 0.2) + ")";
      const width = ctx.measureText(text).width;
      ctx.fillRect(x - width / 2, y, width, parseInt(ctx.font, 0) * 1.1);
      return this;
    },
  });

  const unsetID = () => {
    router.push(`/${route.params.space}/${route.params.document}/`);
  };

  const linkNodes = () => {
    if (galaxyState.deletingNodes) galaxyState.deletingNodes = false;
    if (galaxyState.unlinkingNodes) galaxyState.unlinkingNodes = false;
    if (computedNodeId.value && computedNodeId.value.length > 3) {
      galaxyState.firstNode = computedNodeId.value;
    }
    galaxyState.linkingNodes = !galaxyState.linkingNodes;
    if (!galaxyState.linkingNodes) {
      galaxyState.firstNode = null;
    }
  };

  const unlinkNodes2 = () => {
    if (galaxyState.deletingNodes) galaxyState.deletingNodes = false;
    if (galaxyState.linkingNodes) galaxyState.linkingNodes = false;
    if (computedNodeId.value && computedNodeId.value.length > 3) {
      unLinkNodes(computedNodeId.value);
    } else {
      galaxyState.unlinkingNodes = !galaxyState.unlinkingNodes;
    }
  };

  const deleteNodes2 = () => {
    if (galaxyState.linkingNodes) galaxyState.linkingNodes = false;
    if (galaxyState.unlinkingNodes) galaxyState.unlinkingNodes = false;
    if (computedNodeId.value && computedNodeId.value.length > 3) {
      deleteNode(computedNodeId.value);
    } else {
      galaxyState.deletingNodes = !galaxyState.deletingNodes;
    }
  };

  const linkNodesPermanent = (first, second) => {
    if (first && second) {
      galaxyState.firstNode = undefined;
      galaxyState.secondNode = undefined;
      yLinks.set(first + "_" + second, {
        source: first,
        target: second,
        value: 0,
      });
    }
    galaxyState.linkingNodes = false;
  };

  const unLinkNodes = (id) => {
    if (id) {
      yNodes.forEach((value, key) => {
        const neighbors = value.neighbors;
        const links = value.links;
        for (let i = 0; i < neighbors.length; i++) {
          if (neighbors[i] === id) {
            neighbors.splice(i, 1);
          }
        }
        for (let i = 0; i < links.length; i++) {
          if (
            links[i].source === id ||
            links[i].source.id === id ||
            links[i].target === id ||
            links[i].target.id === id
          ) {
            links.splice(i, 1);
          }
        }
      });

      yLinks.forEach((value, index) => {
        if (value.target === id || value.source === id) {
          yLinks.delete(index, 1);
          updateAll(true);
        }
      });

      updateAll(false);
    }
  };

  const deleteLink = (id) => {
    console.log(id);
    if (id) yLinks.delete(id.toString());
  };

  const deleteNode = (id) => {
    if (id && id !== "index") {
      yNodes.delete(id.toString());
      yNodes.forEach((value, key) => {
        const neighbors = value.neighbors;
        const links = value.links;
        for (let i = 0; i < neighbors.length; i++) {
          if (neighbors[i] === id) {
            neighbors.splice(i, 1);
          }
        }
        for (let i = 0; i < links.length; i++) {
          if (
            links[i].source === id ||
            links[i].source.id === id ||
            links[i].target === id ||
            links[i].target.id === id
          ) {
            links.splice(i, 1);
          }
        }
      });
      updateAll(false);
      unsetID();
    } else if (id && id === "index") {
      emit("deleteIndex");
    }
  };

  const unfixAll = () => {
    graph.graphData().nodes.forEach((value, index, array) => {
      if (value.fx && value.fy) {
        value.fx = undefined;
        value.fy = undefined;
      }
    });
    updateAll(false);
  };

  function Escape() {
    graph.d3Force("center", forceCenter(0, 0));
    graph.zoomToFit(300, 20);
    if (computedNodeId.value) {
      const trueNodes = graph.graphData().nodes;
      for (const [key, value] of Object.entries(trueNodes)) {
        // eslint-disable-next-line no-unused-vars
        const keyX = key;
        if (value.id === computedNodeId.value) {
          graph.d3Force("center", forceCenter(0, 0));
          graph.centerAt(value.x, value.y, 300);
          break;
        }
      }
      Actions.selectNode(computedNodeId.value, false);
    }
  }

  const reRenderGraph = () => {
    if (graph) graph._destructor();

    initDataviz();

    unfixAll();

    updateAll();

    jsonDocuments.value = Object.entries(yNodes.toJSON());

    graph.width(window.innerWidth);
    graph.height(window.innerHeight);

    const initialZoom = ref(true);

    state.value.isLoading = false;

    // invoke("close_splashscreen");

    graph.onEngineStop(() => {
      const trueNodes = graph.graphData().nodes;
      if (initialZoom.value) {
        if (trueNodes.length > 1) {
          graph.d3Force("center", forceCenter(0, 0))
          graph.d3Force('charge').strength(-100);
          graph.zoomToFit(50, 20);
          initialZoom.value = false;
          if (computedNodeId.value) {
            for (const [key, value] of Object.entries(trueNodes)) {
              // eslint-disable-next-line no-unused-vars
              const keyX = key;
              if (value.id === computedNodeId.value) {
                graph.d3Force("center", forceCenter(0, 0));
                graph.centerAt(value.x, value.y, 50);
                break;
              }
            }
            Actions.selectNode(computedNodeId.value, false);
          }
        } else {
          graph.zoomToFit(50, 0);
        }
      }
      // invoke("close_splashscreen");
      graph.cooldownTicks(20);
    });

    window.addEventListener("resize", () => {
      // const orient = screen.orientation.angle
      //   if (orient === 180 || orient === -180) {
      //     graph.width(window.innerHeight )
      //     graph.height(window.innerWidth)
      //   } else {
      //   }

      graph.width(window.innerWidth);
      graph.height(window.innerHeight);
    });

    window.addEventListener("orientationchange", function () {
      // const orient = screen.orientation.angle
      // if (orient === 180 || orient === -180) {
      //   graph.width(window.innerHeight )
      //   graph.height(window.innerWidth)
      // } else {
      //   graph.width(window.innerWidth);
      //   graph.height(window.innerHeight);
      // }

      graph.width(window.innerWidth);
      graph.height(window.innerHeight);
    });
  };

  onMounted(() => {
    elem = document.getElementById(container);
    if (elem !== undefined) {
      yNodes.observe(() => {
        updateAll();
        jsonDocuments.value = Object.entries(yNodes.toJSON());
      });

      yLinks.observe(() => {
        updateAll();
      });

      watch(computedNodeId, (before, after) => {
        if (galaxyState.autoLink) {
          yLinks.set(before + "_" + after, {
            source: before,
            target: after,
            value: 0,
          });
        }
      });

      watch(computedHocuspocusStates, () => {
        // updateAll();
      });

      watch(computedRtcStates, () => {
        // updateAll();
      });

      const comUseDarkInterface = computed(() => state.value.darkInterface);

      watch(comUseDarkInterface, () => {
        isDark.value = comUseDarkInterface.value;
        if (comUseDarkInterface.value) Actions.updateStyle(darkStyle);
        if (!comUseDarkInterface.value) Actions.updateStyle(defaultStyle);
      });

      watch(isDark, () => {
        if (isDark.value) Actions.updateStyle(darkStyle);
        if (!isDark.value) Actions.updateStyle(defaultStyle);
      });

      const comUseStrongGravity = computed(() => state.value.useStrongGravity);

      watch(comUseStrongGravity, () => {
        if (comUseStrongGravity.value) {
          gravityOn();
        } else {
          gravityOff();
        }
      });

      if (!isDark.value) {
        Actions.updateStyle(defaultStyle);
      } else {
        Actions.updateStyle(darkStyle);
      }
      if (!comUseStrongGravity.value) {
        gravityOff();
      } else {
        gravityOn();
      }

      reRenderGraph();
    }
  });

  onBeforeUnmount(() => {
    graph._destructor();
  });

  watch(computedNodeId, () => {
    if (!computedNodeId.value) {
      Actions.selectNode(undefined, false);
      emit("hide");
    } else {
      // if (!doesNodeExist(nodeId)) {
      //   const random = nodeId
      //   yNodes.set(random, {
      //     id: random,
      //     group: 1,
      //     title: '' + random + '',
      //     neighbors: [],
      //     links: []
      //   })
      // }
      Actions.selectNode(computedNodeId.value, false);
      emit("show");
    }
  });

  return {
    galaxyState,
    Actions,
    graph,
    update,
    augmentGraphInfo,
    updateLinks,
    updateAll,
    zoomIn,
    zoomOut,
    gravityOn,
    gravityOff,
    nodesWithTitle,
    hasNodesWithTitle,
    doesNodeExist,
    createNodeOrUpdate,
    directLinkNodes,
    createRootNode,
    createChildNode,
    doAction,
    initDataviz,
    isWithUser,
    getNodeColor,
    getLinkColor,
    getNodeState,
    getLinkState,
    Draw,
    unsetID,
    linkNodes,
    unlinkNodes2,
    deleteNodes2,
    linkNodesPermanent,
    unLinkNodes,
    deleteNode,
    unfixAll,
    Escape,
    reRenderGraph,
    jsonDocuments,
    yUndoManagerNodes,
  };
};
