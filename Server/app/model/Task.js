const db = require('../db')
module.exports = app => {
    const { STRING, DATE, INTEGER, DOUBLE } = app.Sequelize
    const Task = db.defineModel(app, 'task', {
        creator: {
            type: INTEGER,
            allowNull: false,
        },
        status: {
            type: STRING,
            allowNull: false,
        },
        aerialDate: {
            type: DATE,
            field: 'aerial_date'
        },
        imgTotalSize: {
            type: INTEGER,
            field: 'img_total_size'
        },
        imgTotalAmount: {
            type: INTEGER,
            field: 'img_total_amount'
        },
        tilesAmount: {
            type: INTEGER,
            field: 'tiles_amount'
        },
        tilesSize: {
            type: INTEGER,
            field: 'tiles_size'
        },
        tilesPath: {
            type: STRING,
            field: 'tiles_path'
        },
        minLat: {
            type: DOUBLE,
            field: 'min_lat'
        },
        minLng: {
            type: DOUBLE,
            field: 'min_lng'
        },
        maxLat: {
            type: DOUBLE,
            field: 'max_lat'
        },
        maxLng: {
            type: DOUBLE,
            field: 'max_lng'
        },
        remark: {
            type: STRING,
            allowNull: true
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
    return Task
}
