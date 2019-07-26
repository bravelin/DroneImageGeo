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
                aerialDate: item.aerialDate ? formatTime(new Date(item.aerialDate), 'yyyy-MM-dd') : '-',
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
    },
    // 控制新增任务弹窗是否显示
    [types.TASKS_SWITCH_ADD_DIALOG_VISIBLE] (state, isShow) {
        if (state.addDialogVisible == isShow) {
            state.addDialogVisible = !state.addDialogVisible
        } else {
            state.addDialogVisible = isShow
        }
    },
    // 控制删除任务的确认弹窗是否显示
    [types.TASKS_SWITCH_DEL_CONFIRM_VISIBLE] (state, { id, isShow }) {
        if (state.delConfirmVisible == isShow) {
            state.delConfirmVisible = !state.delConfirmVisible
        } else {
            state.delConfirmVisible = isShow
            state.delConfirmTaskId = id
        }
    },
    // 控制上传原始图的弹窗是否显示
    [types.TASKS_SWITCH_UPLOAD_ORIGIN_IMG_VISIBLE] (state, { id, isShow }) {
        if (state.uploadOriginImgVisible == isShow) {
            state.uploadOriginImgVisible = !state.uploadOriginImgVisible
        } else {
            state.uploadOriginImgVisible = isShow
            state.uploadOriginImgVisibleTaskId = id
        }
    },
    // 控制上传瓦片图的弹窗是否显示
    [types.TASKS_SWITCH_UPLOAD_TILES_IMG_VISIBLE] (state, { id, isShow }) {
        if (state.uploadTilesImgVisible == isShow) {
            state.uploadTilesImgVisible = !state.uploadTilesImgVisible
        } else {
            state.uploadTilesImgVisible = isShow
            state.uploadTilesImgVisibleTaskId = id
        }
    },
    // 控制查看原始图的弹窗是否显示
    [types.TASKS_SWITCH_VIEW_ORIGIN_IMG_VISIBLE] (state, { id, isShow }) {
        if (state.viewOriginImgVisible == isShow) {
            state.viewOriginImgVisible = !state.viewOriginImgVisible
        } else {
            state.viewOriginImgVisible = isShow
            state.viewOriginImgVisibleTaskId = id
        }
    }
}
