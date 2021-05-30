const xlBuilder = require('../Helpers/xlBuilder');

module.exports = class Sales{

    static put(xb, items){
        this.prepare(xb);
        const l = items.length;
        for(let i = 0; i < l; i++){
            const o = items[i];
            xb.str(o.id + '');
            xb.str(o.date);
            xb.num(o.cw);
            xb.num(o.pp);
            xb.num(o.rpp);
            xb.num(o.dt);
            xb.str(o.ticket);
            xb.str(o.cashier);
            xb.price_m(o.total);
            xb.str(o.payment);
            xb.price(o.values.washes + o.values.ppWashes);
            xb.price(o.values.extras + o.values.ppExtras);
            xb.price(o.discount);
            xb.str(o.discount_r);
            xb.price(o.values.tips);
            xb.price(o.values.extraCharge);
            xb.price(o.values.others);
            xb.strArr(o.newPrepaids);
            xb.strArr(o.reloadPrepaids);
            xb.price(o.values.detailing);
            xb.price(o.values.certificate);
            xb.nextRow();
        }
    }

    static prepare(xb){
        const head = [
            "ID", 2, "DATE & TIME", 3.5, "CW", 1, "PP", 1, "RPP", 1, "DT", 1,
            "TICKET #", 2, "CASHIER ID", 2, "ORDER VALUE", 2, "PAYMENT TYPE", 4,
            "WASHES", 2, "EXTRAS", 2, "DISCOUNT", 2, "DISCOUNT REASON", 3,
            "TIPS", 2, "OTHER CHARGES", 2, "OTHER ITEMS", 2,
            "NEW PREPAID CARD", 4, "RELOAD OF PREPAID CARD", 4, "DETAILING WORK", 2,
            "GIFT CERTIFICATES", 2
        ];
        xb.head(head, xlBuilder.HEADINPUT_ALLINONE, []);
    }

}