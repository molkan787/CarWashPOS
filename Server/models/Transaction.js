const {Model} = require('objection');

module.exports = class Transaction extends Model{

    static get tableName(){
        return 'transactions'
    }

    static get jsonSchema(){
        return {
            type: 'object',
            required: ['order_id', 'xtype', 'xamount', 'ref_code', 'client_id', 'date_added'],

            properties: {
                id: {type: 'integer'},
                order_id: {type: 'integer'},
                xtype: {type: 'string'},
                xamount: {type: 'integer'},
                ref_code: {type: 'integer'},
                client_id: {type: 'integer'},
                date_added: {type: 'integer'},

            }
        }
    }

    static get relationMappings(){
        return {
            prepaid: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/PrepaidCard',
                join: {
                    from: 'transactions.ref_code',
                    to: 'prepaid_cards.id'
                }
            },
            loyalty: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/LoyaltyCard',
                join: {
                    from: 'transactions.ref_code',
                    to: 'loyalty_cards.id'
                }
            },
        };
    }

}