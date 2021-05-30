const errors = require('restify-errors');
const resMaker = require('../utils/response');
const PrepaidCard = require('../models/PrepaidCard');
const LoyaltyCard = require('../models/LoyaltyCard');
// const Action = require('../Actions/Action');
// const AC = require('../Actions/ActionConsts');

module.exports = async (req, res, next) => {
    try {
        const {type, id, barcode} = req.body;
        if(await setCardBarcode(type, id, barcode)){
            res.send(resMaker.success());
        }else{
            res.send(resMaker.fail('CARD_EXIST'));
        }
        next();
    } catch (error) {
        return next(new errors.InternalError('Error:030'));
    }
};

async function setCardBarcode(type, id, barcode){
    // const xtype = type == 'prepaid' ? AC.TYPE_PREPAID_BALANCE_ADJUST : AC.TYPE_LOYALTY_BALANCE_ADJUST;
    const Model = type == 'prepaid' ? PrepaidCard : LoyaltyCard;
    const card = await Model.query().findOne({barcode});
    if(card){
        return false;
    }else{
        await Model.query().patch({barcode}).findById(id);
        return true;
    }

    // await Action.add(AC.GROUP_ADMIN, xtype, {
    //     ref1: 0,
    //     ref2: id,
    // }, {
    //     s1: balance,
    //     s2: card.balance,
    // });
}