<template>
    <Modal v-model="open" :title="title">

        <h3>
            {{prefix}}
            <span>{{ amount }}</span>
        </h3>

        <KeyPad class="keypad" :shadow="false" v-model="amount" />

        <ReasonForm v-if="askForReason" v-model="reason" :title="reasonTitle" />

        <template v-slot:buttons>
            <sui-checkbox v-if="askForTaxes" v-model="taxesIncluded" label="Taxes are included?" class="checkbox"/>
            <sui-button @click="cancel">Cancel</sui-button>
            <sui-button @click="validate" color="green">Validate</sui-button>
        </template>

    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Modal from '../Elts/Modal.vue';
import KeyPad from '../Elts/KeyPad.vue';
import MxHelper from '@/prs/MxHelper';
import Utils from '@/prs/utils';
import ReasonForm from '../Elts/inputs/ReasonForm.vue';

@Component({
    components: {
        Modal,
        KeyPad,
        ReasonForm
    }
})
export default class CustomValueModal extends Vue{

    private open: boolean = false;
    private askForTaxes: boolean = false;
    private askForReason: boolean = false;
    private title: string = '';
    private prefix: string = '';
    private amount: string = '';
    private taxesIncluded: boolean = true;
    private reason: string = '';
    private reasonTitle: string = '';

    validate(){
        let value = parseFloat(this.amount || '0');
        this.open = false;
        if(this.askForTaxes || this.askForReason){
            this.resolve({
                value,
                taxesIncluded: this.taxesIncluded ? true : false,
                reason: this.reason,
            });
        }else{
            this.resolve(value);
        }
    }

    cancel(){
        this.open = false;
        this.reject('CANCELED');
    }


    resolve!: Function;
    reject!: Function

    handle(params: any){
        this.title = params.title || 'Custom Amount';
        this.prefix = params.prefix || 'Amount $';
        this.amount = (params.value || '') + '';
        this.askForTaxes = params.taxes;
        this.askForReason = params.reason;
        if(params.taxes) this.taxesIncluded = params.taxesIncluded;
        if(params.reason){
            this.reason = params.reasonText || '';
            this.reasonTitle = params.reasonTitle || 'Reason';
        }
        this.open = true;
    }

    created(){
        MxHelper.registerComponent('CustomValueModal', this);
    }

}
</script>

<style lang="scss" scoped>
h3{
    text-align: center;
    width: 24rem;
    background-color: #f9f9f9;
    box-sizing: border-box;
    padding: 1rem;
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    margin: auto;
    font-size: 1.6rem;

    span{
        min-width: 4rem;
        display: inline-block;
        text-align: left;
        border-bottom: 1px solid;
    }
}
.checkbox{
    float: left;
    zoom: 1.3;
    margin-top: 7px;
    margin-left: 7px;
}
.keypad{
    margin-bottom: 1rem !important;
}
</style>
