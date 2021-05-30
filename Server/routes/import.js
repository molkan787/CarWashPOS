const errors = require('restify-errors');
const resMaker = require('../utils/response');
const DataImporter = require('../dataImporter/index');
const XLSX = require('xlsx')

module.exports = async (req, res, next) => {
    try {
        
        if(req.files){
            for (var key in req.files) {
                if (req.files.hasOwnProperty(key)) {

                    await importData(req.files[key].path, req.params.dest);

                //   fs.renameSync(request.files[key].path, `${__dirname}/../uploads/${request.files[key].name}`);
                //   fs.unlink(request.files[key].path);
                }
            }
        }else{
            return next(new errors.InvalidContentError('No file sent to import.'));
        }

        res.send(resMaker.success());
        next();
    } catch (error) {
        console.log(error)
        return next(new errors.InternalError('ERROR:024'));
    }
};

async function importData(file, dest){
    const workbook = XLSX.readFile(file);
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    await DataImporter.import(xlData, dest);
}