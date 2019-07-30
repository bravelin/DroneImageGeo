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
        const isSuperAdministrator = await service.user.isSuperAdministrator(uid);
        if (isSuperAdministrator) {
            uid = '';
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
    // 查询任务详情
    async show () {
        const { ctx, service } = this;
        const querys = ctx.params;
        const helper = ctx.helper;
        if (!querys.id || !(querys.id + '').trim()) {
            return helper.success(ctx, '', '接口缺少参数！', 501);
        }
        const res = await service.task.getDetail(querys.id);
        helper.success(ctx, res.data, res.message, res.code);
    }
    // 查询任务原图列表
    async getOriginImgList () {
        const { ctx, service } = this;
        const querys = ctx.params;
        const helper = ctx.helper;
        if (!querys.id || !(querys.id + '').trim()) {
            return helper.success(ctx, '', '接口缺少参数！', 501);
        }
        const res = await service.task.getOriginImgList(querys.id);
        helper.success(ctx, res.data, res.message, res.code);
    }
    // 任务状态更改为1
    async updateOriginImg () {
        const { ctx, service } = this;
        const params = ctx.request.body;
        const helper = ctx.helper;
        // 校验参数
        const id = params.id;
        if (!id || !(id + '').trim()) {
            return helper.success(ctx, '', '任务ID不能为空！', 501);
        }
        const aerialDate = params.aerialDate;
        if (!aerialDate || !(aerialDate + '').trim()) {
            return helper.success(ctx, '', '航测日期不能为空！', 501);
        }
        const imgTotalSize = params.imgTotalSize;
        if (!imgTotalSize || !(imgTotalSize + '').trim()) {
            return helper.success(ctx, '', '图片总大小不能为空！', 501);
        }
        const imgTotalAmount = params.imgTotalAmount;
        if (!imgTotalAmount || !(imgTotalAmount + '').trim()) {
            return helper.success(ctx, '', '图片总数量不能为空！', 501);
        }
        const res = await service.task.updateOriginImg({ id, aerialDate, imgTotalSize, imgTotalAmount });
        helper.success(ctx, '', res.message, res.code);
    }
    // 任务状态更改为2
    async updateTileImg () {
        const { ctx, service } = this;
        const params = ctx.request.body;
        const helper = ctx.helper;
        // 校验参数
        const id = params.id;
        if (!id || !(id + '').trim()) {
            return helper.success(ctx, '', '任务ID不能为空！', 501);
        }
        const tilesAmount = params.tilesAmount;
        if (!tilesAmount || !(tilesAmount + '').trim()) {
            return helper.success(ctx, '', '瓦片总数不能为空！', 501);
        }
        const tilesSize = params.tilesSize;
        if (!tilesSize || !(tilesSize + '').trim()) {
            return helper.success(ctx, '', '瓦片总大小不能为空！', 501);
        }
        const tilesPath = params.tilesPath;
        if (!tilesPath || !(tilesPath + '').trim()) {
            return helper.success(ctx, '', '瓦片路径不能为空！', 501);
        }
        const minLat = params.minLat;
        const minLng = params.minLng;
        const maxLat = params.maxLat;
        const maxLng = params.maxLng;
        if (!minLat || !minLng || !maxLat || !maxLng) {
            return helper.success(ctx, '', '边界信息不能为空！', 501);
        }
        const minZoom = params.minZoom;
        const maxZoom = params.maxZoom;
        if (!minZoom || !maxZoom) {
            return helper.success(ctx, '', '瓦片级别信息不能为空！', 501);
        }
        const res = await service.task.updateTileImg({ id, tilesAmount, tilesSize, tilesPath, minLat, minLng, maxLat, maxLng, minZoom, maxZoom });
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
        const query = ctx.query || {};
        const res = await service.task.uploadOriginImg(query);
        helper.success(ctx, res.data, res.message, res.code);
    }
    // 上传单个瓦片图
    async uploadTileImg () {
        const { ctx, service } = this;
        const helper = ctx.helper;
        const query = ctx.query || {};
        const res = await service.task.uploadTileImg(query);
        helper.success(ctx, res.data, res.message, res.code);
    }
}

module.exports = TaskController;
