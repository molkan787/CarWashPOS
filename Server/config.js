module.exports = class Config{

    static get secret(){
        return process.env.secret || 'AGzF8aRlnZ0z7Hx0ZRlnZ0AGzF8az7H';
    }

    static get debug(){
        if(typeof process.env.debugMode == 'undefined') return true;
        return process.env.debugMode == 'on';
    }

    static get db(){
        return {
            host : process.env.db_host || '127.0.0.1',
            user : process.env.db_user || 'root',
            password : process.env.db_pwd || '',
            database : process.env.db_name || 'apos'
        };
    }

}