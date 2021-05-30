const config = require('./config');
const md5 = require('md5');

module.exports = class Security{

    static signContent(content){
        return md5(content + config.secret);
    }

    static checkSignature(signature, content){
        const m_signature = md5(content + config.secret);
        return (m_signature === signature);
    }

}