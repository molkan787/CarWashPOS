<template>
    <div>
        <hr>
        <h2>
            <i class="icon credit card"></i>
            Credit/Debit Card
        </h2>
        
        <div class="ui icon message" :class="colorClass">
            <i :class="icon"></i>
            <div class="content">
                <div class="header">
                {{title}}
                </div>
                <p>{{message}}</p>
            </div>
        </div>
        
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import BarcodeInput from '../../pre/BarcodeInput.vue';
import { mapState, mapActions } from 'vuex';
import Payments from '@/prs/payments';

@Component({
    computed: mapState(['pos']),
    methods: mapActions(['markAsPaid']),
})
export default class CardPayment extends Vue{

    @Prop({default: {}}) bus!: any;
    private title: string = '';
    private message: string = '';
    private icon: string = '';
    private colorClass: string = '';

    statusUpdate(status: any){
        if(status == 'READY'){
            this.title = 'Credit Card Terminal is Ready';
            this.message = 'Waiting for Card Swipe...';
            this.icon = 'bullseye icon';
            this.colorClass = 'info';
        }else if(status == 'PAID'){
            this.title = 'Payment was approved!';
            this.message = 'Please wait until the order get submitted...';
            this.icon = 'circle check icon';
            this.colorClass = 'success';
        }else if(status == 'DECLINED'){
            this.title = 'Payment was DECLINED!';
            this.message = 'The bank declined the payment.';
            this.icon = 'ban icon';
            this.colorClass = 'warning';
        }else if(status == 'FINISHED'){
            this.title = 'Payment was approved and the order submitted!';
            this.message = 'The order was successfully submitted.';
            this.icon = 'circle check icon';
            this.colorClass = 'success';
        }else if(status.xError){
            this.title = 'Terminal Error.';
            this.message = status.xError;
            this.icon = 'close circle icon';
            this.colorClass = 'warning';
        }else{
            this.title = 'An unknow error occured.';
            this.message = 'An unknow error occured during the request of payment.';
            this.icon = 'close circle icon';
            this.colorClass = 'warning';
        }
    }
    start(talkingTo: string){
        if(talkingTo !== 'card') return;
        this.reset();
        Payments.requestPayment('card', {
            callback: (status: string) => {
                this.statusUpdate(status);
            }
        });
    }

    checkStatus(){
        // @ts-ignore
        if(this.pos.finished){
            this.statusUpdate('FINISHED');
        }
    }

    reset(){
        this.title = 'Preparing';
        this.message = 'Please wait until Credit Card Terminal get ready...';
        this.icon = 'notched circle loading icon';
        this.colorClass = '';
    }

    created() {
        // @ts-ignore;
        this.bus.$on('start', this.start);
        this.$store.watch(
            state => state.pos.finished,
            () => {
                this.checkStatus();
            }
        );
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';

h2{
    text-align: center;
}
hr{
    margin: 2rem 0 1.5rem 0;
}
</style>
