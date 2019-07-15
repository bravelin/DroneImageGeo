const types = [
    'SWITCH_LOADING', // 更改全局loading状态
    'SWITCH_SCREEN_FULL', // 更改全屏状态
    'GET_WINDOW_SIZE', // 获取窗口宽高
    'SET_CURR_ROUTER', // 设置当前路由
    'UPDATE_USER_INFO',
    'CLEAR_USER_INFO',
    'SWITCH_MESSAGE_TIP',
    'SWITCH_LEFT_PLANE_TAB', // 修改左侧面板的Tab
    'SWITCH_CHANGE_PW_DIALOG_STATUS', // 修改密码Dialog是否显示
    'SWITCH_DATA_ENTRY_DIALOG_STATUS', // 控制数据录入Dialog是否显示
    'SWITCH_IMPORT_EXPORT_DIALOG_STATUS', // 控制导入导出Dialog是否显示
    'SWITCH_AUDIT_DIALOG_STATUS', // 控制果树审核Dialog是否显示
    'SWITCH_GARDEN_INFO_DIALOG_STATUS' // 控制果园数据信息Dialog是否显示
]

const typesObj = {}
types.forEach(type => { typesObj[type] = type })
export default typesObj