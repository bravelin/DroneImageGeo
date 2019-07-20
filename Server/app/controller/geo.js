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
}

module.exports = GeoController;