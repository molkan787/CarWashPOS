const xl = require('excel4node');
const Schema = require('../dataImporter/schema');
const utils = require('../utils/utils');
const PrepaidCard = require('../models/PrepaidCard');
const LoyaltyCard = require('../models/LoyaltyCard');
const Action = require('../Actions/Action');
const AC = require('../Actions/ActionConsts');
const time = require('../utils/time');

module.exports = class DataExporter{

    static async export(dataName){
        const parts = dataName.split(':');
        const dn = parts[0];
        switch (dn) {
            case 'prepaids':
                return await exportPOLCards('prepaids');
            case 'loyalties':
                return await exportPOLCards('loyalties');
            case 'prepaid':
                return await exportPOLCardHistory(dn, parseInt(parts[1]));
            case 'loyalty':
                return await exportPOLCardHistory(dn, parseInt(parts[1]));
            default:
                return null;
        }
    }

}

async function exportPOLCards(type){
    let cards;
    if(type == 'prepaids'){
        cards = await PrepaidCard.query().eager('client');
    }else if(type == 'loyalties'){
        cards = await LoyaltyCard.query().eager('client');
    }
    if(cards){
        return await genPOLCardsExcelFile(cards, type);
    }else{
        throw new Error('Unknow POLCard type');
    }
}

async function exportPOLCardHistory(type, id){
    const model = type == 'prepaid' ? PrepaidCard : LoyaltyCard;
    const card = await model.query().findById(id);
    const actions = await Action.getBulkByRef({ref2: id});
    return await genPOLCardHistoryFile(card, actions, type);
}

// -------------------------------------------

function genPOLCardsExcelFile(cards, type){
    return new Promise((resolve, reject) => {
        const name = (type == 'prepaids' ? 'Prepaid' : 'Loyalty') + ' Cards';
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(name);
        const priceStyle = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '$#,##0.00; - $#,##.00; $0.00',
        });
    
        ws.column(1).setWidth(32);
        ws.column(3).setWidth(4);
        ws.column(4).setWidth(16);
        ws.column(5).setWidth(16);
        ws.cell(1, 1).string(Schema.barcode);
        ws.cell(1, 2).string(Schema.balance);
        ws.cell(1, 4).string('Client name');
        ws.cell(1, 5).string('Phone number');
    
        const l = cards.length;
        let y = 2;
        for(let i = l - 1; i >= 0; i--){
            const card = cards[i];
            ws.cell(y, 1).string(card.barcode);
            ws.cell(y, 2).number(card.balance / 100).style(priceStyle);
            if(card.client){
                const c = card.client;
                const fullname = c.first_name + ' ' + c.last_name;
                ws.cell(y, 4).string(fullname);
                ws.cell(y, 5).string(formatPhoneNumber(c.phone));
            }
            y++;
        }
    
        const filename = utils.rndSlug('.xlsx');
        wb.write('files/' + filename, err => {
            if(err){
                reject(err);
            }else{
                console.log(`File "${filename}" was written!`);
                resolve(filename);
            }
        });
    });
}

function formatPhoneNumber(num){
    let result = '';
    for(let i = 0; i < num.length && i < 10; i++){
        if(i == 3 || i == 6)
            result += '-';
        result += num.charAt(i);
    }
    return result;
}

function genPOLCardHistoryFile(card, actions, type){
    return new Promise((resolve, reject) => {
        const name = (type == 'prepaid' ? 'Prepaid' : 'Loyalty') + ' Card';
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet(name);
        const priceStyle_wps = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '$#,##0.00; - $#,##.00; $0.00',
        });
        const priceStyle = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '+ $#,##0.00; - $#,##.00; $0.00',
        });
        const headStyle = wb.createStyle({
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
        });
    
        ws.column(1).setWidth(28);
        ws.column(2).setWidth(24);
        ws.column(4).setWidth(24);
        ws.cell(1, 1).string(name);
        ws.cell(1, 2).string(card.barcode);
        ws.cell(2, 1).string('Current Balance');
        ws.cell(2, 2).number(card.balance / 100).style(priceStyle_wps);

        ws.cell(4, 1).string('Date').style(headStyle);
        ws.cell(4, 2).string('Action type').style(headStyle);
        ws.cell(4, 3).string('Amount').style(headStyle);

        const l = actions.length;
        let y = 0;
        for(let ax of actions){
            if(!checkType(ax, type)) continue;
            const _y = l - y + 4;
            ws.cell(_y, 1).string(time.timestampToDate(ax.date_added, true));
            ws.cell(_y, 2).string(getXTypeText(ax.ax_type));
            ws.cell(_y, 3).number(getAffectingValue(ax)).style(priceStyle);
            if(ax.reversed){
                ws.cell(_y, 4).string('REVERSED/CANCELED');
            }
            y++;
        }
    
        const filename = utils.rndSlug('.xlsx');
        wb.write('files/' + filename, err => {
            if(err){
                reject(err);
            }else{
                console.log(`File "${filename}" was written!`);
                resolve(filename);
            }
        });
    });
}

function checkType(ax, polType){
    const xtype = ax.ax_type;
    if(polType == 'prepaid'){
        return (xtype >= 10 && xtype < 20);
    }else if(polType == 'loyalty'){
        return (xtype >= 20 && xtype < 30);
    }else{
        return false;
    }
}

function getXTypeText(xtype){
    switch (xtype) {
        case AC.TYPE_PREPAID_ACTIVATION:
            return 'Initial Balance';
        case AC.TYPE_PREPAID_RELOAD:
            return 'Reload';
        case AC.TYPE_PREPAID_DEBIT:
            return 'Redeem';
        case AC.TYPE_PREPAID_BALANCE_ADJUST:
            return 'Balance Adjustment';
        case AC.TYPE_LOYALTY_BALANCE_ADJUST:
            return 'Balance Adjustment';
        case AC.TYPE_LOYALTY_DEBIT:
            return 'Redeem';
        case AC.TYPE_LOYALTY_POINT_ADD:
            return 'Point added';
        case AC.TYPE_LOYALTY_POINT_ADD_AFTER_SALE:
            return 'Point added (Manually)';
        default:
            return '';
    }
}

function getAffectingValue(ax){
    const xt = ax.ax_type;
    if(xt == AC.TYPE_PREPAID_DEBIT || xt == AC.TYPE_LOYALTY_DEBIT){
        return ax.s1 / -100;
    }else if(xt == AC.TYPE_PREPAID_BALANCE_ADJUST || xt == AC.TYPE_LOYALTY_BALANCE_ADJUST){
        return (ax.s1 - ax.s2) / 100;
    }else{
        return ax.s1 / 100;
    }
}