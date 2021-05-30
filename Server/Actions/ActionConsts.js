let data = {
    GROUP_ORDER: 10,
    GROUP_ADMIN: 1,

    TYPE_PREPAID_ACTIVATION: 10,
    TYPE_PREPAID_RELOAD: 11,
    TYPE_PREPAID_DEBIT: 12,
    TYPE_PREPAID_BALANCE_ADJUST: 13,

    TYPE_LOYALTY_ACTIVATION: 20,
    TYPE_LOYALTY_POINT_ADD: 21,
    TYPE_LOYALTY_DEBIT: 22,
    TYPE_LOYALTY_BALANCE_ADJUST: 23,
    TYPE_LOYALTY_POINT_ADD_AFTER_SALE: 24,

};

for(let k in data){
    if(!data.hasOwnProperty(k)) continue;
    Object.defineProperty(data, k, {
        value: data[k],
        writable: false
    });
}

module.exports = data;