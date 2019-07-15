const uuidv1 = require('uuid/v1')
function generateUUID() {
    return uuidv1().replace(/-/g, '')
}

function defineModel(app, name, attributes) {
    const { UUID } = app.Sequelize
    let attrs = {}
    for (let key in attributes) {
        let value = attributes[key]
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || true
            attrs[key] = value
        } else {
            attrs[key] = {
                type: value,
                allowNull: true
            }
        }
    }

    if (!attrs.id) {
        attrs.id = {
            type: UUID,
            primaryKey: true,
            defaultValue: () => { return generateUUID() }
        }
    }

    return app.model.define(name, attrs, {
        freezeTableName: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    })
}
module.exports = { defineModel }
