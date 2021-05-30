const errors = require('restify-errors');
const Client = require('../models/Client');
const resMaker = require('../utils/response');

module.exports = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await Client.query().deleteById(id);
        res.send(resMaker.success());
    } catch (error) {
        console.log(error);
        return next(new errors.InternalError('ERROR:019'));
    }
};