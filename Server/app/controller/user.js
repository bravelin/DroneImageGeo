'use strict';
const Controller = require('egg').Controller;

class UserController extends Controller {
    // 获取所有的账号
    async index () {
        const { ctx, service } = this;
        const helper = ctx.helper;
        const resData = await service.user.queryAll();
        helper.success(ctx, resData);

        const { ctx, service } = this;
        const helper = ctx.helper;
        const query = ctx.query || {};
        // 查询条件
        const page = (query.page || 1) - 0;
        const pageSize = (query.pageSize || 15) - 0;
        const searchKey = query.key ? decodeURIComponent(query.key) : '';
        const resData = await service.article.query({ page, pageSize, searchKey });
        helper.success(ctx, resData);
    }

    // 修改账号
    async updateRealName () {
        const { ctx, service } = this;
        const helper = ctx.helper;
        const querys = ctx.params;
        const params = ctx.request.body;
        if (!querys.id || !(querys.id + '').trim()) {
            return helper.success(ctx, '', '接口缺少参数！', 501);
        }
        if (!params.realName || !(params.realName + '').trim()) {
            return helper.success(ctx, '', '账号真实名称不能为空！', 501);
        }
        const res = await service.user.updateRealName(querys.id, params.realName);
        helper.success(ctx, '', res.message, res.code);
    }

    async updatePassword () {
        const { ctx, service } = this;
        const helper = ctx.helper;
        const querys = ctx.params;
        const params = ctx.request.body;
        if (!querys.id || !(querys.id + '').trim()) {
            return helper.success(ctx, '', '接口缺少参数！', 501);
        }
        if (!params.password || !(params.password + '').trim()) {
            return helper.success(ctx, '', '账号密码不能为空！', 501);
        }
        const res = await service.user.updatePassword(querys.id, params.password);
        helper.success(ctx, '', res.message, res.code);
    }

    async updateRealNameAndPassword () {
        const { ctx, service } = this;
        const helper = ctx.helper;
        const uid = ctx.request.header.uid;
        const params = ctx.request.body;
        if (!uid || !(uid + '').trim()) {
            return helper.success(ctx, '', '接口缺少参数！', 501);
        }
        if (!params.realName || !(params.realName + '').trim()) {
            return helper.success(ctx, '', '账号真实名称不能为空！', 501);
        }
        if (!params.oldPassword || !(params.oldPassword + '').trim()) {
            return helper.success(ctx, '', '旧密码不能为空！', 501);
        }
        if (!params.password || !(params.password + '').trim()) {
            return helper.success(ctx, '', '账号密码不能为空！', 501);
        }
        const res = await service.user.updateRealNameAndPassword(uid, params.realName, params.oldPassword, params.password);
        helper.success(ctx, '', res.message, res.code);
    }

    // 创建账号
    async create () {
        const { ctx, service } = this;
        const params = ctx.request.body;
        const helper = ctx.helper;
        // 校验参数
        if (!params.loginName || !(params.loginName + '').trim()) {
            return helper.success(ctx, '', '账号登录名不能为空！', 501);
        }
        if (!params.realName || !(params.realName + '').trim()) {
            return helper.success(ctx, '', '账号真实名称不能为空！', 501);
        }
        if (!params.password || !(params.password + '').trim()) {
            return helper.success(ctx, '', '账号密码不能为空！', 501);
        }
        const res = await service.user.create(params.loginName, params.realName, params.password);
        helper.success(ctx, '', res.message, res.code);
    }

    // 查询单个账号
    async show () {
        const { ctx, service } = this;
        const querys = ctx.params;
        const helper = ctx.helper;
        if (!querys.id || !(querys.id + '').trim()) {
            return helper.success(ctx, '', '接口缺少参数！', 501);
        }
        const res = await service.user.getDetail(querys.id);
        helper.success(ctx, res.data, res.message, res.code);
    }

    // 删除账号
    async destroy () {
        const { ctx, service } = this;
        const querys = ctx.params;
        const helper = ctx.helper;
        if (!querys.id || !(querys.id + '').trim()) {
            return helper.success(ctx, '', '接口缺少参数！', 501)
        }
        const res = await service.user.del(querys.id);
        helper.success(ctx, '', res.message, res.code);
    }
}

module.exports = UserController;
