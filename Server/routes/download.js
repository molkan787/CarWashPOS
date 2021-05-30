const fs = require('fs');
const errors = require('restify-errors');
const security = require('../security');

module.exports = async (req, res, next) => {
    try {
        const {filename, signature, returnFilename} = req.params;
        if(!filename || !signature){
            return next(new errors.InvalidArgumentError('Invalid Arguments.'));
        }
        if(security.checkSignature(signature, filename)){
            sendFile(filename, res, returnFilename);
            next();
        }else{
            return next(new errors.UnauthorizedError('Invalid Signature'));
        }
    } catch (error) {
        console.log(error)
        return next(new errors.InternalError('ERROR:016'));
    }
};

function sendFile(filename, res, returnFilename){
    const readStream = fs.createReadStream(`${appRoot}/files/${filename}`);
    res.writeHead(200, {
        "Content-Type": 'application/octet-stream',
        "Content-Disposition": "attachment; filename=" + returnFilename,
    });
    readStream.pipe(res);
}