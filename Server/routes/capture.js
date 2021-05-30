const errors = require('restify-errors');
const PrepaidCard = require('../models/PrepaidCard');
const LoyaltyCard = require('../models/LoyaltyCard');
const resMaker = require('../utils/response');

module.exports = async (req, res, next) => {
    const method = req.params.method;
    try {
        switch (method) {
            case 'prepaid':
                res.send(await debitPrepaidCard(req.body));
                break;
            case 'loyalty':
                res.send(await debitLoyaltyCard(req.body));
                break;
            default:
                return next(new errors.NotFoundError('Unknow request path'));
                break;
        }
        next();
    } catch (error) {
        return next(new errors.InternalError('ERROR:007'));
    }
};

async function debitPrepaidCard(data){
    try {
        const result = await PrepaidCard.debit(data.barcode, data.amount);
        if(result == 'OK'){
            return resMaker.success();
        }else{
            return resMaker.fail(result);
        }
    } catch (error) {
        throw error;
    }
}

async function debitLoyaltyCard(data){
    try {
        const result = await LoyaltyCard.debit(data.barcode, data.amount);
        if(result == 'OK'){
            return resMaker.success();
        }else{
            return resMaker.fail(result);
        }
    } catch (error) {
        throw error;
    }
}