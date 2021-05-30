const errors = require('restify-errors');
const Product = require('../models/Product');
const resMaker = require('../utils/response');

module.exports = async (req, res, next) => {
    try {
        const pdata = req.body;
        const data = await Product.put(pdata);
        res.send(resMaker.success({data}));
    } catch (error) {
        return next(new errors.InternalError('ERROR:011'));
    }
}