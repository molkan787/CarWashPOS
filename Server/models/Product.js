const {Model} = require('objection');

module.exports = class Product extends Model{

    static get tableName(){
        return 'products';
    }

    static get jsonSchema(){
        return {
            type: 'object',

            properties: {
                id: {type: 'integer'},
                category_id: {type: 'integer'},
                name: {type: 'string'},
                price: {type: 'integer'},
                can_exclude_taxes: {type: 'integer'},
                product_type: {type: 'integer'}
            }
        }
    }

    static async put(data){
        const {name, product_type, price} = data;
        let p = {name, price, product_type: parseInt(product_type)};
        try {
            if(data.id == 'new'){
                p.category_id = data.category_id;
                p = await this.query().insert(p);
                return p;
            }else{
                await this.query().update(p).where({id: data.id});
                return p;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

}