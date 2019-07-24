'use strict';
const Controller = require('egg').Controller;

class TaskController extends Controller {
    // 获取任务列表
    async index () {
        const { ctx, service } = this;
        const helper = ctx.helper;
        const query = ctx.query || {};
        // 查询条件
        const page = (query.page || 1) - 0;
        const pageSize = (query.pageSize || 15) - 0;
        const searchKey = query.key ? decodeURIComponent(query.key) : '';
        const status = query.status != undefined ? query.status : '';
        let uid = ctx.request.header.uid
        const isSuperAdministrator = await service.user.isSuperAdministrator(uid)
        if (isSuperAdministrator) {
            uid = ''
        }
        const resData = await service.task.queryAll({ page, pageSize, searchKey, status, uid });
        helper.success(ctx, resData);
    }
}

module.exports = TaskController;
