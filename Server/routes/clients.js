const errors = require('restify-errors');
const resMaker = require('../utils/response');
const Client = require('../models/Client');
const PrepaidCard = require('../models/PrepaidCard');
const LoyaltyCard = require('../models/LoyaltyCard');
const wb = require('../utils/whereBuilder');

module.exports = async (req, res, next) => {
    try {
        const offset = req.body.offset || 0;
        const phone = (req.body.phone || '').replace(/\s/g, '');
        const pol_card = (req.body.pol_card || '').replace(/\s/g, '');
        let clients;
        if (pol_card) {
            const clientIds = await getClientsIdsByCards(pol_card);
            if (clientIds.length) {
                clients = await Client.query()
                    .whereIn('id', clientIds)
                    .andWhere({ is_company: 0 })
                    .eager('[prepaid, loyalty]')
                    .andWhere(wb.dateRange(req.body)).andWhere('phone', 'like', `%${phone}%`)
                    .offset(offset).limit(10).orderBy('id', 'DESC');
            }else{
                clients = [];
            }

        }else{
            clients = await Client.query()
                .where({ is_company: 0 })
                .eager('[prepaid, loyalty]')
                .andWhere(wb.dateRange(req.body)).andWhere('phone', 'like', `%${phone}%`)
                .offset(offset).limit(10).orderBy('id', 'DESC');
        }

        res.send(resMaker.success({items: clients}));
        next();
    } catch (error) {
        console.log(error);
        return next(new errors.InternalError('ERROR:011'));
    }
};


async function getClientsIdsByCards(barcode) {
    if (!barcode) return [];
    const prepaids = await PrepaidCard.query().where('barcode', 'like', `%${barcode}%`).limit(10);
    const loyalties = await LoyaltyCard.query().where('barcode', 'like', `%${barcode}%`).limit(10);
    const clients = [...extractIds(prepaids), ...extractIds(loyalties)];
    return clients;
}

function extractIds(cards){
    const ids = [];
    for(let card of cards){
        if (card.client_id) {
            ids.push(card.client_id);
        }
    }
    return ids;
}