const errors = require('restify-errors');
const PrepaidCard = require('../models/PrepaidCard');
const Client = require('../models/Client');
const time = require('../utils/time');
const resMaker = require('../utils/response');
const Action = require('../Actions/Action');
const AC = require('../Actions/ActionConsts');

module.exports = async (req, res, next) => {
    const action = req.params.action;
    try {
        switch (action) {
            case 'add':
                res.send(await addCard(req.body));
                break;
            case 'reload':
                res.send(await reloadCard(req.body));
                break;
            case 'del':
                res.send(await deleteCard(req.body));
                break;
            case 'setClientId':
                res.send(await setClientId(req.body));
                break;

            default:
                return next(new errors.NotFoundError('Unknow request path'));
        }
        next();
    } catch (error) {
        console.log(error);
        return next(new errors.InternalError('ERROR:005' + error));
    }
};

async function reloadCard(data){
    try {
        const {barcode, amount} = data;
        const card = await PrepaidCard.query().findOne({barcode});
        if(!card) return resMaker.fail('CARD_DOES_NOT_EXIST');
        await PrepaidCard.addBalance(card.id, amount);

        const actionId = await addAction(AC.TYPE_PREPAID_RELOAD, card.id, amount);

        return resMaker.success({actionId});
    } catch (error) {
        throw new Error(error.message);
    }
}

async function addCard(data){
    try {
        let {barcode, balance, clientId, clientData} = data;
        const existingCard = await PrepaidCard.query().findOne({barcode});
        if(existingCard){
            return resMaker.fail('CARD_EXIST');
        }
        if(!clientId){
            if(clientData && clientData.phone)
                clientId = await Client.getClientId(clientData);
            else
                clientId = 0;
        }
        const card = await PrepaidCard.query().insert({
            barcode,
            balance,
            client_id: clientId,
            date_added: time.now(),
            date_modified: time.now(),
        });
        const actionId = await addAction(AC.TYPE_PREPAID_ACTIVATION, card.id, balance);
        return resMaker.success({cardId: card.id, actionId});
    } catch (error) {
        throw new Error('Unknow error, Probably received data was invalid ' + error);
    }

}

async function deleteCard(payload){
    const id = parseInt(payload.id);
    await PrepaidCard.query().deleteById(id);
    return resMaker.success();
}

async function setClientId(payload){
    const {id, client_id} = payload;
    await PrepaidCard.query().patch({client_id}).findById(id);
    return resMaker.success();
}

async function addAction(type, cardId, value){
    return await Action.add(AC.GROUP_ORDER, type, {
        ref1: 0,
        ref2: cardId,
    }, value || 0);
}
