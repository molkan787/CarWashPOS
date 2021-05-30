<template>
    <Modal v-model="open" :title="title" :loading="loading" :dialog="dialog" @dialogAnswer="dialogAnswer" >

        <ClientInfoForm :data="formData" />

        <template v-slot:buttons>
            <button class="ui button" @click="cancel">CANCEL</button>
            <button class="ui green button" @click="save">SAVE</button>
        </template>
    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Modal from '../Elts/Modal.vue';
import MxHelper from '@/prs/MxHelper';
import ModalDialog from '@/ccs/ModalDialog';
import DM from '@/prs/dm';
import ClientInfoForm from './ClientInfoForm.vue';
import utils from '@/prs/utils';

@Component({
    components: {
        Modal,
        ClientInfoForm,
    }
})
export default class ClientModal extends Vue{
    private open: boolean = false;
    private loading: boolean = false;
    private title: string = '';
    private dialog = new ModalDialog();

    private payload!: any;
    private callback!: Function;

    private clientId!: any;
    private forceNew: boolean = false;
    private formData: any = {
        phone: '',
        email: '',
        first_name: '',
        last_name: ''
    };

    save(){
        if(this.validateForm()){
            this.loading = true;
            const clientData = {
                id: this.clientId,
                ...this.formData,
                forceNew: this.forceNew,
                loyaltyCardId: this.payload.loyaltyCardId,
                prepaidCardId: this.payload.prepaidCardId
            };
            DM.editClient(clientData).then((data: any) => {
                if(this.callback) this.callback(data);
                this.open = false;
            }).catch(error => {
                if(error == 'CLIENT_EXIST'){
                    this.dialog.show(`A diffrent client with number "${utils.formatPhoneNumber(this.formData.phone)}" already exist on the system.`);
                }else{
                    this.dialog.show('We could not complete current action.');
                }
            }).finally(() => {
                this.loading = false;
            });
        }
    }

    cancel(){
        this.open = false;
        if(this.callback) this.callback(false);
    }

    loadClient(payload: any){
        this.payload = payload;
        const id = payload.id;
        this.clientId = id;
        this.forceNew = payload.forceNew || false;
        if(id == 'new'){
            this.title = 'Add new client';
        }else{
            this.title = 'Client id: ' + id;
        }
        this.setFormData(payload);
    }

    setFormData(data: any){
        const fd = this.formData;
        fd.phone = data.phone || '';
        fd.email = data.email || '';
        fd.first_name = data.first_name || '';
        fd.last_name = data.last_name || '';
    }
    
    validateForm(){
        const d = this.formData;
        if(d.phone.length != 10 || d.first_name.length < 2){
            this.dialog.show('Please enter a valid phone number and first name');
        }else{
            return true;
        }
        return false;
    }

    dialogAnswer(){
        if(this.dialog.ref == 'loading_error'){
            this.open = false;
        }
    }

    created(){
        MxHelper.registerFunction('editClient', (payload: any) => new Promise((resolve, reject) => {
            this.callback = resolve;
            this.loadClient(payload);
            this.open = true;
        }));

    }

}
</script>
