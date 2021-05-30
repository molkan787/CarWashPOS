<template>
    <Modal v-model="open" title="Options">
        <h3>Zoom</h3>
        <div class="zoom-con">
            <sui-button class="m-btn" icon="minus" @click="minus"></sui-button>
            <div class="zoomValue ui disabled input">
                <input type="text" :value="zoom + '%'">
            </div>
            <sui-button class="p-btn" icon="plus" @click="plus"></sui-button>
        </div>
        <h3>POS</h3>
        <sui-checkbox v-model="categoryAutoBack" @change="categoryAutoBackChange" class="cb" label="Automatically go back to categories list after selecting an item/service?"/>
        <sui-checkbox v-model="barcodeAutoFill" @change="barcodeAutoFillChange" class="cb" label="Automatically fill barcode of Prepaid/Loyalty card of current client in Payment box?"/>
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
import LocalSettings from '@/prs/localSettings';
import EFF from '@/drivers/eff';

@Component({
    components: {
        Modal,
    }
})
export default class OptionsModal extends Vue{
    private open: boolean = false;

    private zoom: number = 100;
    private categoryAutoBack: boolean = false;
    private barcodeAutoFill: boolean = true;

    minus(){
        this.adjustZoom(-10);
    }
    plus(){
        this.adjustZoom(10);
    }

    categoryAutoBackChange(){
        LocalSettings.setItem('categoryAutoBack', this.categoryAutoBack);
    }

    barcodeAutoFillChange(){
        LocalSettings.setItem('barcodeAutoFill', this.barcodeAutoFill);
    }

    adjustZoom(amt: any, doNotSave?: boolean){
        this.zoom += amt;
        if(this.zoom < 50) this.zoom = 50;
        else if(this.zoom > 150) this.zoom = 150;

        const fontSize = Math.round((this.zoom / 100) * 14);
        // @ts-ignore
        document.body.parentElement.style.fontSize = fontSize + 'px';
        
        if(!doNotSave) this.saveZoom();
    }


    close(){
        this.open = false;
    }

    saveZoom(){
        LocalSettings.setItem('zoom', this.zoom);
    }

    created(){
        MxHelper.registerFunction('openOptions', () => {
            this.open = true;
        });

        this.categoryAutoBack = LocalSettings.getItem('categoryAutoBack') || false;
        this.barcodeAutoFill = LocalSettings.getItem('barcodeAutoFill');
        this.zoom = LocalSettings.getItem('zoom') || 100;
        this.adjustZoom(0, true);

        document.addEventListener("keydown", (e: any) => {
            if (this.open && e.which === 123) {
                EFF.openDevTools();
            }
        });
    }

}
</script>

<style scoped lang="scss">
.zoom-con{
    height: 4rem;
}
.zoomValue{
    opacity: 1 !important;
    font-size: 1.2rem !important;
    input{
        text-align: center !important;
        font-weight: bold;
        border-radius: 0;
        width: 200px;
    }
}
.m-btn, .p-btn, .zoomValue{
    margin: 0 !important;
    height: 3rem !important;
    float: left;
}
.m-btn{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.p-btn{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.cb{
    font-size: 0.8rem;
    zoom: 1.5;
    line-height: 1.2;
    margin-bottom: 2rem;
}
</style>