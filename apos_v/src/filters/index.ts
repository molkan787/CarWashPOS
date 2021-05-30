import price from './price';
import price_m from './price_m';
import paym from './paym';
import time2date from './time2date';
import other from './other';

export default {
    install(Vue: any) {
        Vue.filter('price', price);
        Vue.filter('price_m', price_m);
        Vue.filter('paym', paym);
        Vue.filter('ts2date', time2date.ts2date);
        Vue.filter('ts2datetime', time2date.ts2datetime);

        for(let name in other){
            if(other.hasOwnProperty(name)){
                // @ts-ignore
                Vue.filter(name, other[name]);
            }
        }
    }
}