const md5 = require('md5');
const {Model} = require('objection');
const time = require('../utils/time');

module.exports = class User extends Model{

    static get tableName(){
        return 'users';
    }

    static get jsonSchema(){
        return {
            type: 'object',

            properties: {
                id: { type: 'integer' },
                user_type: { type: 'integer' },
                username: { type: 'string' },
                password: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                date_added: { type: 'integer' },
                is_active: { type: 'integer' }
            }
        };
    }

    static async put(data){
        try {
            const {id, first_name, last_name, user_type, username, password} = data;
            const udata = {first_name, last_name, user_type, username};
            if(password.length >= 4){
                udata.password = md5(password);
            }
            if(id == 'new'){
                udata.date_added = time.now();
                return await User.query().insert(udata);
            }else{
                return await User.query().update(udata).where('id', id);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

}