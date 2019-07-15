'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class AdminController extends Controller {
    // 返回页面
    async index () {
        const ctx = this.ctx;
        const pageFile = path.resolve(__dirname, `../public/admin/index.html`);
        const readFile = require('util').promisify(fs.readFile);
        const pageData = await readFile(pageFile, 'utf-8');
        ctx.set('Content-Type', 'text/html');
        ctx.body = pageData;
    }
    // 从excel中导入偏差数据
    async importOffset () {
        const { service } = this;
        await service.admin.importOffset();
    }
    // 获取google地图经纬度偏移数据
    async getGoogleOffset () {
        const { service } = this;
        await service.admin.getGoogleOffset();
    }
    // 处理图片请求
    async rectify () {
        const { ctx, service } = this;
        const helper = ctx.helper;
        const query = ctx.query || {};
        const path = query.path ? decodeURIComponent(query.path) : '';
        console.log('图片处理路径....', path);
        await service.admin.rectify(path);
    }
}

module.exports = AdminController;
