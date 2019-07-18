const types = [
    'SET_WINDOW_SIZE_SYNC',
    'SET_WINDOW_SIZE', // 设置页面的窗口尺寸
    'SWITCH_LOADING_SYNC',
    'SWITCH_LOADING', // 更改全局loading状态
    'SET_CURR_ROUTER_SYNC',
    'SET_CURR_ROUTER', // 设置当前路由
    'UPDATE_USER_INFO_SYNC',
    'UPDATE_USER_INFO', // 更新用户信息
    'CLEAR_USER_INFO_SYNC',
    'CLEAR_USER_INFO', // 清除用户信息
    'UPDATE_ACCOUNT_SYNC',
    'UPDATE_ACCOUNT', // 更新账号名称
    'SWITCH_MESSAGE_TIP_SYNC',
    'SWITCH_MESSAGE_TIP', // 控制NoResult提示的显示
    'SWITCH_CHANGE_PW_DIALOG_STATUS_SYNC',
    'SWITCH_CHANGE_PW_DIALOG_STATUS' // 修改密码Dialog是否显示
]

const typesObj = {}
types.forEach(type => { typesObj[type] = type })
export default typesObj
