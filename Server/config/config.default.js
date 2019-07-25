/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1557222528762_2699';
    config.uploadDir = 'D:\\tempUpload';

    // add your user config here
    const userConfig = {};

    config.jwt = {
        secret: 'yufengtek@YFZN@123'
    };

    config.ssl = {
        path: '.well-known/pki-validation/fileauth.txt',
        file: 'fileauth.txt'
    };

    config.security = {
        csrf: {
            enable: false
        }
    };

    config.sequelize = {
        dialect: 'mysql',
        host: 'localhost',
        port: '3306',
        username: 'root',
        password: 'root123',
        database: 'gis'
    };

    config.io = {
        namespace: {
            '/': {
                connectionMiddleware: ['connection'],
                packetMiddleware: []
            }
        }
    };

    config.middleware = ['token'];
    return { ...config, ...userConfig };
};
