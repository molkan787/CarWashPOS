const { Model } = require('objection');
const time = require('../utils/time');

module.exports = class Action extends Model{

    static get tableName(){
        return 'actions';
    }

    static get jsonSchema(){
        return {
            type: 'object',
            required: ['date_added'],

            properties: {
                id: {type: 'integer'},
                date_added: {type: 'integer'},
                reversed: {type: 'integer'},
                ax_associated: {type: 'integer'},
                ax_group: {type: 'integer'},
                ax_type: {type: 'integer'},
                ref1: {type: 'integer'},
                ref2: {type: 'integer'},
                ref3: {type: 'integer'},
                s1: {type: 'integer'},
                s2: {type: 'integer'},
                s3: {type: 'integer'},
                data: {type: 'object'}
            }
        }
    }

    static get relationMappings() {
        return {
            loyalty: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/LoyaltyCard',
                join: {
                    from: 'actions.ref2',
                    to: 'loyalty_cards.id'
                }
            },
            prepaid: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/PrepaidCard',
                join: {
                    from: 'actions.ref2',
                    to: 'prepaid_cards.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join: {
                    from: 'actions.ref3',
                    to: 'users.id'
                }
            },
        };
    }

    static async add(group, type, ref, slot, data, associated){
        const a = {
            date_added: time.now(),
            ax_group: group,
            ax_type: type,
        }

        if(typeof ref == 'object'){
            a.ref1 = ref.ref1 || 0;
            a.ref2 = ref.ref2 || 0;
            a.ref3 = ref.ref3 || 0;
        }else{
            a.ref1 = ref;
        }

        if(typeof slot == 'object'){
            a.s1 = slot.s1 || 0;
            a.s2 = slot.s2 || 0;
            a.s3 = slot.s3 || 0;
        }else{
            a.s1 = slot;
        }

        if(typeof data == 'object'){
            a.data = data;
        }

        if(typeof associated == 'number'){
            a.ax_associated = associated;
        }

        const ax = await this.query().insert(a);
        
        return ax.id;

    }

}