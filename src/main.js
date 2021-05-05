import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import App from "./App.vue";
import router from "./router";
import store from "./store";


const app = createApp({})
// for auto register component with "Base..." prefix name.
const requireComponent = require.context(
  './components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  app.component(componentName, componentConfig.default || componentConfig)
})

import { createApp } from "vue";
createApp(App).use(store).use(router).mount("#app");
/*new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')*/