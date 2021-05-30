const {Model, raw} = require('objection');

module.exports = class PrepaidCard extends Model{

    static get tableName(){
        return 'prepaid_cards';
    }

    static get jsonSchema(){
        return {
            type: 'object',
            required: ['barcode', 'balance', 'date_added', 'date_modified'],

            properties: {
                id: {type: 'integer'},
                card_type: {type: 'integer'},
                barcode: {type: 'string'},
                client_id: {type: 'integer'},
                balance: {type: 'integer'},
                date_added: {type: 'integer'},
                date_modified: {type: 'integer'}
            }
        }
    }

    static get relationMappings(){
        return {
            client: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Client',
                join: {
                    from: 'prepaid_cards.client_id',
                    to: 'clients.id'
                }
            },
        };
    }

    static async addBalance(cardId, amount){
        const _amount = parseInt(amount);
        let rawVal = 'balance ';
        rawVal += (_amount < 0) ? '-' : '+';
        rawVal += ' ' + Math.abs(_amount).toString();

        try {
            await this.query()
            .patch({balance: raw(rawVal)})
            .where({id: cardId});
        } catch (error) {
            throw new Error(error);
        }
    }

    static debit(barcode, amount){
        const _amount = parseInt(amount);
        return new Promise(async (resolve, reject) => {
            try {
                const card = await this.query().findOne({barcode});
                if(card){
                    if(card.balance >= _amount){
                        await this.query()
                        .patch({balance: raw('balance - ' + _amount)})
                        .where({id: card.id});
                        resolve('OK');
                    }else{
                        resolve('BALANCE_TOO_LOW');
                    }
                }else{
                    resolve('CARD_DOES_NOT_EXIST');
                }
            } catch (error) {
                reject(error);
            }
        });
    }

}