import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import modules from './modules'
import StorageTags from '@/lib/storageTags'
import TabTypes from '@/views/tabs'

Vue.use(Vuex)
const ls = localStorage
export default new Vuex.Store({
    state: {
        winHeight: 0, // 当前窗口高度
        winWidth: 0, // 窗口宽度
        showMessageTip: false,
        tip: '',
        currRouter: { // 当前页面路由信息
            from: '',
            to: '',
            query: null,
            instance: null // 路由实例
        },
        loading: false, // loading的状态
        // 与当前登录用户的相关状态
        userToken: ls.getItem(StorageTags.userToken) || '', // 用户token
        userId: ls.getItem(StorageTags.userId) || '', // 用户ID
        userName: ls.getItem(StorageTags.userName) || '', // 登录名
        userRole: ls.getItem(StorageTags.userRole) || '0', // 角色

        leftPlaneTab: '', // 左侧plane当前激活的Tab
        changePwDialogStatus: false // 修改密码弹窗状态
    },
    mutations,
    actions,
    modules
})
