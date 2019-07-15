import actions from './actions'
import mutations from './mutations'

export default {
    namespaced: true,
    state: {
        dataEntryDialogShow: false, // 控制数据录入Dialog是否显示
        importExportDialogShow: false, // 控制导入导出Dialog是否显示
        auditDialogShow: false, // 果树审核弹窗Dialog是否显示
        gardenInfoDialogShow: false // 果园信息弹窗Dialog是否显示
    },
    actions,
    mutations
}
