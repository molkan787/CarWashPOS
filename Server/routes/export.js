const errors = require('restify-errors');
const DataExporter = require('../dataExporter/index');
const security = require('../security');
const resMaker = require('../utils/response');

module.exports = async (req, res, next) => {
    try {
        const filename = await DataExporter.export(req.params.dataName);
        const signature = security.signContent(filename);
        res.send(resMaker.success({
            filename,
            signature,
            dataName: req.params.dataName,
        }));
        next();
    } catch (error) {
        console.log(error)
        return next(new errors.InternalError('ERROR:025'));
    }
};
