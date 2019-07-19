import actions from '../actions/global'
import mutations from '../mutations/global'

const state = {
    winHeight: 0, // 当前窗口高度
    winWidth: 0, // 窗口宽度
    showMessageTip: false,
    tip: '',
    currRouter: { // 当前页面路由信息
        from: '',
        to: '',
        query: null
    },
    loading: false, // loading的状态
    // 与当前登录用户的相关状态
    userToken: '', // 用户token
    userId: '', // 用户ID
    userName: '', // 登录名
    userRole: '0', // 角色
    realName: '', // RealName
    loginRemember: true, // 是否记住账号信息
    changePwDialogStatus: false // 修改当前账号的密码，名称
}

export default {
    state,
    mutations,
    actions
}
