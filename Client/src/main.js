import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/index'
import ajax from '@/lib/ajax'

// 公用组件
import BracketButton from '@/components/BracketButton'
import PlaneSubTab from '@/components/PlaneSubTab'
import PlaneSubTitle from '@/components/PlaneSubTitle'
import Dialog from '@/components/Dialog'
import DataSelector from '@/components/DataSelector'

// 公用组件
Vue.component('BracketButton', BracketButton)
Vue.component('PlaneSubTab', PlaneSubTab)
Vue.component('PlaneSubTitle', PlaneSubTitle)
Vue.component('Dialog', Dialog)
Vue.component('DataSelector', DataSelector)

Vue.config.productionTip = false
Vue.prototype.$ajax = ajax
new Vue({ router, store, render: h => h(App) }).$mount('#app')
