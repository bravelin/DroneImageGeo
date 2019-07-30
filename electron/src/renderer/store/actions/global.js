import types from '../constants/types'
export default {
    [types.SET_WINDOW_SIZE_SYNC] ({ commit }, payload) {
        commit(types.SET_WINDOW_SIZE, payload)
    },
    [types.SWITCH_LOADING_SYNC] ({ commit }, payload) {
        commit(types.SWITCH_LOADING, payload)
    },
    [types.SET_CURR_ROUTER_SYNC] ({ commit }, payload) {
        commit(types.SET_CURR_ROUTER, payload)
    },
    [types.UPDATE_USER_INFO_SYNC] ({ commit }, payload) {
        commit(types.UPDATE_USER_INFO, payload)
    },
    [types.CLEAR_USER_INFO_SYNC] ({ commit }, payload) {
        commit(types.CLEAR_USER_INFO, payload)
    },
    [types.UPDATE_ACCOUNT_SYNC] ({ commit }, payload) {
        commit(types.UPDATE_ACCOUNT, payload)
    },
    [types.SWITCH_MESSAGE_TIP_SYNC] ({ commit }, payload) {
        commit(types.SWITCH_MESSAGE_TIP, payload)
    },
    [types.SWITCH_CHANGE_PW_DIALOG_STATUS_SYNC] ({ commit }, payload) {
        commit(types.SWITCH_CHANGE_PW_DIALOG_STATUS, payload)
    },
    [types.SWITCH_SETTING_DIALOG_STATUS_SYNC] ({ commit }, payload) {
        commit(types.SWITCH_SETTING_DIALOG_STATUS, payload)
    }
}
