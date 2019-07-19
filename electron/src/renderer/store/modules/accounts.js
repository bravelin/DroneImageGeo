import actions from '../actions/accounts'
import mutations from '../mutations/accounts'

const state = {
    dataList: [],
    currentPage: 1,
    currentPageSize: 20,
    total: 0,
    addDialogVisible: false
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
