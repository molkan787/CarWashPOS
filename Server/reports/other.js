const xl = require('excel4node');
const utils = require('../utils/utils');
const time = require('../utils/time');

let headStyle;
let priceStyle;
let priceStyleWithPositiveSign;

module.exports = class Sales{
    static initStyle(wb){
        headStyle = wb.createStyle({
            fill: {
                type: 'pattern',
                patternType: 'darkUp',
                fgColor: '000000',
                bgColor: '000000',
            },
            font: {
                color: 'ffffff',
                bold: true,
            },
            alignment: {
                horizontal: 'center',
                shrinkToFit: true, 
                wrapText: true
            }
        });
        priceStyle = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '$#,##0.00; - $#,##.00; -- ',
        });
        priceStyleWithPositiveSign = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '+ $#,##0.00; - $#,##.00; -- ',
        });
        percentStyle = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '#%; -#%; -',
        });
    }

    static loyaltyPoints(actions){
        return new Promise((resolve, reject) => {
            const wb = new xl.Workbook();
            this.initStyle(wb);
            const ws = wb.addWorksheet('Loyalty point (Manually)');
            addLoyaltyPointsHead(ws);

            let y = 2;
            for(let ax of actions){
                if (!ax.loyalty) continue;
                ws.cell(y, 1).string(time.timestampToDate(ax.date_added, true));
                ws.cell(y, 2).string(ax.loyalty.barcode);
                ws.cell(y, 3).number(ax.s1 / 100).style(priceStyle);
                ws.cell(y, 4).string(ax.data.user.username);
                y++;
            }

            const filename = utils.rndSlug('.xlsx');
            wb.write('files/' + filename, err => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`File "${filename}" was written!`);
                    resolve(filename);
                }
            });

        });
    }

    static cardsBalanceAdjustment(actions, card_type){
        return new Promise((resolve, reject) => {
            if (card_type != 'prepaid' && card_type != 'loyalty'){
                reject(new Error('Invalid card type'));
                return;
            }
            const cardName = card_type == 'prepaid' ? 'Prepaid' : 'Loyalty';
            const wb = new xl.Workbook();
            this.initStyle(wb);
            const ws = wb.addWorksheet(`${cardName} balances adjustment`);
            addBalancesAdjHead(ws);

            let y = 2;
            for (let i = actions.length - 1; i >= 0; i--) {
                let ax = actions[i];
                if (!ax.loyalty && !ax.prepaid) continue;
                ws.cell(y, 1).string(time.timestampToDate(ax.date_added, true));
                ws.cell(y, 2).string(ax[card_type].barcode);
                ws.cell(y, 3).number(ax.s2 / 100).style(priceStyle);
                ws.cell(y, 4).number(ax.s1 / 100).style(priceStyle);
                ws.cell(y, 5).number((ax.s1 - ax.s2) / 100).style(priceStyleWithPositiveSign);
                if(ax.user)
                    ws.cell(y, 6).string(ax.user.username);
                else
                    ws.cell(y, 6).string('---');
                y++;
            }

            const filename = utils.rndSlug('.xlsx');
            wb.write('files/' + filename, err => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`File "${filename}" was written!`);
                    resolve(filename);
                }
            });

        });
    }

}

function addLoyaltyPointsHead(ws){
    const cells = [
        'DATE & TIME', 'Card No.', 'Amount', 'Cashier'
    ];
    const widths = [
        3, 5, 2, 3,
    ];

    for (let i = 0; i < cells.length; i++) {
        const text = cells[i];
        ws.cell(1, i + 1).string(text).style(headStyle);
        ws.column(i + 1).setWidth(widths[i] * 6);
    }
}

function addBalancesAdjHead(ws) {
    const cells = [
        'DATE & TIME', 'Card No.', 'Changed from', 'Changed to', 'Change amount', 'User'
    ];
    const widths = [
        3, 5, 3, 3, 3, 2
    ];

    for (let i = 0; i < cells.length; i++) {
        const text = cells[i];
        ws.cell(1, i + 1).string(text).style(headStyle);
        ws.column(i + 1).setWidth(widths[i] * 6);
    }
}
