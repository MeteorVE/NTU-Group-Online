import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { VueMasonryPlugin } from 'vue-masonry/src/masonry-vue3.plugin'
import mitt from 'mitt' // VueMasonryPlugin Dependencies

import { createApp } from 'vue'
//require('dotenv').config({ path: '../.env' })
//console.log(require('dotenv').config({  path: '../.env' }))
console.log(process.env.VUE_APP_BACKEND)
console.log(process.env.VUE_APP_WS_SERVER)
console.log(process.env.VUE_APP_TEST)


// Way 1
// const app = createApp(App)
//   .use(store)
//   .use(router)
//   .use(ElementPlus)
//   .use(VueMasonryPlugin)
//   .mount('#app')

// Way 2
let app = createApp(App)
const emitter = mitt()
app.config.globalProperties.emitter = emitter
app.use(store).use(router).use(ElementPlus).use(VueMasonryPlugin).mount('#app')

// for auto register component with "Base..." prefix name.
const requireComponent = require.context(
  './components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  app.component(componentName, componentConfig.default || componentConfig)
})

/*new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')*/
