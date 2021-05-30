const AC = require('./ActionConsts');
const PrepaidCard = require('../models/PrepaidCard');
const LoyaltyCard = require('../models/LoyaltyCard');

module.exports = class ActionOrderGroup{

    static async reverse(ax){
        switch (ax.ax_type) {
            case AC.TYPE_PREPAID_ACTIVATION:
                await undoPrepaidActivation(ax);
                break;
            case AC.TYPE_PREPAID_RELOAD:
                await undoPrepaidReload(ax);
                break;
            case AC.TYPE_LOYALTY_POINT_ADD:
                await undoLoyaltyPointAdd(ax);
                break;
            case AC.TYPE_PREPAID_DEBIT:
                await undoPrepaidDebit(ax);
                break;
            case AC.TYPE_LOYALTY_DEBIT:
                await undoLoyaltyDebit(ax);
                break;
            default:
                break;
        }
    }

}

async function undoPrepaidActivation(ax){
    await PrepaidCard.query().deleteById(ax.ref2);
}

async function undoPrepaidReload(ax){
    await PrepaidCard.addBalance(ax.ref2, -ax.s1);
}

async function undoLoyaltyPointAdd(ax){
    await LoyaltyCard.addValue(ax.ref2, -ax.s1);
}

async function undoPrepaidDebit(ax){
    await PrepaidCard.addBalance(ax.ref2, ax.s1);
}

async function undoLoyaltyDebit(ax){
    await LoyaltyCard.addValue(ax.ref2, ax.s1);
}