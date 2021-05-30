<template>
    <Modal v-model="open" title="Add loyalty points" :dialog="dialogData" :loading="loading" @dialogAnswer="dialogAnswer">

        <h2>{{ title }}</h2>
        <hr>
        <Switcher :disabled="noChoice" class="type-switcher" v-model="addType" :leftText="leftText" rightText="Custom amount"/>
        <h3></h3>
        <LabeledInput v-if="addType == 2" label="Amount ($)" v-model="amount" type="number" />
        <h3 v-else>Loyalty points to add: {{ loyaltyPoints | price_m }}</h3>

        <template v-slot:buttons>
            <sui-button @click="open = false">CANCEL</sui-button>
            <sui-button @click="saveClick" color="green">ADD POINTS</sui-button>
        </template>

    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState, mapActions } from 'vuex';
import MxHelper from '@/prs/MxHelper';
import DM from '@/prs/dm';
import Modal from '../Elts/Modal.vue';
import LabeledInput from '../Elts/inputs/LabeledInput.vue';
import Switcher from './Switcher.vue';
import utils from '@/prs/utils';

@Component({
    components: {
        Modal,
        LabeledInput,
        Switcher,
    },
    computed: mapState(['loyaltyCard', 'loyaltyPoints']),
    methods: mapActions(['updateCardBalance']),
})
export default class AddLoyaltyPointsModal extends Vue{

    private open: boolean = false;
    private loading: boolean = false;
    private dialogData: any = {
        text: '',
        ref: '',
        open: false,
    };

    private amount: any = 0;

    private title: string = '';
    private addType: number = 1;
    private noChoice: boolean = false;
    private leftText: string = '';

    saveClick(){
        if(this.validateForm()){
            this.loading = true;
            this.save();
        }
    }

    save(){
        // @ts-ignore
        const amount = this.addType == 1 ? this.loyaltyPoints : Math.round(this.amount * 100);
        DM.addLoyaltyPoints({
                // @ts-ignore
                cardId: this.loyaltyCard.id,
                amount,
        }).then(() => {
            this.dialog('Loyalty points was successfully added!', 'success');
        }).catch(error => {
            this.dialog('We could not complete the current action.');
        });
    }

    validateForm(){
        const amount = parseFloat(this.amount);
        if(this.addType == 2 && amount <= 0){
            this.dialog('Amount cannot be negative nor equal to 0, Please enter a valid amount.');
        }else{
            return true;
        }
        return false;
    }

    updateLocalData(balance: number){
        // @ts-ignore
        this.updateCardBalance({type: this.type, card: this.card});
    }

    handle(payload: any){
        //@ts-ignore
        const loyaltyPoints = this.loyaltyPoints / 100;
        //@ts-ignore
        const barcode = this.loyaltyCard.barcode;
        this.resetForm();
        this.title = 'Loyalty-' + barcode;

        if(loyaltyPoints <= 0){
            this.leftText = 'No previous order';
            this.noChoice = true;
            this.addType = 2;
        }else{
            this.leftText = `Last order (${utils.price(loyaltyPoints)})`;
            this.noChoice = false;
            this.addType = 1;
        }

        this.open = true;
    }

    resetForm(){
        this.loading = false;
        this.amount = 0;
    }

    dialog(text: string, ref?: string){
        this.loading = false;
        this.dialogData.text = text;
        this.dialogData.ref = ref;
        this.dialogData.open = true;
    }
    dialogAnswer(answer: string){
        if(answer == 'OK' && this.dialogData.ref == 'success'){
            this.open = false;
        }
    }

    created(){
        // @ts-ignore
        MxHelper.registerFunction('addLoyaltyPoints', (payload: any) => {
            this.handle(payload);
        });
    }

}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
h2{
    margin-top: 0;
}
hr{
    margin: 1.4rem 0 1rem 0;
}
.type-switcher{
    width: 100%;
}
</style>

