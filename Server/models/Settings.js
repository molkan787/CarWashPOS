const {Model} = require('objection');
const time = require('../utils/time');

module.exports = class Settings extends Model{

    static get tableName(){
        return 'settings'
    }

    static get jsonSchema(){
        return {
            type: 'object',

            properties: {
                name: {type: 'string'},
                value: {type: 'string'},
                data_type: {type: 'string'},
                modified_by_user_id: {type: 'integer'},
                modified_by_username: {type: 'string'},
                date_modified: {type: 'integer'},
            }
        }
    }

    static async getValues(){
        const result = {};
        const items = await this.query();
        for(let i = 0; i < items.length; i++){
            const item = items[i];
            result[item.name] = this.parseValue(item);
        }
        return result;
    }

    static async setValues(items){
        for(let name in items){
            if(!items.hasOwnProperty(name)) continue;
            const value = this.stringifyValue(items[name]);
            await this.query().update({
                value,
                date_modified: time.now(),
            }).where({name});
        }
        return true;
    }

    static parseValue(item){
        const rawValue = item.value;
        const dataType = item.data_type;
        switch (dataType) {
            case 'int':
                return parseInt(rawValue);
            case 'float':
                return parseFloat(rawValue);
            case 'json':
                return JSON.parse(rawValue);
            default:
                return rawValue;
        }
    }

    static stringifyValue(value){
        if(typeof value == 'object'){
            return JSON.stringify(value);
        }else{
            return '' + value;
        }
    }

};