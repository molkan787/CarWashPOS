const errors = require('restify-errors');
const resMaker = require('../utils/response');
const Client = require('../models/Client');
const LoyaltyCard = require('../models/LoyaltyCard');
const PrepaidCard = require('../models/PrepaidCard');
const time = require('../utils/time');

const CLIENT_EXIST = 'CLIENT_EXIST';

module.exports = async (req, res, next) => {
    try {
        const data = req.body;
        const loyaltyCardId = data.loyaltyCardId;
        const prepaidCardId = data.prepaidCardId;

        // const client = await (id == 'new' ? Client.query().insert(data) : Client.query().update(data).where({id}));
        const client = await patchOrAddClient(data);

        if(client == CLIENT_EXIST){
            res.send(resMaker.fail(CLIENT_EXIST));
            return;
        }

        if(loyaltyCardId){
            await LoyaltyCard.query().patch({client_id: client.id}).findById(parseInt(loyaltyCardId));
        }
        if(prepaidCardId){
            await PrepaidCard.query().patch({client_id: client.id}).findById(parseInt(prepaidCardId));
        }
        res.send(resMaker.success(client));
        next();
    } catch (error) {
        console.log(error)
        return next(new errors.InternalError('Error:017'));
    }
};

async function patchOrAddClient(data){
    const {id, phone, forceNew} = data;
    
    let client = Client.isNoTell(phone) ? null : await Client.query().findOne({phone});
    if(id == 'new'){
        if(client){
            if(forceNew) return CLIENT_EXIST;
            return await patchClient(client.id, data, true);
        }else{
            return await addClient(data);
        }
    }else{
        if(client && client.id != id){
            return CLIENT_EXIST;
        }else{
            return await patchClient(id, data);
        }
    }
}

async function patchClient(id, data, onlyFirstName){
    const {phone, email, first_name, last_name} = data;
    const patch = onlyFirstName ? {first_name} : {phone, first_name, last_name, email};
    const client = await Client.query().patchAndFetchById(id, patch).eager('[prepaid, loyalty]');
    
    client.isNew = false;
    return client;
}

async function addClient(data){
    const {phone, email, first_name, last_name} = data;
    const client = await Client.query().insert({
        phone, email, first_name, last_name,
        date_added: time.now(),
    });
    client.isNew = true;
    return client;
}


// let client = Client.isNoTell(phone) ? null : await Client.query().findOne(id == 'new' ? {phone} : {id}).eager('[prepaid, loyalty]');

// if(client){
//     if(id != 'new'){

//         return CLIENT_EXIST;
//     }
//     const patch = id == 'new' ? {first_name} : {phone, first_name, last_name, email};
//     await Client.query().patch(patch).findById(client.id);
    
//     for(let k in patch){
//         if(!patch.hasOwnProperty(k)) continue;
//         client[k] = patch[k];
//     }
//     client.isNew = false;
// }else{
//     client = await Client.query().insert({
//         phone, email, first_name, last_name,
//         date_added: time.now(),
//     });
//     client.isNew = true;
// }