import actions from '../actions/tasks'
import mutations from '../mutations/tasks'

const state = {
    dataList: [],
    currentPage: 1,
    currentPageSize: 15,
    totalPage: 0
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
