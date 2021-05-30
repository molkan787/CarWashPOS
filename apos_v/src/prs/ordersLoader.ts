import axios from 'axios';
import _url from '@/prs/api';

export default class OrdersLoader{

    static load(filters: any){
        return new Promise(async (resolve, reject) => {
            try {
                const {data} = await axios.get(_url('orders'), {data: filters});
                if(data.status == 'OK')
                    resolve(data);
                else
                    reject(data.cause);
            } catch (error) {
                reject(error);
            }
        });
    }

}