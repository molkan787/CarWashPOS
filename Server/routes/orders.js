const errors = require('restify-errors');
const resMaker = require('../utils/response');
const Order = require('../models/Order');
const User = require('../models/User');
const wb = require('../utils/whereBuilder');

module.exports = async (req, res, next) => {
    try {
        const offset = req.body.offset || 0;
        const id = (req.body.id || '').replace(/\s/g, '');
        const paym = req.body.pay_method;
        const conds = {};
        if(id) conds.id = id;
        if(paym) conds.pay_method = paym;

        const orders = await Order.query().eager('[client, cashier]')
        .pick(User, ['id', 'first_name', 'last_name'])
        .where(wb.dateRange(req.body)).andWhere(conds)
        .offset(offset).limit(10).orderBy('id', 'DESC');

        res.send(resMaker.success({items: orders}));
    } catch (error) {
        return next(new errors.InternalError('ERROR:009'));
    }
};