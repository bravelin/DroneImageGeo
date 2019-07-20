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
}

module.exports = GeoService;