<template>
    <Modal v-model="open" title="Replace Card No." :dialog="dialog" :loading="loading" @dialogAnswer="dialogAnswer">

        <h2>{{ title }}</h2>
        <hr>
        <h2>Replace with:</h2>
        <BarcodeInput v-model="barcode" :listen="open" />
        
        <template v-slot:buttons>
            <sui-button @click="open = false">CANCEL</sui-button>
            <sui-button @click="saveClick" color="green">SAVE</sui-button>
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
import ModalDialog from '@/ccs/ModalDialog';
import BarcodeInput from './BarcodeInput.vue';

@Component({
    components: {
        Modal,
        BarcodeInput,
    },
    methods: mapActions(['updateCardBarcode']),
})
export default class EditCardBarcodeModal extends Vue{

    private open: boolean = false;
    private loading: boolean = false;
    private dialog = new ModalDialog();

    private barcode: string = '';

    private type: string = '';
    private card!: any;

    private title: string = '';

    saveClick(){
        if(this.validateForm()){
            this.confirmSave();
        }
    }

    confirmSave(){
        this.dialog.show('Do you confirm the change of the card number?', 3, 'confirm');
    }

    save(){
        DM.editCardBarcode({type: this.type, id: this.card.id, barcode: this.barcode}).then(() => {
            this.updateLocalData();
            this.dialog.show('The card number was successfully replaced!', 1, 'success');
        }).catch(error => {
            console.log('Error at editCardBarcode:', error)
            if(error == 'CARD_EXIST'){
                this.dialog.show('This card number is already used, Please use a new number.');
            }else{
                this.dialog.show('We could not complete the current action.');
            }
        }).finally(() => this.loading = false);
    }

    updateLocalData(){
        this.card.barcode = this.barcode;
        // @ts-ignore
        this.updateCardBarcode({type: this.type, card: this.card});
    }

    validateForm(){
        if(this.barcode.length < 10){
            this.dialog.show('The barcode should be at least 10 digit long.');
        }else{
            return true;
        }
        return false;
    }

    handle(payload: any){
        this.resetForm();

        this.title = (payload.type == 'prepaid' ? 'Prepaid Card' : 'Loyalty Card') + ' - ' + payload.card.barcode;
        
        this.card = payload.card;
        this.type = payload.type;

        this.open = true;
    }

    resetForm(){
        this.barcode = '';
        this.loading = false;
    }

    dialogAnswer(answer: string){
        if(answer == 'OK'){
            if(this.dialog.ref == 'success'){
                this.open = false;
            }else if(this.dialog.ref == 'confirm'){
                this.loading = true;
                this.save();
            }
        }
    }

    created(){
        // @ts-ignore
        MxHelper.registerFunction('editCardBarcode', (payload: any) => {
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

