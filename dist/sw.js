if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,o)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let c={};const t=e=>n(e,s),f={module:{uri:s},exports:c,require:t};i[s]=Promise.all(r.map((e=>f[e]||t(e)))).then((e=>(o(...e),c)))}}define(["./workbox-3ea082d2"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.a496b7b8.css",revision:null},{url:"assets/index.b8bd414c.js",revision:null},{url:"font/inter.css",revision:"677211871b23efbea5513ccfc3026a6f"},{url:"font/remixicon.css",revision:"a8aec561d3b9b905472b815cb2b818c2"},{url:"index.html",revision:"b1fdd6f119807d33f5955889e6f205a4"},{url:"favicon.ico",revision:"5a22f8cb86a32e0d6cf50b198e2e1600"},{url:"robots.txt",revision:"f77c87f977e0fcce05a6df46c885a129"},{url:"apple-touch-icon.png",revision:"568e712b8fc0b183b9869bb2b6113e01"},{url:"android-chrome-192x192.png",revision:"42c9e606006764110ff5d5ed0a757377"},{url:"android-chrome-512x512.png",revision:"505f0e039be0c10f28e960184467e79a"},{url:"manifest.webmanifest",revision:"e0cf5640a64479b946ba1510ea5a6fb4"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
