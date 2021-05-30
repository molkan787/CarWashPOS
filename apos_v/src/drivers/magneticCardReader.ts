// @ts-nocheck
import { parsePaymentCardMagneticStripe } from 'payment-card-magnetic-stripe-parser';
window.parsePaymentCardMagneticStripe = parsePaymentCardMagneticStripe;

const SCHEME = /;\d+=\d+É/;
const TIMEOUT = 100;

export default class MagneticCardReader{

    static setup(){
        this.timer = null;
        this.buffer = [];
        document.body.addEventListener('keydown', e => this._keydown(e));
        // document.body.addEventListener('input', console.log);
    }

    static _keydown({ key }){
        this.buffer.push(key);
        this._scheduleFlush();
    }

    static flush(){
        console.log('buffer', this.buffer)
        const b = this.buffer;
        if(b.length > 20 && SCHEME.test(b)){
            this._dispatchEvent(b);
        }
        this.buffer = [];
    }

    static _dispatchEvent(data){
        console.log('Card Swipded:', data);
    }

    static _scheduleFlush(){
        if(this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.flush(), TIMEOUT);
    }

}
