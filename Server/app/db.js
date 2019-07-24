function defineModel(app, name, attributes) {
    const { INTEGER } = app.Sequelize
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
            type: INTEGER,
            primaryKey: true
        }
    }

    return app.model.define(name, attrs, {
        freezeTableName: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
}
module.exports = { defineModel }
