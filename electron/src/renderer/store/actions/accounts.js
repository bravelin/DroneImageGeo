import types from '../constants/types'
export default {
    // 控制添加账号弹窗是否显示
    [types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE_SYNC] ({ commit }, payload) {
        commit(types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE, payload)
    }
}
