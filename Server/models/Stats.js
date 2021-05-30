const {Model, raw} = require('objection');
const time = require('../utils/time');

const tz_offset = 3600 * 4;

module.exports = class Stats extends Model{

    static get tableName(){
        return 'stats';
    }

    static get jsonSchema(){
        return  {
          type: 'object',
          required: ['day'],

          properties: {
            day: { type: 'integer' },
            date_added: { type: 'integer' },
            cw: { type: 'integer' },
            pp: { type: 'integer' },
            rpp: { type: 'integer' },
            dt: { type: 'integer' },
            cs: { type: 'integer' },
            cc: { type: 'integer' },
            cxc: { type: 'integer' },
            cxv: { type: 'integer' },
          }
          
        };
    }

    static add(values){
        return new Promise(async (resolve, reject) => {
            try {
                const fields = {};
                for(let name in values){
                    if(!values.hasOwnProperty(name)) continue;
                    fields[name] = raw(name + this.formatExp('+', values[name]));
                }
                const {day} = await this.getTodays();
                await this.query().patch(fields).where({day});
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

    static substract(values, date){
        return new Promise(async (resolve, reject) => {
            try {
                const fields = {};
                for(let name in values){
                    if(!values.hasOwnProperty(name)) continue;
                    fields[name] = raw(name + this.formatExp('-', values[name]));
                }
                let day = 0;
                if(date) day = date;
                else day = (await this.getTodays()).day;
                await this.query().patch(fields).where({day});
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

    static formatExp(op, value){
        let val = parseInt(value);
        const neg = val < 0;
        if(neg){
            val *= -1;
            if(op == '+') op = '-';
            else op = '+';
        }
        return ` ${op} ${val}`;
    }

    static getTodays(dateKey){
        return new Promise(async (resolve, reject) => {
            const today = dateKey || time.getDateKey();
            try {
                let stats = await this.query().findOne({day: today});
                if(stats){
                    resolve(stats);
                }else{
                    stats = await this.query().insert({
                        day: today,
                        date_added: time.now()
                    });
                    stats = {
                        ...stats,
                        cw: 0, pp: 0, rpp: 0, dt: 0,
                        cs: 0, cc: 0, cxc: 0, cxv: 0,
                    }
                    resolve(stats);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

}