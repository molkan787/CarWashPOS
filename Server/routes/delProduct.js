const errors = require('restify-errors');
const Product = require('../models/Product');
const resMaker = require('../utils/response');

module.exports = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await Product.query().deleteById(id);
        res.send(resMaker.success());
    } catch (error) {
        console.log(error);
        return next(new errors.InternalError('ERROR:012'));
    }
};