'use strict';
const Service = require('egg').Service;

class GeoService extends Service {
    async rectify (lat, lng) {
        const { ctx } = this;
        const result = await ctx.curl(`http://map.yanue.net/gpsapi.php?lat=${lat}&lng=${lng}`, { dataType: 'json', timeout: 30000 });
        if (result.data.error == 0) {
            const googleGeo = result.data.google;
            return { lng: googleGeo.lng, lat: googleGeo.lat };
        } else {
            return {};
        }
    }
    // 依据x,y,z，获取瓦片的地址
    async tile (x, y, z) {
        const { ctx, app } = this;
        const Sequelize = app.Sequelize;
        const sql = `select fdfs_path as url from tile_image where tile_x=${x} and tile_z=${z} and tile_y=${y}`;
        const queryRes = await ctx.model.query(sql, { type: Sequelize.QueryTypes.SELECT });
        if (queryRes[0]) {
            console.log('tile...', queryRes[0], queryRes[0].url)
            return queryRes[0].url;
        } else {
            return '';
        }
    }
}

module.exports = GeoService;
