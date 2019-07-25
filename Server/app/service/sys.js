'use strict';
const Service = require('egg').Service;

class SysService extends Service {
    // 校验token的有效性
    async verifyToken (data) {
        const { app } = this
        return new Promise((resolve, reject) => {
            app.jwt.verify(data, app.config.jwt.secret, (err, decoded) => {
                const res = {}
                if (err) {
                    res.verify = false;
                    res.message = err.message;
                } else {
                    res.verify = true;
                    res.message = decoded;
                }
                resolve(res)
            })
        })
    }
}

module.exports = SysService;
