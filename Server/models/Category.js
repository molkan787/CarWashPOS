const { Model } = require('objection');

module.exports = class Category extends Model{

    static get tableName() {
        return 'categories';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema () {
        return {
            type: 'object',
            required: ['name'],

            properties: {
                id: {type: 'integer'},
                name: {type: 'string'},
                icon: {type: 'string'},
                attr1: {type: 'integer'},
            }
        };
    }

}
