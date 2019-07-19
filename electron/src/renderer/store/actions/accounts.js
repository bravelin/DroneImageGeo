import types from '../constants/types'
export default {
    // 控制添加账号弹窗是否显示
    [types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE_SYNC] ({ commit }, payload) {
        commit(types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE, payload)
    },
    // 控制重置账号密码的确认弹窗是否显示
    [types.ACCOUNTS_SWITCH_RESET_PW_CONFIRM_VISIBLE_SYNC] ({ commit }, payload) {
        commit(types.ACCOUNTS_SWITCH_RESET_PW_CONFIRM_VISIBLE, payload)
    },
    // 控制删除账号的确认弹窗是否显示
    [types.ACCOUNTS_SWITCH_DEL_CONFIRM_VISIBLE_SYNC] ({ commit }, payload) {
        commit(types.ACCOUNTS_SWITCH_DEL_CONFIRM_VISIBLE, payload)
    },
    // 获取账户列表
    [types.SET_ACCOUNTS_DATA_LIST_SYNC] ({ commit }, payload) {
        commit(types.SET_ACCOUNTS_DATA_LIST, payload)
    }
}
