<template>
    <DataTable :cols="cols" :items="clients" :loading="loading"
    :filtersSchema="filtersSchema" :filtersValues="filtersValues"
    @filtersChanged="loadData" @edit="editClick" @delete="deleteClick" :controlls="controlls" />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import DataTable from '../Elts/DataTable.vue';
import { mapState } from 'vuex';
import Dl from '@/prs/dl';
import DM from '@/prs/dm';
import Pfs from '@/prs/pfs';
import MxHelper from '@/prs/MxHelper';
import Message from '@/ccs/Message';

@Component({
    components: {
        DataTable
    },
    computed: mapState({
        clients: (state: any) => state.data.clients,
        loaded: (state: any) => state.dataState.clients,
        filtersValues: (state: any) => state.filtersState.clients,
    }),
})
export default class ClientsTab extends Vue{
    private loading: boolean = false;

    private cols = [
        {name: 'Id', prop: 'id'},
        {name: 'Added date', prop: 'date_added', filter: 'ts2datetime'},
        {name: 'Phone', prop: 'phone', filter: 'phone'},
        {name: 'Email', prop: 'email'},
        {name: 'First Name', prop: 'first_name'},
        {name: 'Last Name', prop: 'last_name'},
        {name: 'Prepaid Card', prop: 'prepaid', filter: 'pol_barcode', default: '---'},
        {name: 'Loyalty Card', prop: 'loyalty', filter: 'pol_barcode', default: '---'},
        {name: '', prop: '@', buttons: [
            {name: 'edit', text: '', icon: 'edit', tooltip: 'Edit info'},
            {name: 'delete', text: '', icon: 'delete', tooltip: 'Delete'},
        ]},
    ];

    private controlls = [
        {icon: 'plus', text: 'NEW', handler: () => this.addClient() }
    ];

    private filtersSchema = Pfs.clients;

    editClick(client: any){
        // @ts-ignore
        MxHelper.editClient(client);
    }

    async deleteClick(client: any){
        const id = client.id;
        Message.ask(`Do you realy want to delete client "${client.first_name} ${client.last_name}" ?`)
        .then((e: any) => {
            if(e.answer){
                e.loading();
                DM.deleteClient({id}).then((result: boolean) =>  e.hide())
                .catch(err => {
                    e.dialog.show('We could not complete the current action.');
                });
            }else{
                e.hide();
            }
        });
    }

    loadData(){
        this.loading = true;
        // @ts-ignore
        Dl.getClients(this.filtersValues).catch(error => {
            console.log('Error: ', error);
        }).finally(() => {
            this.loading = false;
        });
    }

    addClient(){
        // @ts-ignore
        MxHelper.editClient({id: 'new', forceNew: true});
    }

    private listeningForScan = false;
    handleBarcodeScan(barcode: string){
        if(!this.listeningForScan) return;
        // @ts-ignore
        const filters = this.filtersValues;
        Vue.set(filters, 'pol_card', barcode);
        Vue.set(filters, 'date_from', '');
        Vue.set(filters, 'date_to', '');
        Vue.set(filters, 'phone', '');
        this.loadData();
    }

    mounted(){
        MxHelper.registerFunction('redirectScannedBarcode', (barcode: string) => this.handleBarcodeScan(barcode));
        this.listeningForScan = true;
    }
    
    beforeDestroy(){
        this.listeningForScan = false;
    }

    created(){
        // @ts-ignore
        if(!this.loaded) this.loadData();
    }
}
</script>

