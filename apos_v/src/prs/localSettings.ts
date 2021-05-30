import config from '../config';

const defaultSetting = {
    barcodeAutoFill: true,
};

export default class LocalSetting{

    private static _values: any;

    static load(){
        const raw = window.localStorage.getItem(config.localSettingsKey);
        const obj = JSON.parse(raw || '{}');
        this._values = obj;
    }

    static getItem(key: string){
        let val = this._values[key];
        if(typeof val == 'undefined'){
            // @ts-ignore
            return defaultSetting[key];
        }else{
            return val;
        }
    }

    static setItem(key: string, value: any){
        this._values[key] = value;
        this.save();
    }


    private static save(){
        const raw = JSON.stringify(this._values);
        window.localStorage.setItem(config.localSettingsKey, raw);
    }
}