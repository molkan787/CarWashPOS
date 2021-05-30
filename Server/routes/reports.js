const errors = require('restify-errors');
const reports = require('../reports/index');
const security = require('../security');
const resMaker = require('../utils/response');
const time = require('../utils/time');

module.exports = async (req, res, next) => {
    try {
        const filename = await generateReport(req.body);
        const signature = security.signContent(filename);
        res.send(resMaker.success({
            filename,
            signature,
            params: req.body,
        }));
        next();
    } catch (error) {
        console.log(error)
        return next(new errors.InternalError('ERROR:016'));
    }
};

async function generateReport(params){
    const type = params.type;
    let filename = null;
    switch (type) {
        case 'daily-summary':
            filename = await reports.genDailyReports(params.day);
            break;
        case 'weekly-summary':
            filename = await reports.genWeeklyReports(params.date_from, params.date_to);
            break;
        case 'loyalty-points':
            filename = await reports.genLoyaltyPointsAdding(params.date_from, params.date_to);
            break;
        case 'balance-adjust':
            filename = await reports.genBalancesAdjust(params.date_from, params.date_to, params.card_type);
            break;
        default:
            throw new Error('Unknow Reports type.');
    }

    if(filename){
        return filename;
    }else{
        throw new Error('Unknow error occured when generating reports file.');
    }
}