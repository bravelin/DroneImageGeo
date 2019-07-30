import types from '../constants/types'
export default {
    [types.SWITCH_LOADING] (state, isShow) {
        state.loading = isShow
    },
    [types.SET_WINDOW_SIZE] (state, { winWidth, winHeight }) {
        state.winHeight = winHeight
        state.winWidth = winWidth
    },
    [types.SET_CURR_ROUTER] (state, payload) {
        const currRouter = state.currRouter
        currRouter.from = payload.from
        currRouter.to = payload.to
        currRouter.query = payload.query
        if (!currRouter.to) {
            state.loading = false
        }
    },
    [types.UPDATE_ACCOUNT] (state, payload) {
        state.realName = payload.realName
    },
    [types.UPDATE_USER_INFO] (state, payload) {
        state.userToken = payload.userToken
        state.userId = payload.userId
        state.userName = payload.userName
        state.realName = payload.realName
        state.userRole = payload.userRole
        state.loginRemember = payload.loginRemember
    },
    [types.CLEAR_USER_INFO] (state) {
        state.userToken = ''
        state.userId = ''
        state.userRole = ''
    },
    [types.SWITCH_MESSAGE_TIP] (state, payload) {
        state.showMessageTip = payload.show
        state.tip = payload.tip
    },
    [types.SWITCH_CHANGE_PW_DIALOG_STATUS] (state, isShow) {
        if (state.changePwDialogStatus == isShow) {
            state.changePwDialogStatus = !state.changePwDialogStatus
        } else {
            state.changePwDialogStatus = isShow
        }
    },
    [types.SWITCH_SETTING_DIALOG_STATUS] (state, isShow) {
        if (state.settingDialogStatus == isShow) {
            state.settingDialogStatus = !state.settingDialogStatus
        } else {
            state.settingDialogStatus = isShow
        }
    }
}
