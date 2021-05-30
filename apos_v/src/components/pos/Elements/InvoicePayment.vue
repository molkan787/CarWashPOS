<template>
    <div>
        <hr>
        <h2>
            Invoice / Ari
        </h2>
        <template v-if="card">
            <table class="card-info-table">
                <body>
                    <tr class="title">
                        <td colspan="2">
                            Card Detected
                            <i v-if="!pos.finished" @click="removeCardClick" title="Remove Card" class="close icon"></i>
                        </td>
                    </tr>
                    <tr class="data-row">
                        <td>Card Number:</td>
                        <td>{{ card.number }}</td>
                    </tr>
                    <tr class="data-row">
                        <td>Expiration date:</td>
                        <td>{{ card.expirationDate }}</td>
                    </tr>
                    <tr>
                        <td colspan="2"> </td>
                    </tr>
                </body>
            </table>
        </template>
        <template v-else>
            <LabeledInput class="company-input" label="Company" ph="Company or Swipe card" v-model="current" :disabled="pos.finished" />
        </template>
        <div>
            <sui-button  class="btn" :icon="pos.finished ? 'circle check' : ''" size="large"
            :class="pos.finished ? 'green' : ''" @click="finish">
                <span v-if="pos.finished">Finished</span>
                <span v-else>Finish</span>
            </sui-button>
        </div>
    </div>
</template>

<script lang="ts">
// @ts-nocheck
import { parsePaymentCardMagneticStripe } from 'payment-card-magnetic-stripe-parser';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { mapState, mapActions } from 'vuex';
import Payments from '@/prs/payments';
import LabeledInput from '../../Elts/inputs/LabeledInput.vue';
const CARD_ABA_FORMAT = /;\d{10,19}=\d{4,40}É/gm; // ABA FORMAT
const CARD_IATA_FORMAT = /%B\d{10,19}\^.+\^\d{4,40}\?/gm; // IATA FORMAT
@Component({
    components: {
        LabeledInput,
    },
    computed: mapState(['pos', 'companies']),
    methods: mapActions(['setClientId']),
})
export default class InvoicePayment extends Vue{

    private current: string = '';
    private card: {
        expirationDate: string,
        number: string
    } = null;

    @Watch('current')
    currentChanged(){
        const solidInput = this.current.replace(/\s/g, '');
        if(solidInput.length > 20){
            let essesialPart = false;
            if(CARD_ABA_FORMAT.test(solidInput)) essesialPart = solidInput.match(CARD_ABA_FORMAT)[0];
            else if(CARD_IATA_FORMAT.test(solidInput)) essesialPart = solidInput.match(CARD_IATA_FORMAT)[0];
            if(!essesialPart) return;
            this.parseCardData(essesialPart);
            this.$nextTick(() => this.current = '');
        }
    }

    parseCardData(rawData){
        const data = parsePaymentCardMagneticStripe(rawData);
        if(data.cards.length > 0){
            this.card = data.cards[0];
        }
    }

    removeCardClick(){
        this.card = null;
    }

    finish(){
        // @ts-ignore
        if(this.pos.finished) return;
        if(this.card || this.current){
            Payments.requestPayment('invoice_ari', {
                clientName: this.current,
                card: this.card
            });
        }else{
            this.$emit('message', 'Please type Company name or Swipe Ari Card');
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
.card-info-table{
    width: fit-content;
    margin: auto;
    td{
        font-size: 20px;
        padding: 5px;
    }
    .data-row{
        td:first-child{
            text-align: right;
        }
        td:nth-child(2){
            text-align: left;
        }
    }
    i{
        cursor: pointer;
        opacity: 0.6;
        &:hover{
            opacity: 1;
        }
    }
}
hr{
    margin: 2rem 0 1.5rem 0;
}
div{
    text-align: center;
    button{
        width: 60%;
        padding: 1.2rem !important;
    }
}
button.dropdown{
    margin-bottom: 1rem;
    font-size: 1.2rem;
}
.btn{
    width: 24rem;
}
</style>

<style>
.company-input{
    font-size: 1.3rem !important;
    height: 3.5rem !important;
    margin-bottom: 1rem !important;
}
</style>