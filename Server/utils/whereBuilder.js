const { raw } = require('objection');
const time = require('./time');

function _add(cc, raw){
    return (cc ? cc + ' AND ' : '') + raw;
}

module.exports = class WhereBuilder{

    static dateRange(params, dateProp, extra, ctdk){
        const colName = dateProp || 'date_added';
        let q = '';
        if(params.date_from)
            q = colName + ' >= ' + ci(params.date_from + time.tzOffset, ctdk);
        if(params.date_to)
            q = _add(q, colName + ' < ' + ci( time.addDay(params.date_to + time.tzOffset), ctdk ) );

        if(extra)
            q = _add(q, extra);

        return raw(q);
    }

}

function ci(date, cond){
    if(cond){
        return time.getDateKey(date);
    }else{
        return date;
    }
}