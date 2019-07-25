export default {
    LOGIN: '/api/login', // 登录
    GET_ACCOUNTS: '/api/users', // 获取账号列表
    UPDATE_ACCOUNT: '/api/users/update', // 修改账号信息
    ADD_ACCOUNT: '/api/users', // 创建账号
    RESET_ACCOUNT_PASSWORD: '/api/users/updatePassword/', // 重置账号密码
    DEL_ACCOUNT: '/api/users/', // 删除账号
    UPDATE_ACCOUNT_NAME: '/api/users/updateName/', // 修改账号realName
    GET_RECTIFY_LATLNG: '/api/geo/rectify', // 获取谷歌地图纠偏之后的经纬度
    GET_TASKS: '/api/tasks', // 获取任务列表
    ADD_TASK: '/api/tasks', // 创建任务
    DEL_TASK: '/api/tasks/', // 删除任务
    UPLOAD_ORIGIN_IMG: '/api/upload/origin/img' // 单个上传预处理之后的航测图片
}
