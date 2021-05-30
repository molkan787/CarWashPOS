const xlBuilder = require('../Helpers/xlBuilder')
const Summary = require('./summary')
const Sales = require('./sales')
const utils = require('../utils/utils')

module.exports = class WeeklyReports{

    static async gen(data, sales){
        const xb = new xlBuilder('Summary')
        xb.fontSize = 10
        Summary.put(xb, data)
        xb.createWorksheet('Sales')
        Sales.put(xb, sales);
        const filename = utils.rndSlug('.xlsx')
        await xb.writeFile('files/' + filename)
        return filename;
    }

}