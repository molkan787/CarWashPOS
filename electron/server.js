const fs = require('fs');
const restify = require('restify');
const errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');


const server = restify.createServer();
const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['Authorization'],
  exposeHeaders: ['API-Token-Expiry']
});
server.pre(cors.preflight);
server.use(cors.actual);

server.get('*', async (req, res, next) => {
    try {
        let filename = req.url.substring(1);
        if(!filename) filename = 'index.html';
        console.log('Reading: ', filename)
        const fileContent = await getFileContent(filename);
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(fileContent),
            'Content-Type': getContentTypeHeader(filename)
        });
        res.write(fileContent);
        res.end();
        next();
    } catch (error) {
        console.log(error);
        return next(new errors.InternalError('UNKNOW ERR'));
    }
});

function getFileContent(filename){
    return new Promise((resovle, reject) => {
        fs.readFile(__dirname + '/app/' + filename, function(err, data) {
            if(err){
                reject(err);
            }else{
                resovle(data);
            }
        });
    });
}

function getContentTypeHeader(filename){
    const ext = getFileExt(filename);
    switch (ext) {
        case 'js':
            return 'text/javascript';
        case 'css':
            return 'text/css';
        case 'png':
            return 'image/png';
        case 'jpg':
            return 'image/jpeg';
        case 'html':
            return 'text/html';
        default:
            return 'application/octet-stream';
    }
}

function getFileExt(filename){
    const parts = filename.split('.');
    return parts[parts.length - 1];
}

module.exports = server;