const errors = require('restify-errors');
const resMaker = require('../utils/response');
const Client = require('../models/Client');

module.exports = async (req, res, next) => {
    try {
        const phone = req.params.phone;
        const clientData = await Client.query().findOne({phone});
        if(clientData){
            clientData.history = await Client.getClientHostory(clientData.id);
            res.send(resMaker.success({clientData}));
        }else{
            res.send(resMaker.fail('NOT_FOUND'));
        }
        next();
    } catch (error) {
        next(new errors.InternalError('Error:008'));
    }
};