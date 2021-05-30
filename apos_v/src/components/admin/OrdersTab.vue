<template>
    <DataTable :cols="tableSchema" :items="orders" :loading="loading" 
    :filtersSchema="filtersSchema" :filtersValues="filtersValues"
    @filtersChanged="loadData" @refund="refund" @print="print" />
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue';
import Component from 'vue-class-component';
import DataTable from '../Elts/DataTable.vue';
import { mapState } from 'vuex';
import Dl from '@/prs/dl';
import DM from '@/prs/dm';
import Pfs from '@/prs/pfs';
import Message from '@/ccs/Message';
import Receipt from '@/prs/receipt';

@Component({
    components: {
        DataTable
    },
    computed: mapState({
        orders: (state: any) => state.data.orders,
        loaded: (state: any) => state.dataState.orders,
        filtersValues: (state: any) => state.filtersState.orders,
    }),
})
export default class OrdersTab extends Vue{

    private loading: boolean = false;

    private tableSchema = [
        {name: 'Id', prop: 'id'},
        {name: 'ticket #', prop: 'other_data', filter: 'orderTicket'},
        {name: 'Client', prop: 'client', filter: 'joinnames', default: '---'},
        {name: 'Order Date', prop: 'date_added', filter: 'ts2datetime'},
        {name: 'Payment method', prop: 'pay_method', filter: 'paym'},
        {name: 'Order value', prop: 'total', filter: 'price_m'},
        {name: 'Receipt', prop: 'receipt', filter: 'yesIfTrue'},
        {name: 'Cashier', prop: 'cashier', filter: 'joinnames'},
        {name: '', prop: '@', buttons: [
                {name: 'print', text: 'Receipt', icon: 'file alternate'}
            ]
        },
        {name: '', prop: '@', buttons: [
                {name: 'refund', text: 'Refund', icon: 'undo'}
            ],
            conditional: {
                prop: 'status',
                value: 3,
                text: '(Refunded)',
                styleClass: 'special-cell'
            }
        }
    ];

    private filtersSchema = Pfs.orders;

    loadData(){
        this.loading = true;
        // @ts-ignore
        Dl.getOrders(this.filtersValues).catch(error => {
            console.log('Error: ', error);
        }).finally(() => {
            // @ts-ignore
            console.log(this.orders)
            this.loading = false;
        });
    }

    refund(order: any){
        Message.ask(`Do do you realy want to refund order id ${order.id} ?`)
        .then((e: any) => {
            if(e.answer){
                e.loading();
                DM.refundOrder({id: order.id}).then(() => {
                    order.status = 3;
                    e.dialog.show(`Order id ${order.id} was successfully refunded!`)
                    .then(() => e.hide());
                }).catch(error => {
                    e.dialog.show('We could not complete the current action.')
                    .then(() => e.hide());
                });
            }else{
                e.hide();
            }
        })
    }

    print(order: any){
        Receipt.print(order, true);
    }

    created(){
        // @ts-ignore
        if(!this.loaded) this.loadData();
    }
}
</script>
