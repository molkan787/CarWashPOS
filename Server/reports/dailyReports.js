const xlBuilder = require('../Helpers/xlBuilder')
const Reconcile = require('./reconcile')
const Sales = require('./sales')
const utils = require('../utils/utils')

module.exports = class DailyReports{

    static async gen(data, sales){
        const xb = new xlBuilder('Reconcile', {author: 'APOS'})
        Reconcile.put(xb, data)
        xb.createWorksheet('Sales')
        xb.fontSize = 10
        Sales.put(xb, sales)
        const filename = utils.rndSlug('.xlsx')
        await xb.writeFile('files/' + filename)
        return filename;
    }

}