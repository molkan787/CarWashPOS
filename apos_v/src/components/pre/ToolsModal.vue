<template>
    <Modal v-model="open" title="Receipt Tools" :loading="loading" :dialog="dialog">
        <h3>Reprint</h3>
        <sui-button :disabled="!nextOrderId" @click="printReceipt" icon="file alternate">Print receipt of the last order</sui-button>
        
        <h3>
            Message <label class="lbl">(Max length 255)</label>
        </h3>
        <div class="ui form">
            <div class="field">
                <textarea cols="30" rows="5" maxlength="255" v-model="receiptMessage"
                    placeholder="add * at begging of the line to make the text bigger."
                ></textarea>
            </div>
        </div>
        
        <template v-slot:buttons>
            <sui-button @click="close">Close</sui-button>
            <sui-button color="green" @click="saveSettings">Save</sui-button>
        </template>
    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Modal from '../Elts/Modal.vue';
import Component from 'vue-class-component';
import DM from '@/prs/dm';
import MxHelper from '@/prs/MxHelper';
import Comu from '@/prs/comu';
import { mapState } from 'vuex';
import ModalDialog from '@/ccs/ModalDialog';


@Component({
    components: {
        Modal,
    },
    computed: mapState(['nextOrderId', 'receipt_msg'])
})
export default class ToolsModal extends Vue{
    private open: boolean = false;
    private loading: boolean = false;
    private dialog = new ModalDialog();

    private receiptMessage: string = '';

    printReceipt(){
        Comu.reprintReceipt();
    }

    saveSettings(){
        this.loading = true;
        DM.editSettings({receipt_msg: this.receiptMessage}).then(() => {
            this.close();
        }).catch(err => {
            this.dialog.show('We could not complete the current action');
        }).finally(() => this.loading = false);
    }

    handle(){
        // @ts-ignore
        this.receiptMessage = this.receipt_msg;
        this.loading = false;
        this.dialog.open = false;
        this.open = true;
    }

    close(){
        this.open = false;
    }

    created(){
        // @ts-ignore
        MxHelper.registerFunction('openToolsModal', () => this.handle());
    }

}
</script>

<style scoped lang="scss">
textarea{
    resize: none !important;
}
.lbl{
    opacity: 0.6;
    font-size: 0.8em;
}
.flr{
    float: right;
}
</style>