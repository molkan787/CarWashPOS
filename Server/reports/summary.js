const xlBuilder = require('../Helpers/xlBuilder');

module.exports = class Summary{

    static put(xb, days){
        this.prepare(xb);
        for(let i = 0; i < days.length; i++){
            const row = i + 2;
            const day = days[i];
            xb.str(day.date);
            xb.num(day.cw);
            xb.num(day.pp);
            xb.num(day.rpp);
            xb.num(day.dt);

            xb.price_m(day.cash);
            xb.price_m(day.credit);
            xb.formula(`SUM(F${row}:G${row})`)
            xb.price_m(day.invoice_ari);
            xb.price_m(day.freeWashesValue);
            xb.price_m(day.loyalty);
            xb.price_m(day.prepaid); //xb.background('C4BD97')
            xb.formula(`SUM(H${row}:L${row})`) //xb.background('92D050')
            xb.price(day.washes);
            xb.price(day.ppWashes); //xb.background('C4BD97')
            xb.price(day.ppExtra); //xb.background('C4BD97')
            xb.price(day.extra);
            xb.price(day.extraCharge);
            xb.price(day.others);
            xb.price(day.discount);
            xb.price(day.tips);
            xb.price(day.newPrepaid);
            xb.price(day.detailingTotal);
            xb.price(day.certificate);
            xb.formula(`SUM(N${row}:X${row})`); //xb.background('92D050')
            xb.nextRow()
        }

        xb.c_row += 5;
        xb.resetCol();
        xb.str('TOTAL');
        xb.c_col += 4;

        const r = xb.c_row - 1;
        const seq = 'FGHIJKLMNOPQRSTUVWXY';
        for(let i = 0; i < seq.length; i++){
            const c = seq.charAt(i);
            xb.style('price');
            xb.formula(`SUM(${c}2:${c}${r})`);
        }
    }

    static prepare(xb){
        const head = [
            "DATE", 3, "CW", 1, "PP", 1, "RPP", 1, "DT", 1, "CASH", 2,
            "CREDIT/ DEBIT", 2, "CASH + CREDIT", 2, "INVOICE / ARI", 2,
            "VALUE OF FREE WASHES", 2, "PAID BY LOYALTY CARD", 2, "PAID BY PREPAID CARD", 2,
            "TOTAL OF ALL PAYMENT METHODS", 2, "REG. WASHES", 2, "PP VALUE OF WASHES", 2,
            "PP EXTRAS", 2, "EXTRA", 2, "OTHER CHARGES", 2, "OTHER ITEMS", 2,
            "DISCOUNT", 2, "TIPS", 2, "PP SOLD", 2, "DETAILING", 2, "GIFT CERT", 2,
            "TOTAL NET SALES ", 2
        ]
        xb.head(head, xlBuilder.HEADINPUT_ALLINONE, []);
    }

}