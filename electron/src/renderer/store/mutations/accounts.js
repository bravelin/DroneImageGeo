import types from '../constants/types'
import { formatTime } from '../../lib/util'

export default {
    [types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE] (state, isShow) {
        if (state.addDialogVisible == isShow) {
            state.addDialogVisible = !state.addDialogVisible
        } else {
            state.addDialogVisible = isShow
        }
    },
    [types.SET_ACCOUNTS_DATA_LIST] (state, payload) {
        state.currentPage = payload.page
        state.currentPageSize = payload.pageSize
        state.total = payload.total
        state.dataList = payload.dataList.map((item, index) => {
            return {
                index: payload.pageSize * (payload.page - 1) + index + 1,
                id: item.id,
                loginName: item.loginName,
                realName: item.realName,
                lastLoginTime: formatTime(new Date(item.lastLoginTime)),
                role: item.role,
                roleName: item.role == '0' ? '超级管理员' : '管理员',
                createdAt: formatTime(new Date(item.createdAt))
            }
        })
    }
}
