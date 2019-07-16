import types from '@/store/constants/types'
export default {
    [types.SWITCH_DATA_ENTRY_DIALOG_STATUS] (state, payload) {
        state.dataEntryDialogShow = payload
    }
}
