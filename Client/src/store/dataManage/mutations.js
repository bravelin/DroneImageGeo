import types from '@/store/constants/types'
export default {
    [types.SWITCH_DATA_ENTRY_DIALOG_STATUS] (state, payload) {
        state.dataEntryDialogShow = payload
    },
    [types.SWITCH_IMPORT_EXPORT_DIALOG_STATUS] (state, payload) {
        state.importExportDialogShow = payload
    },
    [types.SWITCH_AUDIT_DIALOG_STATUS] (state, payload) {
        state.auditDialogShow = payload
    },
    [types.SWITCH_GARDEN_INFO_DIALOG_STATUS] (state, payload) {
        state.gardenInfoDialogShow = payload
    }
}
