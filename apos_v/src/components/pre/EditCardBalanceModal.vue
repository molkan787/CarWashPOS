<template>
    <Modal v-model="open" title="Edit card balance" :dialog="dialogData" :loading="loading" @dialogAnswer="dialogAnswer">

        <h2>{{ title }}</h2>
        <hr>
        <LabeledInput label="Balance ($)" v-model="balance" type="number" @input="changed"/>
        <label class="change-label" v-if="change" :class="change > 0 ? 'positive' : 'negative'">
            Change: {{ change | price }}
        </label>
        <template v-slot:buttons>
            <sui-button @click="open = false">CANCEL</sui-button>
            <sui-button @click="saveClick" color="green">SAVE</sui-button>
        </template>

    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { mapActions } from 'vuex';
import MxHelper from '@/prs/MxHelper';
import DM from '@/prs/dm';
import Modal from '../Elts/Modal.vue';
import LabeledInput from '../Elts/inputs/LabeledInput.vue';

@Component({
    components: {
        Modal,
        LabeledInput,
    },
    methods: mapActions(['updateCardBalance']),
})
export default class EditCardBalanceModal extends Vue{

    private open: boolean = false;
    private loading: boolean = false;
    private dialogData: any = {
        text: '',
        ref: '',
        open: false,
    };

    private balance: string = '';

    private type: string = '';
    private card!: any;
    private initialBalance: number = 0;
    private change: number = 0;

    private title: string = 'Edit card balance';

    saveClick(){
        if(this.validateForm()){
            this.loading = true;
            this.save();
        }
    }

    save(){
        const balance = parseFloat(this.balance) * 100;
        DM.editCardBalance({type: this.type, id: this.card.id, balance}).then(() => {
            this.updateLocalData(balance);
            this.open = false;
        }).catch(error => {
            this.dialog('We could not complete the current action.');
        });
    }
    
    changed(){
        const newBalance = parseFloat(this.balance);
        this.change = newBalance - this.initialBalance;
    }

    validateForm(){
        const newBalance = parseFloat(this.balance);
        if(newBalance < 0){
            this.dialog('Card balance cannot be negative, Please type a valid value.');
        }else{
            return true;
        }
        return false;
    }

    updateLocalData(balance: number){
        this.card.balance = balance;
        // @ts-ignore
        this.updateCardBalance({type: this.type, card: this.card});
    }

    handle(payload: any){
        this.resetForm();

        this.title = (payload.type == 'prepaid' ? 'Prepaid Card' : 'Loyalty Card') + ' - ' + payload.card.barcode;
        this.balance = (payload.card.balance / 100).toFixed(2);

        this.initialBalance = payload.card.balance / 100;
        this.card = payload.card;
        this.type = payload.type;

        this.open = true;
    }

    resetForm(){
        this.change = 0;
        this.loading = false;
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
        console.log(this.dialogData)
    }

    created(){
        // @ts-ignore
        MxHelper.registerFunction('editCardBalance', (payload: any) => {
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
.change-label{
    font-size: 1.3rem;
    margin-left: 1rem;
    &.positive{
        color: $green;
    }
    &.negative{
        color: $red;
    }
}
</style>

