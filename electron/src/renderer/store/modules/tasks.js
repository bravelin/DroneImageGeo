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

    uploadTilesImgVisible: false,
    uploadTilesImgVisibleTaskId: '',

    viewOriginImgVisible: false,
    viewOriginImgVisibleTaskId: '',

    viewTilesImgVisible: false,
    viewTilesImgVisibleTaskId: ''
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
