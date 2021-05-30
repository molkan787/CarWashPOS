<template>
    <div>
        <sui-segment class="top">
            <sui-button @click="newUserClick">
                <sui-icon name="plus circle"/>
                Add new user
            </sui-button>
        </sui-segment>
        <DataTable :cols="cols" :items="users" :loading="loading" :filtersValues="filtersValues"
                    @filtersChanged="loadData" @edit="editClick" @delete="deleteClick"
                    :condition="condition" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MxHelper from '@/prs/MxHelper';
import DataTable from '../Elts/DataTable.vue';
import { mapState } from 'vuex';
import Dl from '@/prs/dl';
import Ds from '@/prs/ds';
import Pfs from '@/prs/pfs';
import Message from '@/ccs/Message';

@Component({
    components: {
        DataTable
    },
    computed: mapState({
        users: (state: any) => state.data.users,
        loaded: (state: any) => state.dataState.users,
        currentUser: (state: any) => state.user,
    }),
})
export default class UsersTab extends Vue{
    private loading: boolean = false;

    private condition!: Function;

    private cols = [
        {name: 'Id', prop: 'id'},
        {name: 'Added date', prop: 'date_added', filter: 'ts2datetime'},
        {name: 'First Name', prop: 'first_name'},
        {name: 'Last Name', prop: 'last_name'},
        {name: 'Username', prop: 'username'},
        {name: 'Options', prop: 'id', buttons: [
            {name: 'edit', text: 'Edit', icon: 'edit'},
            {name: 'delete', text: 'Delete', icon: 'delete', hideIf: {prop: 'id', value: 1}},
        ]},
    ];

    private filtersValues = {};

    loadData(){
        this.loading = true;
        Dl.getUsers(this.filtersValues).catch(error => {
            console.log('Error: ', error);
        }).finally(() => {
            this.loading = false;
        });
    }

    editClick(userId: any){
        // @ts-ignore
        MxHelper.editUser(userId);
    }

    deleteClick(userId: any){
        // @ts-ignore
        if(userId == this.currentUser.id){
            Message.info('You cannot delete your own account!').then((e: any) => e.hide());
            return;
        }
        Message.ask(`Do you really want to delete user Id:${userId} ?`).then(e => {
            if(e.answer){
                e.loading();
                Ds.deleteUser(userId).then(() => {
                    e.hide();
                }).catch(error => {
                    e.dialog.show('We could not complete current action.');
                });
            }else{
                e.hide();
            }
        });
    }

    newUserClick(){
        // @ts-ignore
        MxHelper.editUser('new');
    }

    created(){
        // @ts-ignore
        if(!this.loaded) this.loadData();
        this.condition = (item: any) => {
            // @ts-ignore
            return item.id == 1 && this.currentUser.id != 1;
        };
    }
}
</script>

<style lang="scss" scoped>
.top{
    text-align: right;
}
</style>
