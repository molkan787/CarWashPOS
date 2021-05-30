<template>
    <div class="ui segment">
        <h2>Taxes</h2>
        <hr>
        <LabeledInput class="input" label="GST RATE" type="number" v-model="gst" :disabled="loading"/> <br>
        <LabeledInput class="input" label="QST RATE" type="number" v-model="qst" :disabled="loading"/> <br>

        <sui-button class="save-btn" icon="save" color="blue" :loading="loading" @click="saveClick">Save</sui-button>
        <span class="success-text" v-if="successText">
            <i class="check circle icon"></i>
            Changes was saved!
        </span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import DM from '@/prs/dm';
import {mapState} from 'vuex';
import Message from '@/ccs/Message';
import LabeledInput from '../Elts/inputs/LabeledInput.vue';

@Component({
    components: {
        LabeledInput,
    },
    computed: mapState(['taxes']),
    watch: {
        taxes: {
            handler: function (){
                // @ts-ignore
                this.loadValues();
            },
            deep: true,
        }
    }
})
export default class SettingTab extends Vue{
    private gst: number = 0;
    private qst: number = 0;

    private loading: boolean = false;
    private successText: boolean = false;

    saveClick(){
        this.loading = true;
        this.save();
    }

    save(){
        DM.editSettings({gst: this.gst, qst: this.qst}).then(() => {
            this.showSuccessText();
        }).catch(err => {
            Message.info('We could not complete the current action');
        }).finally(() => this.loading = false);
    }

    loadValues(){
        // @ts-ignore
        this.gst = this.taxes.gst;
        // @ts-ignore
        this.qst = this.taxes.qst;
    }

    showSuccessText(){
        this.successText = true;
        setTimeout(() => this.successText = false, 4000);
    }

    created(){
        this.loadValues();
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
.segment{
    text-align: left;
}
h2{
    text-align: left;
}
.input{
    margin-top: .5rem !important;
}
.save-btn{
    margin-top: .5rem;
    width: 10rem;
    margin-left: 0.3rem;
}
.success-text{
    color: $green;
    font-style: italic;
    font-size: 1.3rem;
    margin-left: 0.5rem;
}
</style>
