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
    'SWITCH_CHANGE_PW_DIALOG_STATUS', // 修改密码Dialog是否显示

    'ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE_SYNC', // 控制添加账号弹窗是否显示
    'ACCOUNTS_SWITCH_ADD_DIALOG_VISIBLE',
    'SET_ACCOUNTS_DATA_LIST_SYNC', // 设置数据
    'SET_ACCOUNTS_DATA_LIST',
    'ACCOUNTS_SWITCH_RESET_PW_CONFIRM_VISIBLE_SYNC', // 控制重置账号密码的确认弹窗是否显示
    'ACCOUNTS_SWITCH_RESET_PW_CONFIRM_VISIBLE',
    'ACCOUNTS_SWITCH_DEL_CONFIRM_VISIBLE_SYNC', // 控制删除账号的确认弹窗是否显示
    'ACCOUNTS_SWITCH_DEL_CONFIRM_VISIBLE',
    'ACCOUNTS_SWITCH_EDIT_DIALOG_VISIBLE_SYNC', // 控制修改账号名称弹窗是否显示
    'ACCOUNTS_SWITCH_EDIT_DIALOG_VISIBLE',

    'SET_TASKS_DATA_LIST_SYNC', // 设置任务列表dataList
    'SET_TASKS_DATA_LIST',
    'TASKS_SWITCH_ADD_DIALOG_VISIBLE_SYNC',
    'TASKS_SWITCH_ADD_DIALOG_VISIBLE',
    'TASKS_SWITCH_DEL_CONFIRM_VISIBLE_SYNC', // 控制删除任务的确认弹窗是否显示
    'TASKS_SWITCH_DEL_CONFIRM_VISIBLE'
]

const typesObj = {}
types.forEach(type => { typesObj[type] = type })
export default typesObj
