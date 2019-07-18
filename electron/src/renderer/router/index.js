import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import types from '@/store/constants/types'

Vue.use(Router)
const router = new Router({
    mode: 'hash',
    base: '',
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            name: 'login', // 登录
            component: require('@/views/login/Main').default
        },
        {
            path: '/tasks',
            name: 'tasks', // 任务列表
            component: require('@/views/tasks/Main').default
        },
        {
            path: '/accounts',
            name: 'accounts', // 账号管理
            component: require('@/views/accounts/Main').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})

router.beforeEach((to, from, next) => {
    store.dispatch(types.SET_CURR_ROUTER_SYNC, {
        from: from.name,
        to: to.name,
        query: to.query,
        instance: router
    })
    if (to.name && to.name !== from.name) {
        store.dispatch(types.SWITCH_LOADING_SYNC, true)
    }
    next(true)
})

export default router
