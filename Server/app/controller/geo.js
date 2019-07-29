'use strict';

const Controller = require('egg').Controller;
class GeoController extends Controller {
    async rectify () {
        const { ctx, service } = this;
        const helper = ctx.helper;
        const query = ctx.query || {};
        if (!query.lat || !(query.lat + '').trim()) {
            return helper.success(ctx, '', '缺少参数！', 501);
        }
        if (!query.lng || !(query.lng + '').trim()) {
            return helper.success(ctx, '', '缺少参数！', 501);
        }
        const res = await service.geo.rectify(query.lat, query.lng);
        helper.success(ctx, res, '', 200);
    }
    async tile () {
        const { ctx, service, app } = this;
        const helper = ctx.helper;
        const querys = ctx.params;
        const { x, y, z } = querys;
        console.log('请求瓦片地址...', x, y, z);
        let url = '';
        if (x && y && z) {
            url = await service.geo.tile(x, y, z);
            if (url) {
                url = app.config.picHost + url;
            }
        }
        url = url || `http://mt0.google.cn/vt/lyrs=s@699&hl=en&gl=en&x=${x}&y=${y}&z=${z}`;
        console.log('get tile url...', url)
        ctx.status = 302;
        ctx.redirect(url);
    }
}

module.exports = GeoController;
