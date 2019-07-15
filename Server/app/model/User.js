const db = require('../db')
module.exports = app => {
    const { STRING, DATE } = app.Sequelize
    const User = db.defineModel(app, 'user', {
        loginName: {
            type: STRING,
            allowNull: false
        },
        loginPassword: {
            type: STRING,
            allowNull: false
        },
        realName: {
            type: STRING,
            allowNull: false
        },
        lastLoginTime: {
            type: DATE,
            allowNull: false
        },
        role: {
            type: STRING,
            allowNull: false
        },
        status: {
            type: STRING,
            allowNull: false
        }
    })
    return User
}
