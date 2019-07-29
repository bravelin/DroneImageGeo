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
    config.uploadDir = '/root/tempUpload';

    // add your user config here
    const userConfig = {};

    config.picHost = 'https://bravelin.top/';
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
        host: '47.92.53.133',
        // host: 'localhost',
        port: '3306',
        username: 'root',
        password: 'root123XYZ@',
        database: 'gis'
    };

    config.multipart = {
        fields: 50, // 表单上传字段限制的个数
        fileSize: '100mb' // 文件上传的大小限制
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
