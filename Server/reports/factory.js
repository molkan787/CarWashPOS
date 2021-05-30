const time = require('../utils/time');
const payMethodsTexts = {
    cash: 'Cash',
    prepaid: 'Prepaid Card',
    invoice_ari: 'Invoice or Ari',
    card: 'Credit/Debit Card',
    loyalty: 'Loyalty Card',
    other: 'Other or Free',
}
const payMethodsMap = {
    cash: 0,
    prepaid: 0,
    invoice_ari: 0,
    card: 0,
    loyalty: 0,
    other: 0,
}

module.exports = class Factory{

    static getPaymText(name){
        return payMethodsTexts[name] || '';
    }

    static genPayMethodMap(){
        return { ...payMethodsMap };
    }

    static genDaysMap(date_from, date_to, template, options){
        const _options = options || {};
        const map = {
            list: [],
            days: {}
        }

        for(let day = date_from; day <= date_to; day += time.daySeconds){
            const dayObj = template ? {...template} : {};
            if(_options.modifier) _options.modifier(dayObj, day);
            map.list.push(dayObj);
            map.days[time.getDateKey(day)] = dayObj;
        }

        if(_options.addSum){
            const sumObj = template ? {...template} : {};
            if(_options.modifier) _options.modifier(sumObj, 'sum');
            map.list.push(sumObj);
            map.days['sum'] = sumObj;
        }

        return map;
    }
}