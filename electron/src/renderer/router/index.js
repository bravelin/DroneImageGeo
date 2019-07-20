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
            path: '/guide',
            name: 'guide', // 说明引导
            component: require('@/views/guide/Main').default
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
            path: '/addGeo',
            name: 'addGeo', // 图片工具 - 添加经纬度
            component: require('@/views/tools/addGeo/Main').default
        },
        {
            path: '/previewTiles',
            name: 'previewTiles', // 图片工具 - 预览谷歌瓦片地图
            component: require('@/views/tools/previewTiles/Main').default
        },
        {
            path: '/rectifyGeo',
            name: 'rectifyGeo', // 图片工具 - 经纬度纠偏
            component: require('@/views/tools/rectifyGeo/Main').default
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
        query: to.query
    })
    if (to.name && to.name !== from.name) {
        store.dispatch(types.SWITCH_LOADING_SYNC, true)
    }
    next(true)
})

export default router
