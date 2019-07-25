'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller, config, io } = app;
    router.get('/', controller.sys.index); // 返回页面
    router.post('/api/login', controller.sys.login); // 登录
    router.get(`/${config.ssl.path}`, controller.sys.sslVerify); // ssl证书验证
    router.post('/api/verify/token', controller.sys.verifyToken); // 校验token是否有效

    io.of('/').route('server', io.controller.sys.server); // socket.io

    router.get('/api/users', controller.user.index); // 查询所有的账号
    router.get('/api/users/:id', controller.user.show); // 查询单个账号
    router.post('/api/users/update', controller.user.updateRealNameAndPassword); // 更新当前账号信息
    router.put('/api/users/updateName/:id', controller.user.updateRealName); // 修改账号的realName
    router.put('/api/users/updatePassword/:id', controller.user.updatePassword); // 修改账号的password
    router.post('/api/users', controller.user.create); // 创建账号
    router.delete('/api/users/:id', controller.user.destroy); // 删除账号

    router.get('/api/geo/rectify', controller.geo.rectify); // 获取纠偏之后的经纬度

    router.get('/api/tasks', controller.task.index); // 分页查询任务列表数据
    router.post('/api/tasks', controller.task.create); // 创建任务
    router.delete('/api/tasks/:id', controller.task.destroy); // 删除任务
    router.post('/api/tasks/upload/origin/img', controller.task.uploadOriginImg); // 单个上传航测原图
    router.post('/api/tasks/update/origin/img', controller.task.updateOriginImg); // 补充航测图信息、图片总数量、大小、航测日期、状态更改为1

    router.get('/*', controller.sys.index); // 返回页面
};
