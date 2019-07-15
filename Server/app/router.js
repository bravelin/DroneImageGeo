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
    router.put('/api/users/updateName/:id', controller.user.updateRealName); // 修改账号的realName
    router.put('/api/users/updatePassword/:id', controller.user.updatePassword); // 修改账号的password
    router.post('/api/users', controller.user.create); // 创建账号
    router.delete('/api/users/:id', controller.user.destroy); // 删除账号

    router.get('/*', controller.sys.index); // 返回页面
};
