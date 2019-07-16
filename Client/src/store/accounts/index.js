import actions from './actions'
import mutations from './mutations'

export default {
    namespaced: true,
    state: {
        dataList: [],
        currentPage: 1,
        currentPageSize: 20,
        total: 0,
        searchKey: '',
        loading: false,
        addDialogVisible: false
    },
    actions,
    mutations
}
