<template>
    <div>
        <h2>Total: {{ pos.values.total | price }}</h2>
        <h3>
            <span v-if="disabled" class="sub-s">Amount: ---</span>
            <span v-else class="sub-s">Amount: ${{ paid }}</span>
            
            <span v-if="disabled" class="second sub-s">Change: ---</span>
            <span v-else class="second sub-s">
                Change:
                <span :class="{
                    positive: pos.values.changeDue > 0,
                    negative: pos.values.changeDue < 0
                }">{{ pos.values.changeDue | price }} </span>
            </span>
        </h3>
        <ButtonsGrid @buttonClick="buttonClicked" class="buttonsGrid" :buttons="cashButtons" />
        <KeyPad @keyPressed="changePaid" />
        <sui-button onclick="window.PaymentsComponent.focusBRI()" color="grey" class="submit" :loading="loading" @click="submit" :disabled="pos.items.length == 0 || !pos.pay_method" >
            Submit
            <i class="arrow right icon"></i>
        </sui-button>

        <div v-if="disabled" class="dimmer"></div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {mapState, mapActions} from 'vuex';
import KeyPad from '../../Elts/KeyPad.vue';
import ButtonsGrid from '../../Elts/ButtonsGrid.vue';
import Comu from '@/prs/comu';
import PrsUtils from '@/prs/utils';
import MxHelper from '@/prs/MxHelper';
import BRI from '@/ccs/BRI';

@Component({
    components: {
        KeyPad,
        ButtonsGrid,
    },
    computed: {
        ...mapState(['pos'])
    },
    methods: {
        ...mapActions(['setPaidCash'])
    },
    watch: {
        "pos.pay_method": function (){
            // @ts-ignore
            this.updateState();
        }
    }
})
export default class Payments extends Vue{
    private paid: string = '';
    private change: number = 7;
    private loading: boolean = false;
    private isSetBySystem: boolean = false;

    private disabled: boolean = false;

    private cashButtons = [
        {text: '$ 10', key: '10'},
        {text: '$ 20', key: '20'},
        {text: '$ 30', key: '30'},
        {text: '$ 40', key: '40'},
        {text: '$ 50', key: '50'},
        {text: '$ 100', key: '100'},
        {text: 'Exact', key: '='},
        {text: 'Clear', key: '!'},
    ];

    submit(){
        // @ts-ignore
        Comu.startSubmission();
    }

    focusBRI(){
        // @ts-ignore
        const paym = this.pos.pay_method;
        if(paym == 'prepaid' || paym == 'loyalty'){
            BRI.focus('pol_card_pay');
        }
    }

    buttonClicked(key: string){
        if(key == '!'){
            this.paid = '';
        }else if(key == '='){
            // @ts-ignore
            this.paid = this.pos.values.total.toFixed(2);
        }else{
            this.paid = key;
        }
        this.pushPaidAmount();
    }

    changePaid(key: string){
        if(this.isSetBySystem && key != '<'){
            this.paid = '';
        }
        this.isSetBySystem = false;
        this.paid = PrsUtils.mutateNumber(this.paid, key, 6, 2);
        this.pushPaidAmount();
    }

    pushPaidAmount(){
        // @ts-ignore
        this.setPaidCash(parseFloat(this.paid || 0));
    }

    setExact(){
        // @ts-ignore
        if(this.pos.values.total == 0){
            this.paid = '';
        }else{
            // @ts-ignore
            this.paid = this.pos.values.total.toFixed(2);
        }
        this.pushPaidAmount();
        this.isSetBySystem = true;
    }

    updateState(){
        // @ts-ignore
        this.disabled = this.pos.pay_method != 'cash';
    }

    reset(){
        this.paid = '';
    }

    created(){
        Comu.registerToReset(this);
        MxHelper.registerFunction('setPaidAmount', (amount: string) => {
            this.buttonClicked(amount);
        });
        MxHelper.registerFunction('setExactPaid', () => this.setExact() );
        // @ts-ignore
        window.PaymentsComponent = this;
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
h2{
    margin-bottom: 0;
    position: relative;
    z-index: 10;
}
h3{
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    span.sub-s{
        text-align: left;
        display: inline-block;
        width: 50%;
        padding-left: 1rem;
        &.second{
            padding-left: 1.5rem;
        }
        span{
            &.positive{
            color: $green;
            }
            &.negative{
                color: $red;
            }
        }
    }
}
.buttonsGrid{
    margin-top: 1rem !important;
    margin-bottom: 0.5rem !important;
}
.submit{
    width: 24rem;
    margin: auto;
    margin-top: 0.5rem;
    height: 3.5rem;
    box-shadow: 1px 1px 6px #ccc;
    font-size: 1.3rem;
    position: relative;
    z-index: 10;
    i{
        padding-left: 0.5rem;
        margin-right: -1rem !important;
    }
}
.dimmer{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: 0.8;
}
</style>
