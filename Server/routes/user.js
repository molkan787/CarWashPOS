const errors = require('restify-errors');
const User = require('../models/User');
const resMaker = require('../utils/response');

module.exports = async (req, res, next) => {
    try {
        const data = req.body;
        const resp = await User.put(data);
        res.send(resMaker.success({data: resp}));
        next();
    } catch (error) {
        return next(new errors.InternalError('ERROR:013'));
    }
};