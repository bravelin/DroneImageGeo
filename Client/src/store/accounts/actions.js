import types from '@/store/constants/types'
import ajax from '@/lib/ajax'

export default {
    [types.GET_ACCOUNTS] (context, payload) { // 获取账号列表
        const state = context.state
        let currentPage = 1
        let currentPageSize = 15
        let searchKey = ''
        if (payload) {
            currentPage = payload.currentPage || state.currentPage
            currentPageSize = payload.currentPageSize || state.currentPageSize
            searchKey = payload.searchKey || state.searchKey
        } else {
            currentPage = state.currentPage
            currentPageSize = state.currentPageSize
            searchKey = state.searchKey
        }
        state.loading = true
        ajax({
            url: '/api/users',
            method: 'get',
            params: {
                currentPageSize: currentPage,
                pageSize: currentPageSize,
                key: encodeURIComponent(searchKey)
            }
        }).then(res => {
            if (res.code == 200) {
                const resDatas = res.repData
                // state.dataList = []
                // state.total = resDatas.count || 0
                state.currentPage = currentPage
                state.currentPageSize = currentPageSize
                state.searchKey = searchKey
            }
            setTimeout(() => { state.loading = false }, 150)
        })
    }
}
