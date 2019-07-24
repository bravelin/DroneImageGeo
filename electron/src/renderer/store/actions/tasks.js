import types from '../constants/types'
export default {
    // 获取账户列表
    [types.SET_TASKS_DATA_LIST_SYNC] ({ commit }, payload) {
        commit(types.SET_TASKS_DATA_LIST, payload)
    }
}
