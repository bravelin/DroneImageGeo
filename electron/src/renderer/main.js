import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ajax from '@/lib/ajax'

// 公用组件
import PlaneSubTab from '@/components/PlaneSubTab'
import PlaneSubTitle from '@/components/PlaneSubTitle'
import Dialog from '@/components/Dialog'
import DataSelector from '@/components/DataSelector'

// 公用组件
Vue.component('PlaneSubTab', PlaneSubTab)
Vue.component('PlaneSubTitle', PlaneSubTitle)
Vue.component('Dialog', Dialog)
Vue.component('DataSelector', DataSelector)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$ajax = ajax
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
