const errors = require('restify-errors');
const auth = require('../auth/auth');
const resMaker = require('../utils/response');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const data = await auth.login(username, password);
        if(data.token){
            res.send(resMaker.success(data));
        }else{
            return next(new errors.UnauthorizedError('Authentication failed'));
        }
        
    } catch (error) {
        console.error(error);
        return next(new errors.InternalError('Error:001 ' + error.toString()));
    }
};