module.exports = class Reconcile {

    static put(xb, data) {
        this.prepare(xb);
        const ws = xb.ws;

        ws.cell(1, 2).string(data.date);
        ws.cell(4, 2).number(data.totals.cash);
        ws.cell(5, 2).number(data.totals.card);
        ws.cell(6, 2).number(data.totals.prepaid);
        ws.cell(7, 2).number(data.totals.loyalty);
        ws.cell(8, 2).number(data.totals.invoice_ari);
        ws.cell(9, 2).number(data.totals.other);
        
        ws.cell(4, 6).number(data.tipsCash);

        ws.cell(13, 2).number(data.sales.washes);
        ws.cell(14, 2).number(data.sales.extras);
        ws.cell(15, 2).number(data.sales.ppWashes);
        ws.cell(16, 2).number(data.sales.ppExtras);
        ws.cell(17, 2).number(data.extraCharge);
        ws.cell(18, 2).number(data.sales.others);
        ws.cell(19, 2).number(data.sales.prepaid); //
        
        ws.cell(20, 2).number(data.sales.detailing);
        ws.cell(21, 2).number(data.sales.certificate);
        ws.cell(22, 2).number(data.sales.discount);
    }

    static prepare(xb) {
        const ws = xb.ws;
        const sl = xb.styles;
        ws.column(1).setWidth(32);
        ws.column(2).setWidth(15);
        ws.column(3).setWidth(15);

        ws.cell(1, 1).string('Date');

        ws.cell(3, 1).string('Payments').style(sl.headLeftAlign);
        ws.cell(3, 2).string('POS').style(sl.centerAlign);
        ws.cell(3, 3).string('LIVE').style(sl.centerAlign);

        ws.cell(3, 6).string('Cash tips').style(sl.headLeftAlign);

        ws.cell(4, 1).string('Cash ( F )');
        ws.cell(5, 1).string('Credit/Debit Card ( G )');
        ws.cell(6, 1).string('Prepaid Card ( L )');
        ws.cell(7, 1).string('Loyalty Card ( K )');
        ws.cell(8, 1).string('Invoice / Ari ( I )');
        ws.cell(9, 1).string('Free / Other payments ( J )');
        ws.cell(10, 1).string('Total Payments').style(sl.headLeftAlign);

        for(let i = 4; i < 10; i++){
            ws.cell(i, 2).style(sl.price);
            ws.cell(i, 3).style(sl.price);
        }
        
        ws.cell(4, 6).style(sl.price);

        ws.cell(4, 4).formula('C4-B4').style(sl.price);
        ws.cell(5, 4).formula('C5-B5').style(sl.price);
        ws.cell(6, 4).formula('C6-B6').style(sl.price);
        ws.cell(7, 4).formula('C7-B7').style(sl.price);
        ws.cell(8, 4).formula('C8-B8').style(sl.price);
        ws.cell(9, 4).formula('C9-B9').style(sl.price);

        ws.cell(4, 2).style(sl.price);
        ws.cell(5, 2).style(sl.price);
        ws.cell(6, 2).style(sl.price);
        ws.cell(7, 2).style(sl.price);
        ws.cell(8, 2).style(sl.price);
        ws.cell(9, 2).style(sl.price);
        ws.cell(10, 2).formula('SUM(B4:B9)').style(sl.price);
        ws.cell(10, 3).formula('SUM(C4:C9)').style(sl.price);
        ws.cell(10, 4).formula('SUM(D4:D9)').style(sl.price);

        ws.cell(12, 1).string('Sales').style(sl.headLeftAlign);
        ws.cell(13, 1).string('Regular car wash   (N)');
        ws.cell(14, 1).string('Extras   (Q)');
        ws.cell(15, 1).string('Prepaid value of car washes   (O)');
        ws.cell(16, 1).string('Prepaid extra   (P)');
        ws.cell(17, 1).string('Other charges   ( R )');
        ws.cell(18, 1).string('Other items   ( S )');
        ws.cell(19, 1).string('Prepaid Cards sold');
        ws.cell(20, 1).string('Total of detailing');
        ws.cell(21, 1).string('Total gift certificates   ( X )');
        ws.cell(22, 1).string('Total of discounts   ( T )');

        for(let i = 13; i < 23; i++){
            ws.cell(i, 2).style(sl.price);
        }

        ws.cell(24, 1).string('TOTAL');
        ws.cell(24, 2).formula('SUM(B13:B22)').style(sl.price);
        ws.cell(24, 4).formula('B24').style(sl.price);

        ws.cell(27, 1).string('Variance on payments and sales').style(sl.headLeftAlign);
        ws.cell(27, 4).formula('D24-C10').style(sl.price);

        ws.cell(29, 2).string('POS').style(sl.centerAlign);
        ws.cell(29, 3).string('LIVE').style(sl.centerAlign);
        ws.cell(29, 4).string('VARIANCE').style(sl.centerAlign);

        ws.cell(30, 2).formula('B4').style(sl.price);
        ws.cell(30, 3).formula('C4').style(sl.price);
        ws.cell(31, 2).formula('B5').style(sl.price);
        ws.cell(31, 3).formula('C5').style(sl.price);

        ws.cell(32, 2).formula('B30+B31').style(sl.price);
        ws.cell(32, 3).formula('C30+C31').style(sl.price);
        ws.cell(32, 4).formula('B32-C32').style(sl.price);

        ws.cell(3, 2, 10, 4).style(sl.border);
        ws.cell(4, 1, 9, 1).style(sl.border);
        ws.cell(13, 1, 24, 4).style(sl.border);
        ws.cell(29, 2, 32, 4).style(sl.border);
        ws.cell(27, 4).style(sl.border);
    }

}