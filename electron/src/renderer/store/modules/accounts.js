import actions from '../actions/accounts'
import mutations from '../mutations/accounts'

const state = {
    dataList: [],
    currentPage: 1,
    currentPageSize: 15,
    totalPage: 0,
    addDialogVisible: false,

    resetPasswordConfirmId: '', // 账号ID
    resetPasswordConfirmLoginName: '', // 账号名
    resetPasswordConfirmVisible: false, // 确认弹窗是否显示

    delConfirmVisible: false,
    delConfirmLoginName: false,
    delConfirmId: false,

    editAccountId: '',
    editAccountLoginName: '',
    editAccountVisible: false,
    editAccountRealName: ''
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
