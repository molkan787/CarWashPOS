import axios from 'axios';
import _url from './api';
import MxHelper from '@/prs/MxHelper';
import Message from '@/ccs/Message';
import Vue from 'vue';

export default class ClientLoader{

    private static context: any;

    static setup(context: any){
        this.context = context;
    }

    static loadClient(phone: string){
        return new Promise((resolve, reject) => {
            axios.get(_url('clcref/phone/' + phone)).then(({data}) => {
                if(data.status == 'OK'){
                    console.log('loadClient:', data);
                    this.setClientData(data.clientData);
                    resolve(true);
                }else{
                    reject(data.cause);
                    if(data.cause == 'NOT_FOUND'){
                        this.addNewClient(phone);
                    }
                }
            }).catch(error => reject(error));
        });
    }
    static loadLoyaltyCard(barcode: string){
        return new Promise((resolve, reject) => {
            axios.get(_url('clcref/loyalty_card/' + barcode)).then(({data}) => {
                if(data.status == 'OK'){
                    console.log('loadLoyaltyCard:', data);
                    resolve(true);
                    this.setData(data);
                }else{
                    reject(data.cause);
                }
            }).catch(error => reject(error));
        });
    }

    static setData(data: any){
        if(data.clientData){
            this.setClientData(data.clientData);
        }else if(data.loyaltyCard){
            this.setLoyaltyCard(data.loyaltyCard);
        }else if(data.prepaidCard){
            this.setPrepaidCard(data.prepaidCard);
        }
    }

    static setClientData(data: any, doNotCallback?: boolean){
        this.calcReceiptPreference(data);
        this.context.dispatch('setClientData', data);
        this.context.dispatch('setAreaAView', data.id ? 'history' : 'order');
        if(!doNotCallback){
            this.setLoyaltyCard(data.loyalty || {}, true);
        }
    }

    static setLoyaltyCard(data: any, doNotCallback?: boolean){
        const loyaltyCard = this.context.state.loyaltyCard;
        loyaltyCard.id = data.id || 0;
        loyaltyCard.barcode = data.barcode || '';
        loyaltyCard.balance = data.balance || 0;
        loyaltyCard.updateCount++;

        if(!doNotCallback){
            if(data.client){
                this.setClientData(data.client, true);
            }else if(loyaltyCard.id){
                this.linkCard(loyaltyCard.id, 'loyalty');
            }
        }
    }

    static setPrepaidCard(data: any, doNotAsk?: boolean){
        const prepaidCard = this.context.state.prepaidCard;
        prepaidCard.id = data.id || 0;
        prepaidCard.barcode = data.barcode || '';
        prepaidCard.balance = data.balance || 0;
        prepaidCard.updateCount++;
        if(!data.client && prepaidCard.id && !doNotAsk){
            this.linkCard(prepaidCard.id, 'prepaid');
        }
    }

    static calcReceiptPreference(client: any){
        const orders = client.history;
        if(!orders) return;
        let sum = 0;
        for(let i = 0; i < orders.length; i++){
            sum += orders[i].receipt;
        }
        client.want_receipt = Math.round(sum / orders.length);
    }

    static linkCard(cardId: any, cardType: string){
        const clientId = this._getCurrentClientId();
        if(clientId){
            this.askToLinkClient(cardId, cardType);
        }else{
            this.askToAddClient(cardId, cardType);
        }
    }

    static askToAddClient(cardId: any, cardType: string){
        Message.ask(`This ${cardType} card is not linked to any of client phone number, Do you want to link a new client now ?`, 'Add new client?')
        .then((e: any) => {
            e.hide();
            if(e.answer){
                this.addNewClient('', cardId, cardType);
            }
        });
    }

    static askToLinkClient(cardId: any, cardType: string){
        const clientName = this._getCurrentClientName();
        Message.ask(`This ${cardType} card is not linked to any of client phone number,\nDo you want to link it to the current client "${clientName}" ?`, 'Link the card to current client')
        .then((e: any) => {
            if(e.answer){
                e.loading();
                this.patchCardClientId(cardId, cardType).then(() => {
                    e.hide();
                }).catch(err => {
                    e.dialog.show('We could not complete the current action, Please try again.');
                });
            }else{
                e.hide();
            }
        });
    }

    static addNewClient(phone: string, cardId?: any, cardType?: string){
        const data: any = {id: 'new', phone};
        if(cardType == 'loyalty') data.loyaltyCardId = cardId;
        else if(cardType == 'prepaid') data.prepaidCardId = cardId;
        // @ts-ignore
        MxHelper.editClient(data).then((client: any) => {
            client.keepCards = true;
            this.context.dispatch('setClientData', client);
            this.setClientCards(client);
        })
    }

    static setClientCards(client: any){
        const state = this.context.state;
        if(state.prepaidCard.id == 0 && client.prepaid){
            this.setPrepaidCard(client.prepaid, true);
        }
        if(state.loyaltyCard.id == 0 && client.loyalty){
            this.setLoyaltyCard(client.loyalty, true);
        }
    }

    // ------------------------------------

    static patchCardClientId(cardId: any, cardType: string){
        return new Promise((resolve, reject) => {
            axios.post(_url(cardType + '/setClientId'), {
                id: cardId,
                client_id: this.context.state.client.id,
            }).then(({data}) => {
                if(data.status == 'OK'){
                    resolve(true);
                }else{
                    reject(data.cause);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    // ------------------------------------

    static _getCurrentClient(){
        return this.context.state.client;
    }
    
    static _getCurrentClientId(){
        return this.context.state.client.id;
    }
    
    static _getCurrentClientName(){
        const ln = this.context.state.client.last_name;
        return this.context.state.client.first_name + (ln ? ' ' + ln : '');
    }

}