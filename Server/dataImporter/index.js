const Schema = require('./schema');
const time = require('../utils/time');
const PrepaidCard = require('../models/PrepaidCard');
const LoyaltyCard = require('../models/LoyaltyCard');

module.exports = class DataImporter{

    static async import(data, dest){
        if(dest == 'prepaids' || dest == 'loyalties'){
            await importPOLCards(data, dest);
        }
    }

}

async function importPOLCards(items, type){

    const now = time.now();
    const l = items.length;

    let counter = 0;
    let cards = [];

    for(let i = 0; i < l; i++){
        const item = items[i];
        const card = {
            barcode: item[Schema.barcode],
            balance: Math.round(parseFloat(item[Schema.balance]) * 100),
            date_added: now,
            date_modified: now,
            client_id: 0,
        }
        cards.push(card);
        counter++;

        if(counter == 50){
            await pushCards(cards, type);
            cards = [];
            counter = 0;
        }
    }

    if(cards.length){
        await pushCards(cards, type);
    }

}

async function pushCards(cards, type){
    if(type == 'prepaids'){
        await PrepaidCard.query().insertGraph(cards);
    }else if(type == 'loyalties'){
        await LoyaltyCard.query().insertGraph(cards);
    }
}