import types from '../constants/types'
export default {
    [types.ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE] (state, isShow) {
        state.addDialogVisible = isShow
    }
}
