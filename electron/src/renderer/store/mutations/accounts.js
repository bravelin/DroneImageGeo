import types from '../constants/types'
import { formatTime } from '../../lib/util'

export default {
    // 控制添加账号弹窗是否显示
    [types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE] (state, isShow) {
        if (state.addDialogVisible == isShow) {
            state.addDialogVisible = !state.addDialogVisible
        } else {
            state.addDialogVisible = isShow
        }
    },
    // 控制删除账号的确认弹窗是否显示
    [types.ACCOUNTS_SWITCH_DEL_CONFIRM_VISIBLE] (state, { id, loginName, isShow }) {
        if (state.delConfirmVisible == isShow) {
            state.delConfirmVisible = !state.delConfirmVisible
        } else {
            state.delConfirmVisible = isShow
            state.delConfirmLoginName = loginName
            state.delConfirmId = id
        }
    },
    // 控制重置账号密码的确认弹窗是否显示
    [types.ACCOUNTS_SWITCH_RESET_PW_CONFIRM_VISIBLE] (state, { id, loginName, isShow }) {
        if (state.resetPasswordConfirmVisible == isShow) {
            state.resetPasswordConfirmVisible = !state.resetPasswordConfirmVisible
        } else {
            state.resetPasswordConfirmVisible = isShow
            state.resetPasswordConfirmLoginName = loginName
            state.resetPasswordConfirmId = id
        }
    },
    // 获取账户列表
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
