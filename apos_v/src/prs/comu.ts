// @ts-nocheck
import config from '@/config';
import axios from 'axios';
import time from './time';
import _url from './api';
import Products from './dcr/products';
import Clients from './dcr/clients';
import ProductsFactory from './productsFactory';
import PredefinedOrder from './predefinedOrder';
import MxHelper from './MxHelper';
import Dl from './dl';
import Ds from './ds';
import DM from './dm';
import Login from './login';
import ClientLoader from './clientLoader';
import consts from './consts';
import Utils from './utils';
import extUtils from '@/utils';
import Receipt from './receipt';
import Printer from '@/drivers/printer';
import LocalSettings from './localSettings';

export default class Comu{

    private static context: any;
    private static objectsToReset: any[];
    private static prevState: any;
    private static interval: Number;
    private static apiToken: string = '';

    public static settings: typeof LocalSettings;

    static setup(context: any){
        this.context = context;
        this.objectsToReset = [];
        ProductsFactory.setup(context);
        PredefinedOrder.setup(context);
        ClientLoader.setup(context);
        Dl.setup(context);
        Ds.setup(context);
        DM.setup(context, this);
        Receipt.setup(context);
        Login.setup(context, this);

        this.settings = LocalSettings;
        this.settings.load();

        this.updateTime();
        this.interval = setInterval(() => {
            this.updateTime();
        }, 15000);

        try {
            Printer.setup();
        } catch (error) {
            // console.log('Error whilte initiating Printer:', error);
        }


        if(config.debug){
            // @ts-ignore
            window.$store = context;
            // @ts-ignore
            window.$receipt = Receipt;
            this.loadData();
            Login.setUser({
                token: '',
                user: {
                    username: 'system',
                    user_type: 1,
                    id: 1,
                }
            });
            // @ts-ignore
            window.state = context.state;
            // @ts-ignore
            window.comu = this;
        }
        
    }

    static setToken(token: string){
        this.apiToken = token;
        axios.defaults.headers.common['Authorization'] = token;
    }

    static setPaymentDetails(data: any){
        this.context.state.payment = data;
    }

    static activatePrepaidCard(barcode: string, clientData: any, balance: number){
        return new Promise((resolve, reject) => {
            const _data = {
                barcode,
                clientData,
                balance: Utils.preparePrice(balance),
            };
            axios.post(_url('prepaid/add'), _data).then(({data}) => {
                if(data.status == 'OK'){
                    this.context.state.actions.push(data.actionId);
                    resolve(true);
                }else{
                    reject(data.cause);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    static reloadPrepaidCard(barcode: string, amount: number){
        return new Promise((resolve, reject) => {
            const data = {
                barcode,
                amount: Utils.preparePrice(amount),
            };
            axios.post(_url('prepaid/reload'), data).then(({data}) => {
                if(data.status == 'OK'){
                    this.context.state.actions.push(data.actionId);
                    resolve(true);
                }else{
                    reject(data.cause);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    static activateLoyaltyCard(barcode: string, clientData: any){
        return new Promise((resolve, reject) => {
            const data = {
                barcode,
                clientData,
            };
            axios.post(_url('loyalty/add'), data).then(({data}) => {
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

    static getInvoiceId(){
        return this.context.state.nextOrderId;
    }

    static loadData(){
        return new Promise((resolve, reject) => {
            axios.get(_url('asd')).then(response => {
                const data = response.data;
                const state = this.context.state;
                state.categories = data.categories;
                state.products = Products.mapByCategory(data.products, true);
                state.productsByIds = Products.mapById(data.products, false);
                state.productsArray = data.products;
                state.stats = data.stats;
                state.nextOrderId = data.orderPtr;
                state.companies = Clients.prepareData(data.companies);
                this.putSettings(data.settings);
                resolve(true);
            }).catch(error => {
                reject(error);
            })
        });
    }

    static reset(){
        this.context.dispatch('resetPOS');
        this.resetObjects();
    }

    static canRequestPayment(){
        return (!this.context.state.pos.paid && !this.context.state.pos.finished && this.context.state.postingOrder);
    }

    static resetStatus(){
        const state = this.context.state;
        state.pos.paid = false;
        state.pos.finished = false;
        state.postingOrder = false;
    }

    static getOrderTotal(){
        return Utils.preparePrice(this.context.state.pos.values.total);
    }

    static getUser(userId: any){
        const users = this.context.state.data.users.filter((user: any) => user.id == userId);
        return users.length ? users[0] : null;
    }

    public static putSettings(settings: any){
        const state = this.context.state;
        if(settings.gst) state.taxes.gst = settings.gst;
        if(settings.qst) state.taxes.qst = settings.qst;
        if(settings.receipt_msg) state.receipt_msg = settings.receipt_msg;
    }

    // ==================================

    static startSubmission(){
        this.context.state.postingOrder = true;
        // @ts-ignore
        MxHelper.openPayment();
    }

    static postOrder(){
        return new Promise((resolve, reject) => {
            const state = this.context.state;
            const {items, itemsCount} = state.pos;
            const total = Utils.preparePrice(state.pos.values.total);
            const orderData = {
                user_id: state.user.id,
                client_id: state.client.id,
                total,
                totals: state.pos.values,
                items: {
                    products: state.pos.items,
                    counts: state.pos.itemsCount
                },
                other_data: {
                    ticket: state.ticket,
                    reasons: {
                        discount: state.discountReason,
                        extra: state.extraChargeReason,
                        free: state.freeOrderReason,
                    },
                    taxes: state.taxes
                },
                pay_method: state.pos.pay_method,
                receipt: 0,
            };
            const stats = this.getStats(items, itemsCount, state.pos.pay_method, total);
            const data = {
                orderData,
                stats,
                payment: state.payment,
                invoiceData: state.invoiceData,
                loyaltyCardId: state.loyaltyCard.id,
                actions: state.actions,
                cards: {
                    prepaid: state.prepaidCard.id,
                    loyalty: state.loyaltyCard.id,
                },
                taxes: state.taxes,
            }
            console.log(data)
            axios.post(_url('order'), data).then(({data}) => {
                if(data.status == 'OK'){
                    state.stats.cw += stats.cw;
                    state.stats.pp += stats.pp;
                    state.stats.rpp += stats.rpp;
                    state.stats.dt += stats.dt;
                    state.stats.cs += stats.cs;
                    state.stats.cc += stats.cc;
                    state.nextOrderId = data.nextOrderId;
                    state.lastOrderDate = data.date_added;
                    state.loyaltyPoints = data.loyaltyPoints;
                    this.setCardsBalances(data.balances);
                    this.backupState();
                    resolve(true);
                }else{
                    reject(data.cause);
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    static setCardsBalances(cards: any){
        const state = this.context.state;
        if(typeof cards.prepaid == 'number'){
            state.prepaidCard.balance = cards.prepaid;
        }
        if(typeof cards.loyalty == 'number'){
            state.loyaltyCard.balance = cards.loyalty;
        }
    }

    static resetStats(){
        const stats = this.context.state.stats;
        stats.cw = 0;
        stats.pp = 0;
        stats.rpp = 0;
        stats.dt = 0;
        stats.cs = 0;
        stats.cc = 0;
        stats.cxc = 0;
        stats.cxv = 0;
        stats.day = time.today();
    }

    static updateStats(newStats: any, substract?: boolean){
        const dir = substract ? -1 : 1;
        const stats = this.context.state.stats;
        if(stats.day == newStats.day){
            stats.cw += newStats.cw * dir;
            stats.pp += newStats.pp * dir;
            stats.rpp += newStats.rpp * dir;
            stats.dt += newStats.dt * dir;
            stats.cs += newStats.cs * dir; // cs => Cash
            stats.cc += newStats.cc * dir; // cc => Credit Card
            stats.cxc += newStats.cxc * dir; // cxc => Canceled orders count
            stats.cxv += newStats.cxv * dir; // cxv => Canceled orders value
        }
    }

    static markAsPaid(){
        this.context.dispatch('markAsPaid');
        // @ts-ignore
        MxHelper.payment({state: 'posting'});
        this.postOrder().then(() => {
            this.markAsFinished();
            // @ts-ignore
            MxHelper.payment({state: 'success'});
        }).catch(error => {
            this.resetStatus();
            // @ts-ignore
            MxHelper.payment({state: 'fail', error});
        });
    }
    static markAsFinished(){
        this.context.dispatch('markAsFinished');
    }

    static setFreeOrderReason(reason: string){
        this.context.state.freeOrderReason = reason;
    }

    static setInvoiceData(payload: any){
        this.context.state.invoiceData.clientName = payload.clientName || '';
        this.context.state.invoiceData.card = payload.card || null;
    }

    // ==================================

    static printReceipt(_state?: any){
        console.log('Printing receipt');
        const state = _state || this.context.state;
        const order_id = state.nextOrderId - 1;
        axios.post(_url('setReceiptFlag'), {order_id}).catch(() => {});
        
        const data = {
            id: order_id,
            date_added: state.lastOrderDate,
            cashier: state.user,
            client: state.client,
            products: state.pos.items,
            counts: state.pos.itemsCount,
            totals: state.pos.values,
            pay_method: state.pos.pay_method,
            payment: state.payment,
            loyaltyCard: state.loyaltyCard,
            prepaidCard: state.prepaidCard,
            invoiceData: state.invoiceData,
            taxes: state.taxes,
        };

        Receipt.print(data);

        // Print 2 receipts when payment methods is invoice_ari
        if(state.pos.pay_method == 'invoice_ari'){
            setTimeout(() => Receipt.print(data), 800);
        }
    }

    static reprintReceipt(){
        this.printReceipt(this.prevState);
    }

    static backupState(){
        const state = this.context.state;
        const _state = {
            nextOrderId: state.nextOrderId,
            lastOrderDate: state.lastOrderDate,
            user: state.user,
            client: state.client,
            pos: state.pos,
            payment: state.payment,
            loyaltyCard: state.loyaltyCard,
            prepaidCard: state.prepaidCard,
            taxes: state.taxes,
        };
        this.prevState = JSON.parse(JSON.stringify(_state));
    }

    static registerToReset(obj: any){
        this.objectsToReset.push(obj);
    }

    static resetObjects(){
        for(let i = 0; i < this.objectsToReset.length; i++){
            const obj = this.objectsToReset[i];
            if(typeof obj.reset != 'undefined'){
                obj.reset();
            }
        }
    }

    static switchMode(demo: boolean){
        config.demoMode = demo;
        this.context.state.demoMode = demo;
    }


    // ---------------------------------

    static updateTime(){
        this.context.state.currentTime = extUtils.getCurrentTime();
        if(this.context.state.currentTime == '00:00'){
            this.resetStats();
        }
    }

    // ---------------------------------

    private static getStats(items: any[], itemsCount: any, paym, total){
        const washesCats = [1, 2, 6, 7];
        const stats = {
            cw: 0,
            pp: 0,
            rpp: 0,
            dt: 0,
            cs: paym == 'cash' ? total : 0,
            cc: paym == 'card' ? total : 0
        };
        for(let i = 0; i < items.length; i++){
            const item = items[i];
            const c = itemsCount[item.id];
            if(item.id == consts.newPrepaidCardItemId){
                stats.pp += c;
            }else if(item.id == consts.reloadPrepaidCardItemId){
                stats.rpp += c;
            }else if(item.category_id == 3){
                stats.dt += c;
            }else if(washesCats.includes(item.category_id)){
                stats.cw += c;
            }
        }
        return stats;
    }

    public static setExactPaid(){
        // @ts-ignore
        MxHelper.setExactPaid();
    }
}