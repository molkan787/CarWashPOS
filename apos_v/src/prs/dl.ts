import axios from 'axios';
import _url from './api';
import utils from '@/utils';

export default class Dl{

    private static context: any;

    static setup(context: any){
        this.context = context;
    }

    static getPrepaidCards(filters?: any){
        const _filters = this.dateRangePrepare(filters);
        return this.getData('prepaid/get', _filters, 'prepaid');
    }

    static getLoyaltyCards(filters?: any){
        const _filters = this.dateRangePrepare(filters);
        return this.getData('loyalty/get', _filters, 'loyalty');
    }

    static getClients(filters?: any){
        const _filters = this.dateRangePrepare(filters);
        return this.getData('clients', _filters, 'clients');
    }

    static getOrders(filters?: any){
        const _filters = this.dateRangePrepare(filters);
        return this.getData('orders', _filters, 'orders');
    }

    static getUsers(filters?: any){
        return this.getData('users', filters, 'users');
    }

    // -----------------------------

    private static getData(req: string, payload: any, dataName?: string){
        return new Promise((resolve, reject) => {
            axios.post(_url(req), payload).then(response => {
                this.setData(response.data, dataName || false);
                resolve(response.data);
            }).catch(error => {
                reject(error);
            });
        });
    }


    private static setData(data: any, name: any){
        if(name){
            this.context.dispatch('setData', {
                name,
                data: data.items,
            });
        }
    }

    // -----------------------------
    // Utils

    static dateRangePrepare(filters: any){
        return this.prepareFilters(filters, {
            date_from: utils.dateToTimestamp,
            date_to: utils.dateToTimestamp,
        });
    }

    static prepareFilters(filters: any, mappers: any){
        const result: any = {};
        for(let key in filters){
            if(!filters.hasOwnProperty(key)) return;
            const value = filters[key];
            if(value){
                if(mappers[key]){
                    result[key] = mappers[key](value);
                }else{
                    result[key] = value;
                }
            }
        }
        return result;
    }

}