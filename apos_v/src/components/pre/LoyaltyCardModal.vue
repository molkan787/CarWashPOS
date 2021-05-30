<template>
    <Modal v-model="open" title="Activate New Loyalty Card" :dialog="dialogData" :loading="loading" @dialogAnswer="dialogAnswer">

        <h2>Client information</h2>
        <ClientInfoForm :data="clientData" />
        <hr>
        <BarcodeInput v-model="barcode" />
        <template v-slot:buttons>
            <sui-button @click="open = false">Cancel</sui-button>
            <sui-button @click="activateClick" color="green">Activate</sui-button>
        </template>

    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState, mapActions } from 'vuex';
import MxHelper from '@/prs/MxHelper';
import comu from '@/prs/comu';
import Modal from '../Elts/Modal.vue';
import BarcodeInput from './BarcodeInput.vue';
import ClientInfoForm from './ClientInfoForm.vue';

@Component({
    components: {
        Modal,
        BarcodeInput,
        ClientInfoForm
    },
    computed: mapState(['client']),
    methods: mapActions(['setLoyaltyCardIfEmpty']),
})
export default class LoyaltyCardModal extends Vue{

    private open: boolean = false;
    private loading: boolean = false;
    private dialogData: any = {};

    private title: string = '';

    private barcode: string = '';
    private clientData: any = {};

    activateClick(){
        if(this.validateForm()){
            this.activate();
            this.loading = true;
        }
    }

    activate(){
        // @ts-ignore
        comu.activateLoyaltyCard(this.barcode, this.clientData).then(response => {
            this.loadCard(this.barcode);
            this.dialog('Loyalty Card was successfully activated!', 'success');
        }).catch(error => {
            if(error == 'CARD_EXIST'){
                this.dialog('This Loyalty Card is already activated, Please use other card.');
            }else{
                this.dialog('Sorry, We could not complete the current action.');
            }
        });
    }

    dialogAnswer(answer: string){
        if(answer == 'OK' && this.dialogData.ref == 'success'){
            this.open = false;
        }
    }

    handle(isReload: boolean = false){
        this.resetForm();
        this.open = true;
    }

    validateForm(){
        // @ts-ignore
        if(this.clientData.phone.length != 10 || this.clientData.first_name.length < 2){
            this.dialog('Please enter valid phone number and first name');
        }else if(this.barcode.length < 6){
            this.dialog('Please enter a valid Barcode.');
        }else{
            return true;
        }
        return false;
    }

    resetForm(){
        this.loading = false;
        this.barcode = '';
        this.clientData = {
            // @ts-ignore
            ...this.client
        }
        this.dialogData = {
            open: false,
            type: 1,
            text: '',
        };
    }

    dialog(text: string, ref?: string){
        this.loading = false;
        this.dialogData.text = text;
        this.dialogData.ref = ref;
        this.dialogData.open = true;
    }

    loadCard(barcode: string){
        // @ts-ignore
        MxHelper.searchLoyaltyCard(barcode, null);

    }

    created(){
        // @ts-ignore
        MxHelper.registerFunction('openLoyaltyCardModal', this);
    }

}
</script>

<style lang="scss" scoped>
h2{
    margin-top: 0;
}
hr{
    margin: 1.4rem 0 1rem 0;
}
</style>

