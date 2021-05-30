const errors = require('restify-errors');
const resMaker = require('../utils/response');
const PrepaidCard = require('../models/PrepaidCard');
const LoyaltyCard = require('../models/LoyaltyCard');
const Action = require('../Actions/Action');
const AC = require('../Actions/ActionConsts');

module.exports = async (req, res, next) => {
    try {
        const {type, id, balance} = req.body;
        await setCardBalance(type, id, balance, req.userId);
        res.send(resMaker.success());
        next();
    } catch (error) {
        return next(new errors.InternalError('Error:021'));
    }
};

async function setCardBalance(type, id, balance, userId){
    const xtype = type == 'prepaid' ? AC.TYPE_PREPAID_BALANCE_ADJUST : AC.TYPE_LOYALTY_BALANCE_ADJUST;
    const Model = type == 'prepaid' ? PrepaidCard : LoyaltyCard;
    const card = await Model.query().findById(id);
    await Model.query().patch({balance}).findById(id);

    await Action.add(AC.GROUP_ADMIN, xtype, {
        ref1: 0,
        ref2: id,
        ref3: userId,
    }, {
        s1: balance,
        s2: card.balance,
    });
}