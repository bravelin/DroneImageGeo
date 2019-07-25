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
        let uid = ctx.request.header.uid;
        const isSuperAdministrator = await service.user.isSuperAdministrator(uid)
        if (isSuperAdministrator) {
            uid = ''
        }
        const resData = await service.task.queryAll({ page, pageSize, searchKey, status, uid });
        helper.success(ctx, resData);
    }
    // 创建任务
    async create () {
        const { ctx, service } = this;
        const params = ctx.request.body;
        const helper = ctx.helper;
        // 校验参数
        if (!params.remark || !(params.remark + '').trim()) {
            return helper.success(ctx, '', '任务备注不能为空！', 501);
        }
        const res = await service.task.create(ctx.request.header.uid, params.remark);
        helper.success(ctx, '', res.message, res.code);
    }
    // 删除任务
    async destroy () {
        const { ctx, service } = this;
        const querys = ctx.params;
        const helper = ctx.helper;
        const taskId = querys.id;
        if (!taskId || !(taskId + '').trim()) {
            return helper.success(ctx, '', '接口缺少参数！', 501);
        }
        const res = await service.task.del(taskId);
        helper.success(ctx, '', res.message, res.code);
    }
    // 上传单个图片文件
    async uploadOriginImg () {
        const { ctx, service } = this;
        const helper = ctx.helper;
        const res = await service.task.uploadOriginImg();
        helper.success(ctx, '', res.message, res.code);
    }
}

module.exports = TaskController;
