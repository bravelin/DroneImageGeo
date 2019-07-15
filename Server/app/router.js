'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.admin.index);
    router.post('/api/import', controller.admin.importOffset); // 导入
    router.get('/api/rectify', controller.admin.rectify); // 纠偏
    router.get('/api/geo/offset', controller.admin.getGoogleOffset); // 获取google地图经纬度偏移数据
};
