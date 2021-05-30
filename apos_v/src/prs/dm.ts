// @ts-nocheck
import Vue from 'vue';
import axios from 'axios';
import _url from '@/prs/api';
// @ts-ignore
import FormData from 'form-data';

export default class DM{

    private static comu: any;
    private static context: any;
    private static data: any;
    private static cache: any;

    public static setup(context: any, comu: any){
        this.context = context;
        this.comu = comu;
        this.cache = context.state.data;
    }

    public static getClientData(payload: any){
        const {id, phone} = payload;
        if(id){
            return this._getClientData('id', id);
        }else if(phone){
            return this._getClientData('phone', phone);
        }else{
            return new Promise((resolve, reject) => reject());
        }
    }

    public static async editClient(payload: any){
        const {data} = await axios.post(_url('client'), payload);
        if(data.status == 'OK'){
            this.setToCache('clients', payload, data);
            return data;
        }else{
            throw data.cause;
        }
    }

    public static async deleteClient(payload: any){
        const {data} = await axios.delete(_url(`client/${payload.id}`));
        if(data.status == 'OK'){
            this.removeFromCache('clients', payload.id);
            return true;
        }else{
            throw new Error(`Unknow error, Response status: "${data.status}"`);
        }
    }

    public static async editSettings(payload: any){
        const {data} = await axios.post(_url('settings'), payload);
        if(data.status == 'OK'){
            this.comu.putSettings(payload);
            return true;
        }else{
            throw new Error(`Unknow error, Response status: "${data.status}"`);
        }
    }

    public static async editCardBalance(payload: any){
        const {data} = await axios.post(_url('editCardBalance'), payload);
        if(data.status == 'OK'){
            return true;
        }else{
            throw new Error(`Unknow error, Response status: "${data.status}"`);
        }
    }
    
    public static async editCardBarcode(payload: any){
        const {data} = await axios.post(_url('editCardBarcode'), payload);
        if(data.status == 'OK'){
            return true;
        }else{
            throw data.cause;
        }
    }

    public static async deleteCard(payload: any){
        const {data} = await axios.post(_url(payload.type + '/del'), payload);
        if(data.status == 'OK'){
            this.removeFromCache(payload.type, payload.id);
            return true;
        }else{
            throw new Error(`Unknow error, Response status: "${data.status}"`);
        }
    }

    public static async refundOrder(payload: any){
        const {data} = await axios.post(_url('order/refund'), payload);
        if(data.status == 'OK'){
            this.comu.updateStats(data.stats, true);
            return true;
        }else{
            throw new Error(`Unknow error, Response status: "${data.status}"`);
        }
    }

    public static async addLoyaltyPoints(payload: any){
        payload.user = this.context.state.user;
        const { data } = await axios.post(_url('loyalty/addPoints'), payload);
        if (data.status == 'OK') {
            if (this.context.state.loyaltyCard.id == payload.cardId){
                this.context.state.loyaltyCard.balance += payload.amount;
            }
            return true;
        } else {
            throw new Error(`Unknow error, Response status: "${data.status}"`);
        }
    }

    public static async sendFile(payload: any){
        const file = payload.file;
        const data = new FormData();
        data.append('file', file, file.name);

        const resp = await axios.post(_url('import/' + payload.dest), data, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
        });

        if(resp.data.status == 'OK'){
            return true;
        }else{
            throw new Error(`Unknow error, Response status: "${resp.data.status}"`);
        }

    }

    public static async genExportDataFile(payload: any){
        const {data} = await axios.post(_url('export/' + payload.dataName), payload);
        if(data.status == 'OK'){
            return data;
        }else{
            throw new Error(`Unknow error, Response status: "${data.status}"`);
        }
    }

    // -----------------------------------

    private static _getClientData(by: string, ref: any){
        return new Promise(async (resolve, reject) => {
            try {
                let client = this.getFromCache('clients', by, ref);
                if(client){
                    resolve(client);
                }else{
                    const response = await axios.get(_url(`client/${by}/${ref}`));
                    const data = response.data.data;
                    resolve(data);
                }
            } catch (error) {
                reject(error);
            }
        });
    }


    private static getFromCache(dataName: string, filterProp: string, ref: any, multiple?: boolean){
        const data = this.cache[dataName];
        const result = data.filter((item: any) => item[filterProp] == ref);
        if(multiple)
            return result;
        else
            return result.length ? result[0] : null;
    }

    private static setToCache(dataName: string, originData: any, newData: any){
        const data = this.cache[dataName];
        const id = originData.id;
        if(newData.isNew){
            data.unshift(newData);
        }else{
            for(let i = 0; i < data.length; i++){
                const item = data[i];
                if(item.id == id){
                    this.putValues(item, originData);
                    break;
                }
            }
        }
    }

    private static removeFromCache(dataName: string, identifier: any){
        const data = this.cache[dataName];
        const index = data.findIndex((item: any) => item.id == identifier);
        if(index != -1){
            data.splice(index, 1);
        }
    }

    private static putValues(obj: any, values: any){
        for(let k in values){
            if(!values.hasOwnProperty(k)) continue;
            Vue.set(obj, k, values[k]);
        }
    }


}