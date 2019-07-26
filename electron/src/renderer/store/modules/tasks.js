import actions from '../actions/tasks'
import mutations from '../mutations/tasks'

const state = {
    dataList: [],
    currentPage: 1,
    currentPageSize: 15,
    totalPage: 0,
    addDialogVisible: false,

    delConfirmVisible: false,
    delConfirmTaskId: '',

    uploadOriginImgVisible: false,
    uploadOriginImgVisibleTaskId: '',

    viewOriginImgVisible: false,
    viewOriginImgVisibleTaskId: ''
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
