import Drag from './Drag.vue'
import Drop from './Drop.vue'

// Install the components
export function install(Vue) {
  Vue.component('Drag', Drag)
  Vue.component('Drop', Drop)
}

// Expose the components
export { Drag, Drop }

/* -- Plugin definition & Auto-install -- */
/* You shouldn't have to modify the code below */

// Plugin
const plugin = {
  /* eslint-disable no-undef */
  version: '1',
  install,
}

export default plugin

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}
