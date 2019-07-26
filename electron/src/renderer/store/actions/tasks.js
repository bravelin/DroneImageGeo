import types from '../constants/types'
export default {
    // 设置数据列表
    [types.SET_TASKS_DATA_LIST_SYNC] ({ commit }, payload) {
        commit(types.SET_TASKS_DATA_LIST, payload)
    },
    // 控制添加账号弹窗是否显示
    [types.TASKS_SWITCH_ADD_DIALOG_VISIBLE_SYNC] ({ commit }, payload) {
        commit(types.TASKS_SWITCH_ADD_DIALOG_VISIBLE, payload)
    },
    // 控制删除任务的确认弹窗是否显示
    [types.TASKS_SWITCH_DEL_CONFIRM_VISIBLE_SYNC] ({ commit }, payload) {
        commit(types.TASKS_SWITCH_DEL_CONFIRM_VISIBLE, payload)
    },
    // 控制上传原始图的弹窗是否显示
    [types.TASKS_SWITCH_UPLOAD_ORIGIN_IMG_VISIBLE_SYNC] ({ commit }, payload) {
        commit(types.TASKS_SWITCH_UPLOAD_ORIGIN_IMG_VISIBLE, payload)
    },
    // 控制查看原始图的弹窗是否显示
    [types.TASKS_SWITCH_VIEW_ORIGIN_IMG_VISIBLE_SYNC] ({ commit }, payload) {
        commit(types.TASKS_SWITCH_VIEW_ORIGIN_IMG_VISIBLE, payload)
    }
}
