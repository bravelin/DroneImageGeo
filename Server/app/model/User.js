const db = require('../db')
module.exports = app => {
    const { STRING, DATE } = app.Sequelize
    const User = db.defineModel(app, 'tool_user', {
        loginName: {
            type: STRING,
            allowNull: false,
            field: 'login_name'
        },
        loginPassword: {
            type: STRING,
            allowNull: false,
            field: 'login_password'
        },
        realName: {
            type: STRING,
            allowNull: false,
            field: 'real_name'
        },
        lastLoginTime: {
            type: DATE,
            allowNull: false,
            field: 'last_login_time'
        },
        role: {
            type: STRING,
            allowNull: false
        },
        status: {
            type: STRING,
            allowNull: false
        },
        createdAt: {
            field: 'created_at',
            type: DATE,
            allowNull: true
        },
        updatedAt: {
            field: 'updated_at',
            type: DATE,
            allowNull: true
        }
    })
    return User
}
