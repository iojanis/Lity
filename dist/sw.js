if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return i[e]||(r=new Promise((async r=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=r}else importScripts(e),r()}))),r.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},r=(r,i)=>{Promise.all(r.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(r)};self.define=(r,s,n)=>{i[r]||(i[r]=Promise.resolve().then((()=>{let i={};const o={uri:location.origin+r.slice(1)};return Promise.all(s.map((r=>{switch(r){case"exports":return i;case"module":return o;default:return e(r)}}))).then((e=>{const r=n(...e);return i.default||(i.default=r),i}))})))}}define("./sw.js",["./workbox-78503f86"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.3875fb88.js",revision:"2f0445a55c07c391eb737b91232d91bc"},{url:"assets/index.80362192.css",revision:"2ab261ca553a43e046b9935418f46587"},{url:"assets/vendor.6f949c86.js",revision:"7e4501a9e86090632fb5c816bdf45d19"},{url:"font/inter.css",revision:"677211871b23efbea5513ccfc3026a6f"},{url:"index.html",revision:"1459c98cbea81df02937feb0992ddb33"},{url:"remixicon.css",revision:"7c3f70b00c96391ff80b001309dadb95"},{url:"favicon.ico",revision:"5a22f8cb86a32e0d6cf50b198e2e1600"},{url:"robots.txt",revision:"f77c87f977e0fcce05a6df46c885a129"},{url:"apple-touch-icon.png",revision:"568e712b8fc0b183b9869bb2b6113e01"},{url:"android-chrome-192x192.png",revision:"42c9e606006764110ff5d5ed0a757377"},{url:"android-chrome-512x512.png",revision:"505f0e039be0c10f28e960184467e79a"},{url:"manifest.webmanifest",revision:"e0cf5640a64479b946ba1510ea5a6fb4"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
