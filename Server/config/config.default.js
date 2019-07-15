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
    config.keys = appInfo.name + '_1557222528762_2696';

    config.uploadDir = 'd:\\tempUpload'
    config.distDir = 'd:\\DroneImageDist\\'

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    config.security = {
        csrf: {
            enable: false
        }
    };

    config.multipart = {
        fileSize: '500mb',
        fileExtensions: [
            '.xlsx', '.xls'
        ]
    };

    config.mysql = {
        client: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'root123',
            database: 'gis'
        },
        app: true,
        agent: false
    };

    return {
        ...config,
        ...userConfig,
    };
};
