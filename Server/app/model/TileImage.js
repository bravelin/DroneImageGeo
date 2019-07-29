const db = require('../db')
module.exports = app => {
    const { STRING, DATE, INTEGER } = app.Sequelize
    const TileImage = db.defineModel(app, 'tile_image', {
        id: {
            type: INTEGER,
            allowNull: false,
            field: 'tile_id',
            primaryKey: true
        },
        tileX: {
            type: INTEGER,
            allowNull: false,
            field: 'tile_x'
        },
        tileY: {
            type: INTEGER,
            allowNull: false,
            field: 'tile_y'
        },
        tileZ: {
            type: INTEGER,
            allowNull: false,
            field: 'tile_z'
        },
        tileSize: {
            type: INTEGER,
            allowNull: false,
            field: 'tile_size'
        },
        fdfsPath: {
            type: STRING,
            allowNull: false,
            field: 'fdfs_path'
        },
        taskId: {
            type: INTEGER,
            field: 'batch_id'
        },
        createdAt: {
            field: 'create_time',
            type: DATE
        }
    })
    return TileImage
}
