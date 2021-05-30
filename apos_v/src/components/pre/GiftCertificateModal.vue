<template>
    <Modal v-model="open" title="Add Gift Certificate" :loading="loading" :dialog="dialog">
        <GiftCertificateForm :bus="bus" :data="formData" />
        <template v-slot:buttons>
            <sui-button @click="cancel">CANCEL</sui-button>
            <sui-button @click="validateForm" color="green">ADD</sui-button>
        </template>

    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ProductsFactory from '@/prs/productsFactory';
import MxHelper from '@/prs/MxHelper';
import Modal from '../Elts/Modal.vue';
import ModalDialog from '@/ccs/ModalDialog';
import GiftCertificateForm from '../Elts/forms/GiftCertificateForm.vue';

@Component({
    components: {
        Modal,
        GiftCertificateForm,
    }
})
export default class GiftCertificateModal extends Vue{

    private open: boolean = false;
    private loading: boolean = false;
    private dialog = new ModalDialog();
    private bus: Vue = new Vue();

    private formData = {
        certId: '',
        value: 0,
        receiver: {
            first_name: '',
            last_name: '',
        },
        description: '',
    };

    private resolve!: Function;
    private reject!: Function;

    cancel(){
        this.open = false;
        this.reject('CANCELED');
    }

    add(){
        ProductsFactory.addGiftCertificateItem(this.formData);
    }

    validateForm(){
        this.bus.$emit('validateForm', (error: any) => {
            if(error){
                this.dialog.show(error.message);
            }else{
                this.add();
                this.open = false;
            }
        });
    }

    handle(payload: any){
        this.resetForm();

        this.open = true;
    }

    resetForm(){
        this.loading = false;
    }

    dialogAnswer(answer: string){
        
    }

    created(){
        // @ts-ignore
        MxHelper.registerFunction('addGiftCertificate', (payload: any) => {
            return new Promise((resolve, reject) => {
                this.handle(payload);
                this.resolve = resolve;
                this.reject = reject;
            });
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

