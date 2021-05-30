const {Model} = require('objection');
const time = require('../utils/time');

module.exports = class Invoice extends Model{

    static get tableName(){
        return 'invoices';
    }

    static get jsonSchema(){
        return {
            type: 'object',
            required: ['client_id', 'amount', 'order_id', 'date_added'],

            properties: {
                id: {type: 'integer'},
                client_id: {type: 'integer'},
                amount: {type: 'integer'},
                order_id: {type: 'integer'},
                is_paid: {type: 'integer'},
                date_added: {type: 'integer'},

            }
        };
    }

    static async addInvoice(order){
        try {
            await this.query().insert({
                client_id: order.client_id,
                amount: order.total,
                order_id: order.id,
                date_added: time.now(),
            });
        } catch (error) {
            throw new Error(error);
        }
    }

}