const errors = require('restify-errors');
const Order = require('../models/Order');
const Stats = require('../models/Stats');
const Reports = require('../reports/index');
const resMaker = require('../utils/response');
const time = require('../utils/time');
const Action = require('../Actions/Action');

module.exports = async (req, res, next) => {
    try {
        const orderId = req.body.id;
        const stats = await refundOrder(orderId);
        if(stats){
            res.send(resMaker.success({stats}));
            next();
        }else{
            return next(new errors.NotFoundError('Order not found'));
        }
    } catch (error) {
        console.log(error);
        return next(new errors.InternalError('ERROR:023'));
    }
};

async function refundOrder(orderId){
    const id = parseInt(orderId);
    const _order = await Order.query().findById(id);
    if(!_order) return false;
    
    await Order.query().patch({status: 3}).where({id});

    const stats = Reports.getOrderStats(_order, true);
    const statsDay = time.getDateKey(_order.date_added);
    await Stats.substract(stats, statsDay);
    await undoChanges(orderId);

    stats.day = statsDay;
    return stats;
}

async function undoChanges(orderId){
    const actions = await Action.getActionsByRef1(orderId);
    await Action.reverse(actions);
}