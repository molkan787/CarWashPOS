const errors = require('restify-errors');
const resMaker = require('../utils/response');
const Settings = require('../models/Settings');

module.exports = {
    get: async (req, res, next) => {
        try {
            const values = await Settings.getValues();
            res.send(resMaker.success({values}));
            next();
        } catch (error) {
            return next(new errors.InternalError('ERROR:020'));
        }
    },
    set: async (req, res, next) => {
        try {
            if(typeof req.body != 'object'){
                return next(new errors.InvalidArgumentError());
            }
            await Settings.setValues(req.body);
            res.send(resMaker.success());
            next();
        } catch (error) {
            return next(new errors.InternalError('ERROR:021'));
        }
    }
};
