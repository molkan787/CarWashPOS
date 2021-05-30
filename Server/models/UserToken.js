const {Model} = require('objection');

module.exports = class UserToken extends Model{

    static get tableName(){
        return 'user_tokens';
    }

    static get jsonSchema(){
        return {
            type: 'object',
            required: ['user_id', 'token', 'date_added'],

            properties: {
                user_id: { type: 'integer' },
                token: { type: 'string' },
                date_added: { type: 'integer' },
                is_active: { type: 'integer' }
            }
        };
    }

}