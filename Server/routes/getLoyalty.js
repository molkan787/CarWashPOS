const errors = require('restify-errors');
const resMaker = require('../utils/response');
const LoyaltyCard = require('../models/LoyaltyCard');
const wb = require('../utils/whereBuilder');

module.exports = async (req, res, next) => {
    try {
        const offset = req.body.offset || 0;
        const barcode = (req.body.barcode || '').replace(/\s/g, '');
        const cards = await LoyaltyCard.query().eager('client')
        .where(wb.dateRange(req.body)).andWhere('barcode', 'like', `%${barcode}%`)
        .offset(offset).limit(10).orderBy('id', 'DESC');
        
        res.send(resMaker.success({items: cards}));
        next();
    } catch (error) {
        return next(new errors.InternalError('ERROR:011'));
    }
};