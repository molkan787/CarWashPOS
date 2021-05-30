const errors = require('restify-errors');
const User = require('../models/User');
const resMaker = require('../utils/response');

module.exports = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await User.query().deleteById(userId);
        res.send(resMaker.success());
        next();
    } catch (error) {
        return next(new errors.InternalError('ERROR:012'));
    }
};

