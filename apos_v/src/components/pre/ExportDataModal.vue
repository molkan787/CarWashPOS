<template>
    <Modal v-model="open" :title="title" :dialog="dialog" @dialogAnswer="dialogAnswer">
        
        <h3 v-if="subtitle">{{ subtitle }}</h3>
        <h3>{{ statusText }}</h3>
        <h4>This operation may take a while...</h4>

        <template v-slot:buttons>
            <sui-button @click="cancel">CLOSE</sui-button>
            <sui-button @click="okClick" color="green" :loading="loading">Export</sui-button>
        </template>

    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MxHelper from '@/prs/MxHelper';
import DM from '@/prs/dm';
import Downloader from '@/prs/downloader';
import Modal from '../Elts/Modal.vue';
import FileInput from '../Elts/inputs/FileInput.vue';
import ModalDialog from '@/ccs/ModalDialog';
import utils from '@/utils';

@Component({
    components: {
        Modal,
        FileInput,
    }
})
export default class DataImportModal extends Vue{

    private open: boolean = false;
    private loading: boolean = false;
    private dialog = new ModalDialog();

    private title: string = '';
    private subtitle: string = '';
    private statusText: string = '';

    private payload!: any;


    okClick(){
        this.loading = true;
        this.setStatus(1);
        const filename = this.getReturnFilename();
        DM.genExportDataFile({dataName: this.payload.dataName})
        .then((data: any) => {
            this.setStatus(2);
            data.returnFilename = filename;
            return Downloader.download(data);
        }).then(() => {
            this.setStatus(3);
            this.dialog.show('Exported data file was successfully downloaded and can be found inside folder "APOS-Reports" on your Desktop!', 1, 'success');
        }).catch(err => {
            this.setStatus(4);
            this.dialog.show('We could not complete the current action, Please try again.');
        }).finally(() => {
            this.loading = false;
        });
    }

    setStatus(status: number){
        this.statusText = 'Status: ';
        switch (status) {
            case 1:
                this.statusText += 'Generating file...';
                break;
            case 2:
                this.statusText += 'Downloading file...';
                break;
            case 3:
                this.statusText += 'Finished!';
                break;
            case 4:
                this.statusText += 'Error';
                break;
            default:
                this.statusText += '';
                break;
        }
    }

    cancel(){
        this.open = false;
    }

    handle(payload: any){
        this.payload = payload;
        this.resetForm();

        const parts = payload.dataName.split(':');
        const dn = parts[0];
        this.payload.dn = dn;

        let subtitle = '';
        let title = '';
        switch (dn) {
            case 'prepaids':
                title = 'Export Prepaid Cards balances';
                break;
            case 'loyalties':
                title = 'Export Loyalty Cards points';
                break;
            case 'prepaid':
                title = 'Export Card Activities';
                subtitle = 'Prepaid Card - ' + payload.barcode;
                break;
            case 'loyalty':
                title = 'Export Card Activities';
                subtitle = 'Loyalty Card - ' + payload.barcode;
                break;
            default:
                title = 'Export Data';
                break;
        }

        this.title = title;
        this.statusText = title;
        this.subtitle = subtitle;

        this.open = true;
    }

    resetForm(){
        this.loading = false;
    }

    dialogAnswer(answer: string){
        if(answer == 'OK' && this.dialog.ref == 'success'){
            this.open = false;
        }
    }

    getReturnFilename(){
        const dn = this.payload.dn;
        const date = utils.timestampToDate(new Date().getTime() / 1000);
        let filename = '';
        if(dn == 'prepaids')
            filename = 'Prepaid Cards balances';
        else if(dn == 'loyalties')
            filename = 'Loyalty Cards Points';
        else if(dn == 'prepaid')
            filename = `Prepaid Card (${this.payload.barcode})`;
        else if(dn == 'loyalty')
            filename = `Loyalty Card (${this.payload.barcode})`;
        else
            filename = 'Data';
        
        filename += ' - ' + date + '.xlsx';
        return filename;
    }

    created(){
        // @ts-ignore
        MxHelper.registerFunction('openDataExportWizard', (payload: any) => {
            if(this.loading){
                this.open = true;
            }else{
                this.handle(payload);
            }
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
h4{
    font-style: italic;
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
.p-lbl{
    float: left;
    margin-top: 2%;
    margin-left: 2%;
}
</style>

