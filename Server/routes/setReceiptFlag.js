const errors = require('restify-errors');
const Order = require('../models/Order');
const resMaker = require('../utils/response');

module.exports = async (req, res, next) => {
    try {
        const order_id = req.body.order_id;
        await Order.query().patch({receipt: 1}).where({id: order_id});
        res.send(resMaker.success());
        next();
    } catch (error) {
        console.log(error);
        return next(new errors.InternalError('ERROR:017'));
    }
};