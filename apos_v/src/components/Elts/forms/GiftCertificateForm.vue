<template>
    <div class="ui form">
        <div class="field">
            <label>Certificate</label>
            <LabeledInput v-model="data.certId" class="tior" label="Cert #" labelWidth="42%" inputWidth="58%" maxlength="5"/>
            <LabeledInput v-model="data.value" class="tior"  label="Value ($)" labelWidth="42%" inputWidth="58%" type="number" min="0" />
        </div>
        <div class="field">
            <label>Person receiving the certificate</label>
            <LabeledInput v-model="data.receiver.first_name" class="tior" label="First name" labelWidth="42%" inputWidth="58%"/>
            <LabeledInput v-model="data.receiver.last_name" class="tior"  label="Last name" labelWidth="42%" inputWidth="58%"/>
        </div>
        <div class="field">
            <label>Description</label>
            <textarea v-model="data.description" style="height: 112px;resize: none"></textarea>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import LabeledInput from '../inputs/LabeledInput.vue';

@Component({
    components: {
        LabeledInput,
    }
})
export default class GiftCertificateForm extends Vue{

    @Prop({default: () => ({
        certId: '',
        value: 0,
        receiver: {
            first_name: '',
            last_name: '',
        },
        description: '',
    })}) data!: any;

    @Prop({default: null}) bus!: Vue;

    validateForm(){
        const d = this.data;
        let error = '';
        if(d.certId.length != 5){
            error = 'Certificate number must have 5 digits.';
        }else if(d.value <= 0){
            error = 'The value cannot be equal to 0.';
        }else if(!d.receiver.first_name || !d.receiver.last_name){
            error = 'Please enter first & last name of the receiving person.';
        }else if(d.description.length < 3 || d.description.length > 200){
            error = 'The description must be longer than 3 and shorter than 200 characters'
        }

        if(error){
            return {message: error};
        }else{
            return false;
        }
    }

    mounted(){
        if(this.bus){
            this.bus.$on('validateForm', (callback: Function) => callback(this.validateForm()));
        }
    }

}
</script>

<style lang="scss" scoped>
.tior{
    width: 48% !important;
}
</style>
