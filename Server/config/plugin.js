'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    // had enabled by egg
    // static: {
    //   enable: true,
    // }
    validate: {
        enable: true,
        package: 'egg-validate'
    },
    sequelize: {
        enable: true,
        package: 'egg-sequelize'
    },
    mysql: {
        enable: true,
        package: 'egg-mysql'
    },
    jwt: {
        enable: true,
        package: 'egg-jwt'
    },
    io: {
        enable: true,
        package: 'egg-socket.io'
    }
};
