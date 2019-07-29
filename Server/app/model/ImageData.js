const db = require('../db')
module.exports = app => {
    const { STRING, DATE, INTEGER } = app.Sequelize
    const ImageData = db.defineModel(app, 'image_data', {
        imgUrl: {
            type: STRING,
            allowNull: false,
            field: 'img_url'
        },
        imgName: {
            type: STRING,
            allowNull: false,
            field: 'img_name'
        },
        imgDate: {
            type: DATE,
            field: 'img_date'
        },
        imgSize: {
            type: INTEGER,
            field: 'img_size'
        },
        taskId: {
            type: INTEGER,
            field: 'batch_id'
        },
        imgWidth: {
            type: INTEGER,
            field: 'img_width'
        },
        imgHeight: {
            type: INTEGER,
            field: 'img_height'
        },
        longitude: {
            type: STRING
        },
        latitude: {
            type: STRING
        },
        altitude: {
            type: STRING
        },
        createdAt: {
            field: 'create_time',
            type: DATE
        }
    })
    return ImageData
}
