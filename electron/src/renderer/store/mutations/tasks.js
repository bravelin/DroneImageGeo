import types from '../constants/types'
import { formatTime, fromatFileSize } from '../../lib/util'

export default {
    // 设置任务列表数据
    [types.SET_TASKS_DATA_LIST] (state, payload) {
        state.currentPage = payload.page
        state.currentPageSize = payload.pageSize
        state.totalPage = payload.totalPage
        state.dataList = payload.dataList.map((item, index) => {
            return {
                index: payload.pageSize * (payload.page - 1) + index + 1,
                id: item.id,
                creator: item.creator,
                creatorName: item.creatorName,
                status: item.status,
                aerialDate: formatTime(new Date(item.aerialDate), 'yyyy-MM-dd'),
                imgTotalSize: item.imgTotalSize ? fromatFileSize(item.imgTotalSize) : '-',
                imgTotalAmount: item.imgTotalAmount || '-',
                tilesAmount: item.tilesAmount || '-',
                tilesPath: item.tilesPath,
                minLat: item.minLat,
                minLng: item.minLng,
                maxLat: item.maxLat,
                maxLng: item.maxLng,
                remark: item.remark,
                createdAt: formatTime(new Date(item.createdAt))
            }
        })
    }
}
