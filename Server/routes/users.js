const errors = require('restify-errors');
const resMaker = require('../utils/response');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const offset = req.body.offset || 0;
        const users = await User.query()
        .offset(offset).limit(10).orderBy('id', 'DESC');
        res.send(resMaker.success({items: users}));
        next();
    } catch (error) {
        return next(new errors.InternalError('ERROR:013'));
    }
};