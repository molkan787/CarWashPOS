const errors = require('restify-errors');
const resMaker = require('../utils/response');
const Client = require('../models/Client');
const LoyaltyCard = require('../models/LoyaltyCard');
const PrepaidCard = require('../models/PrepaidCard');

module.exports = async (req, res, next) => {
    try {
        const {by, ref} = req.params;
        if(by == 'phone'){
            const clientData = await getClient(ref);
            if(clientData){
                res.send(resMaker.success({clientData}));
            }else{
                res.send(resMaker.fail('NOT_FOUND'));
            }
        }else if(by == 'loyalty_card'){
            const loyaltyCard = await getLoyaltyCard(ref);
            if(loyaltyCard){
                res.send(resMaker.success({loyaltyCard}));
            }else{
                const data = await getClientOrPrepaidCard(ref);
                if(data){
                    res.send(resMaker.success(data));
                }else{
                    res.send(resMaker.fail('NOT_FOUND'));
                }
            }
        }

        next();
    } catch (error) {
        next(new errors.InternalError('Error:008'));
    }
};

async function getClient(ref){
    if(typeof ref != 'number' && Client.isNoTell(ref)) return null;
    const filter = {};
    if(typeof ref == 'number') filter.id = ref;
    else filter.phone = ref;
    
    const clientData = await Client.query().findOne(filter).eager('[loyalty, prepaid]');
    if(clientData){
        clientData.history = await Client.getClientHostory(clientData.id);
    }
    return clientData;
}

async function getClientOrPrepaidCard(barcode){
    let clientData;
    const card  = await PrepaidCard.query().findOne({barcode});
    if(card && card.client_id){
        clientData = await getClient(card.client_id);
    }

    if(clientData) return {clientData};
    else if(card) return {prepaidCard: card};
    else return false;
}

async function getLoyaltyCard(barcode){
    const card = await LoyaltyCard.query().findOne({barcode}).eager('[client.prepaid]');
    if(card && card.client && card.client.id){
        card.client.history = await Client.getClientHostory(card.client.id);
    }
    return card;
}