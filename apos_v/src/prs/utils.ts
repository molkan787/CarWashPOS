import things from './things';
import axios from 'axios';
import _url from './api';

export default class Utils{
    
    static mutateNumber(val: string, key: string, limit: number, decimalLimit: number){
        if(typeof limit == 'number' && val.length >= limit && key != '<') return val;
        if(typeof decimalLimit == 'number' && key != '<'){
            let parts = val.split('.');
            if(parts.length > 1 && parts[1].length >= decimalLimit) return val;
        }

        if(key == '<'){
            val = val.substr(0, val.length - 1);
        }else if (key == '.'){
            if(val.indexOf('.') == -1){
                if(val.length == 0) val += '0';
                val += '.';
            }
        }else{
            if(val.charAt(0) == '0' && val.charAt(1) != '.'){
                val = '';
            }
            val += key;
        }
        return val;
    }

    static addTaxes(value: number){
        const taxes = things.taxes.gst + things.taxes.qst;
        return value * (1 + taxes);
    }

    static preparePrice(value: any){
        return Math.round(parseFloat(value) * 100);
    }

    static mapPrice(value: any){
        return parseInt(value) / 100;
    }

    static roundPrice(value: any){
        return Math.round(parseFloat(value) * 100) / 100;
    }

    static price(value: any){
        let val = parseFloat(value);
        if(val < 0)
            return '- $' + (-val).toFixed(2);
        else
            return '$' + val.toFixed(2);
    }


    static postData(reqPath: string, data: any){
        return new Promise((resolve, reject) => {
            axios.post(_url(reqPath), data).then(({data}) => {
                if(data.status == 'OK'){
                    resolve(data);
                }else{
                    reject(data.cause);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    static deleteData(reqPath: string){
        return new Promise((resolve, reject) => {
            axios.delete(_url(reqPath)).then(({data}) => {
                if(data.status == 'OK'){
                    resolve(data);
                }else{
                    reject(data.cause);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    static formatPhoneNumber (num: string) {
        let result = '';
        for(let i = 0; i < num.length && i < 10; i++){
            if(i == 3 || i == 6)
                result += '-';
            result += num.charAt(i);
        }
        return result;
    }

}