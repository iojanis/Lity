<template>
<!--  <app-reload-prompt />-->
  <router-view></router-view>
</template>

<script setup lang="ts">
// import AppReloadPrompt from "./components/AppMobileReloadPrompt.vue";
// import "@benrbray/prosemirror-math/style/math.css";
import "remixicon/fonts/remixicon.css";
import "katex/dist/katex.min.css";
</script>

<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;

.hs::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge add Firefox */
.hs {
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
}

#app {
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
}

.splitpanes {
  &__pane {
    justify-content: center;
    align-items: center;
    display: flex;
  }

  &__splitter {
    z-index: 49;
    background-color: rgb(106, 107, 110);
    position: relative;
  }

  &__splitter:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transition: 0.4s;
  }
  &--vertical > &__splitter:before {
    left: -5px;
    right: -5px;
  }
  &--horizontal > &__splitter:before {
    top: -5px;
    bottom: -5px;
  }
  &__splitter:hover:before {
    background-color: rgba(128, 128, 128, 0.2);
  }
}

@media screen and (display-mode: standalone) {
  .top-blurred {
    height: 88px !important;
  }
}

::-webkit-scrollbar {
  display: none;
}

body {
  overflow: hidden;
  width: 100%;
  height: 100vh;
}

html.dark {
  background: #1c1c1d !important;
}

html {
  overflow: hidden;
  background: transparent !important;
}

.force-graph-container,
.force-graph-container > canvas {
  min-height: 100vh !important;
}

.pane-shadow {
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}

.visible-pane {
  /*padding: env(safe-area-inset-top) 0 0 env(safe-area-inset-left);*/
  bottom: calc(90px + (env(safe-area-inset-top)));
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}

.top-pane {
  /*padding: env(safe-area-inset-top) 0 0 env(safe-area-inset-left);*/
  top: calc(10px + (env(safe-area-inset-top)));
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}

@media screen and (display-mode: standalone) {
  .visible-pane {
    /*padding: env(safe-area-inset-top) 0 0 env(safe-area-inset-left);*/
    bottom: calc(46px + (env(safe-area-inset-top)));
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  }
  .invisible-pane {
    /*padding: env(safe-area-inset-top) 0 0 env(safe-area-inset-left);*/
    bottom: calc(70px + (env(safe-area-inset-top)));
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  }
}

.dark-bg {
  background: #1c1c1d;
}

.less-dark-bg2 {
  background: rgba(15, 16, 16, 0.5) !important;
  backdrop-filter: blur(30px) !important;
  -webkit-backdrop-filter: blur(30px) !important;
}

.top-menu {
  max-height: calc(100vh - 170px);
}

.cupertino-pane-wrapper {
  overflow: hidden;
}

html
> body
> #app
> div
> div
> div
> div.cupertino-pane-wrapper.rendered
> div {
  max-width: calc(100% - 14px) !important;
  max-height: 100% !important;
}

.cupertino-pane.editor-pane {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: rgba(255, 255, 255, 1);
  max-height: 100% !important;
}

.blurry {
  //backdrop-filter: blur(15px) !important;
  //-webkit-backdrop-filter: blur(15px) !important;
  background: rgba(255, 255, 255, 0) !important;
}

.blurry-dark {
  background: rgba(12, 12, 12, 0) !important;
  //backdrop-filter: blur(15px) !important;
  //-webkit-backdrop-filter: blur(15px) !important;
}

/*.cupertino-pane {*/
/*  height: 100% !important;*/
/*}*/

.cupertino-pane.editor-pane.dark {
  background: rgba(12, 12, 12, 1);
}

.destroy-button {
  display: none;
}

/*.cupertino-pane.editor-pane {*/
/*  border-top-left-radius: 8px;*/
/*  border-top-right-radius: 8px;*/
/*  background: rgba(255, 255, 255, 1) !important;*/
/*}*/

.pane {
  padding-top: 0px !important;
  cursor: default!important;
  background: none !important;
}

//.blur {
//  background: rgba(255, 255, 255, 0.001);
//  backdrop-filter: blur(15px);
//  -webkit-backdrop-filter: blur(15px);
//}

.draggable {
  height: 15px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 100ms;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

kbd {
  margin: 2px 0.1em;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.13);
  color: rgb(255, 255, 255);
  font-family: Arial,Helvetica,sans-serif;
  display: inline-block;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
}
</style>
