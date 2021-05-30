const errors = require('restify-errors');
const resMaker = require('../utils/response');
const Client = require('../models/Client');

module.exports = async (req, res, next) => {
    try {
        const {by, ref} = req.params;
        const clientData = await (by == 'id' ? Client.query().findById(ref) : Client.query().findOne({phone: ref}));
        if(clientData){
            res.send(resMaker.success({data: clientData}));
        }else{
            res.send(resMaker.fail('NOT_FOUND'));
        }
        next();
    } catch (error) {
        next(new errors.InternalError('Error:008'));
    }
};