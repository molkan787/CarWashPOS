<template>
    <Modal v-model="open" :title="title" :dialog="dialogData" :loading="loading" @dialogAnswer="dialogAnswer">
        <ReasonForm v-model="reason" />
        <template v-slot:buttons>
            <sui-button @click="cancel">CANCEL</sui-button>
            <sui-button @click="okClick" color="green">OK</sui-button>
        </template>

    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MxHelper from '@/prs/MxHelper';
import Modal from '../Elts/Modal.vue';
import ReasonForm from '../Elts/inputs/ReasonForm.vue';

@Component({
    components: {
        Modal,
        ReasonForm,
    }
})
export default class ReasonModal extends Vue{

    private open: boolean = false;
    private loading: boolean = false;
    private dialogData: any = {
        text: '',
        ref: '',
        open: false,
    };

    private forceInput: boolean = true;
    private reason: string = '';

    private title: string = 'Reason for full discount';

    private resolve!: Function;
    private reject!: Function;

    okClick(){
        if(this.validateForm()){
            this.open = false;
            this.resolve(this.reason);
        }
    }

    cancel(){
        this.open = false;
        this.reject('CANCELED');
    }

    validateForm(){
        if(this.forceInput && !this.reason){
            this.dialog('Please fill the field.');
            return false;
        }else{
            return true;
        }
    }

    handle(payload: any){
        this.resetForm();

        this.title = payload.title || 'Reason';
        this.reason = payload.reason || '';

        if(typeof payload.force == 'boolean') this.forceInput = payload.force;
        else this.forceInput = true;

        this.open = true;
    }

    resetForm(){
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
    }

    created(){
        // @ts-ignore
        MxHelper.registerFunction('getReason', (payload: any) => {
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

