const Reports = require('./reports');

module.exports = class TESTING{

    static do(){
        // this.createDailySummary();
    }

    static createDailySummary(){
        Reports.genWeeklyReports(1576105200, 1576623600)
    }

}