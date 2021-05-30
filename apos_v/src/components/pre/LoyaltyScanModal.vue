<template>
    <Modal v-model="open" title="Load Loyalty/Prepaid Card" :dialog="dialog">
        <BarcodeInput :disabled="loading" v-model="barcode" briRef="lsm" :listen="open" @scanned="search" />
        <center>
            <sui-button @click="search" :loading="loading" class="searchButton" size="large" icon="search">Search</sui-button>
        </center>
        <template v-slot:buttons>
            <sui-button @click="close">Close</sui-button>
        </template>
    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Modal from '../Elts/Modal.vue';
import Component from 'vue-class-component';
import MxHelper from '@/prs/MxHelper';
import BarcodeInput from './BarcodeInput.vue';
import ModalDialog from '@/ccs/ModalDialog';
import BRI from '@/ccs/BRI';


@Component({
    components: {
        Modal,
        BarcodeInput,
    },
})
export default class LoyaltyScanModal extends Vue{
    private open: boolean = false;
    private loading: boolean = false;
    private dialog = new ModalDialog();

    private barcode: string = '';

    search(){
        if(this.validateForm()){
            this.loading = true;
            // @ts-ignore
            MxHelper.searchLoyaltyCard(this.barcode, (status: any) => this.handleStatusChange(status));
        }
    }

    handleStatusChange(payload: any){
        const {status, text} = payload;
        if(status == 'found'){
            this.close();
        }else if(status == 'NOT_FOUND'){
            this.loading = false;
            this.dialog.show('This card is not activated.');
        }else if(this.isErrorStatus(status)){
            this.loading = false;
            this.dialog.show(text);
        }
    }

    validateForm(){
        if(this.barcode.length < 10){
            this.dialog.show('The barcode should be at least 10 digit long.');
        }else{
            return true;
        }
        return false;
    }

    isErrorStatus(s: string){
        return (s != 'fetching' && s != 'fetching_card' && s!= 'invalid_number');
    }

    close(){
        this.open = false;
        this.loading = false;
    }

    handle(){
        // @ts-ignore
        // this.barcode = this.loyaltyCard.barcode || '';
        this.barcode = '';
        this.loading = false;
        this.open = true;
    }

    focusBRI(){
        BRI.focus('lsm');
    }

    created(){
        // @ts-ignore
        MxHelper.registerFunction('openLoyaltyScanModal', () => this.handle());
        
        // @ts-ignore
        window.lsm = this;
    }

}
</script>

<style scoped lang="scss">
.searchButton{
    width: 24rem;
    padding: 1.2rem !important;
    margin-top: 1rem;
}
</style>