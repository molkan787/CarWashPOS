<template>
    <Modal class="root" v-model="open" :loading="loading" :title="title" :dialog="dialogData">

        <template v-slot:default>
            <h2>Total: {{ pos.values.total | price }}</h2>
            <CashPayment @message="childMessage" :bus="bus" v-if="pos.pay_method == 'cash'"/>
            <POLCardPayment @message="childMessage" :bus="bus" v-if="pos.pay_method == 'prepaid' || pos.pay_method == 'loyalty'"/>
            <CardPayment @message="childMessage" :bus="bus" v-if="pos.pay_method == 'card'"/>
            <OtherPayment @message="childMessage" :bus="bus" v-if="pos.pay_method == 'other'"/>
            <InvoicePayment @message="childMessage" :bus="bus" v-if="pos.pay_method == 'invoice_ari'"/>
        </template>

        <template v-slot:buttons>
            <sui-button v-if="pos.finished" @click="printReceipt" icon="file alternate" :loading="printBtnLoading">Print Receipt</sui-button>
            <sui-button v-if="pos.finished" @click="close">Close</sui-button>
            <sui-button v-else @click="cancel">Cancel</sui-button>
        </template>

    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Modal from '../../Elts/Modal.vue';
import Comu from '@/prs/comu';
import MxHelper from '@/prs/MxHelper';
import texts from '@/prs/texts';
import { mapActions, mapState } from 'vuex';
import { Prop } from 'vue-property-decorator';

import CashPayment from './CashPayment.vue';
import POLCardPayment from './POLCardPayment.vue';
import CardPayment from './CardPayment.vue';
import OtherPayment from './OtherPayment.vue';
import InvoicePayment from './InvoicePayment.vue';
import Payments from '@/prs/payments';

@Component({
    components: {
        Modal,
        CashPayment,
        POLCardPayment,
        CardPayment,
        OtherPayment,
        InvoicePayment,
    },
    computed: mapState(['pos']),
    methods: mapActions(['endOrderPosting'])
})
export default class PaymentModal extends Vue{

    private title: string = '';

    private open: boolean = false;
    private loading: boolean = false;
    private bus: any = new Vue();
    private dialogData: any = {};

    private printBtnLoading = false;

    printReceipt(){
        // @ts-ignore
        Comu.printReceipt();
        this.printBtnLoading = true;
        setTimeout(() => this.printBtnLoading = false, 1500);
    }

    close(){
        this.open = false;
        // @ts-ignore
        this.endOrderPosting();
    }

    cancel(){
        this.close();
        Payments.cancelPayment();
    }

    handle(payload: any){
        if(payload){
            if(payload.state == 'posting'){
                this.loading = true;
            }else if(payload.state == 'success'){
                this.loading = false;
            }else if(payload.state == 'fail'){
                if(payload.error == 'BALANCE_TOO_LOW'){
                    this.dialog(`The balance on this ${this.getCardName()} is insufficient for this order.`);
                }else if(payload.error == 'CARD_DOES_NOT_EXIST'){
                    this.dialog(`This ${this.getCardName()} is not activated.`);
                // @ts-ignore
                }else if(typeof payload.error.xError == 'undefined'){
                    this.dialog('An unknow error occured, We could not complete the current action.');
                }
            }
        }
    }

    openThis(){
        if(this.open) return;
        // @ts-ignore
        this.title = 'Payment: ' + texts.payments[this.pos.pay_method];
        this.resetDialog();
        this.open = true;
        // @ts-ignore
        this.bus.$emit('start', this.pos.pay_method);
    }

    getCardName(){
        // @ts-ignore
        return this.pos.pay_method == 'prepaid' ? 'Prepaid Card' : 'Loyalty Card';
    }

    childMessage(msg: string){
        this.dialog(msg);
    }
    // =====================================

    dialog(text: string, ref?: string){
        this.loading = false;
        this.dialogData.text = text;
        this.dialogData.ref = ref;
        this.dialogData.open = true;
    }

    resetDialog(){
        this.dialogData = {
            open: false,
            text: '',
            ref: '',
        };
    }

    created(){
        MxHelper.registerFunction('payment', this);
        MxHelper.registerFunction('openPayment', () => this.openThis());
        this.bus.$on('posting', () => {
            this.loading = true;
        });
        this.bus.$on('message', (msg: string) => {
            this.dialog(msg, 'child');
        });
    }
}
</script>

<style lang="scss" scoped>
h2{
    margin-bottom: 0;
    text-align: center;
    font-size: 2.3rem;
}
.root{
    text-align: center;
}
</style>
