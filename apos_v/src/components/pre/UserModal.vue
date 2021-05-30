<template>
    <Modal :loading="loading" :title="title" v-model="open" :dialog="dialog" >

        
        <form class="ui form">
            <div class="field">
                <div class="two fields">
                    <div class="field">
                        <label>First name (Optional)</label>
                        <input v-model="u_first_name" type="text" placeholder="First Name">
                    </div>
                    <div class="field">
                        <label>Last name (Optional)</label>
                        <input v-model="u_last_name" type="text" placeholder="Last Name">
                    </div>
                </div>
            </div>
            <div class="field">
                <label>Username</label>
                <input v-model="u_username" type="text" placeholder="Username" :disabled="lockUsername">
            </div>
            <div class="field">
                <label>Password
                    <label class="pwd-lbl" v-if="u_id != 'new'"> (Leave empty to make no changes)</label>
                </label>
                <input v-model="u_password" type="password" placeholder="Password (PIN)">
            </div>
            <div class="field">
                <label>Rights</label>
                <sui-dropdown
                    selection
                    :options="user_types"
                    v-model="u_type"
                    v-if="u_id != 1"
                />
                <h3 v-else>Full Access</h3>
            </div>

        </form>

        <template v-slot:buttons>
            <sui-button @click="cancelClick">CANCEL</sui-button>
            <sui-button @click="saveClick" color="green">SAVE</sui-button>
        </template>

    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MxHelper from '@/prs/MxHelper';
import comu from '@/prs/comu';
import DS from '@/prs/ds';
import ModalDialog from '@/ccs/ModalDialog';
import Modal from '../Elts/Modal.vue';

@Component({
// @ts-ignore
    components: {
        Modal,
    }
})
export default class UserModal extends Vue{
    private title: string = '';
    private open: boolean = false;
    private loading: boolean = false;
    private dialog = new ModalDialog();

    private lockUsername: boolean = false;
    private user_types = [
        {value: 5, text: 'Access to POS only'},
        {value: 4, text: 'Access to POS & Admin Panel (Orders & Clients Tabs)'},
        {value: 3, text: 'Access to POS & Full Admin Panel (Without Users tab)'},
        {value: 2, text: 'Access to POS & Full Admin Panel (Including Users tab)'}
    ];

    private u_id: any = 0;
    private u_first_name = '';
    private u_last_name = '';
    private u_type = 1;
    private u_username = '';
    private u_password = '';

    save(){
        const data = {
            id: this.u_id,
            username: this.u_username,
            password: this.u_password,
            first_name: this.u_first_name,
            last_name: this.u_last_name,
            user_type: this.u_type,
        };
        DS.editUser(data).then(() => {
            this.dialog.show((this.u_id == 'new') ? 'User was successfully created!' : 'Changes was successfully saved!').then(() => {
                this.open = false;
            });
        }).catch(error => {
            this.dialog.show('We could not complete current action, You may be offline.');
        }).finally(() => {
            this.loading = false;
        });
    }

    saveClick(){
        if(this.validateForm()){
            this.loading = true;
            this.save();
        }
    }

    cancelClick(){
        this.open = false;
    }

    loadUser(userId: any){
        const userData = comu.getUser(userId);
        this.setFormData(userData, true);

        this.title = `Edit User "${userData.username}"`;
        this.open = true;
    }

    validateForm(){
        if(this.u_username.length < 5){
            this.dialog.show('Username must be at least 5 characters long.');
        }else if((this.u_password.length > 0 || this.u_id == 'new') && this.u_password.length < 4){
            this.dialog.show('Password must be at least 4 characters long.');
        }else{
            return true;
        }
        return false;
    }

    newUser(){
        this.title = 'Create new User';
        this.setFormData({});
        this.open = true;
    }

    setFormData(data: any, lockUsername?: boolean){
        this.u_first_name = data.first_name || '';
        this.u_last_name = data.last_name || '';
        this.u_type = data.user_type || 5;
        this.u_username = data.username || '';
        this.u_password = '';

        this.lockUsername = lockUsername || false;
    }

    created(){
        MxHelper.registerFunction('editUser', (userId: any) => {
            this.u_id = userId;
            if(userId == 'new'){
                this.newUser();
            }else{
                this.loadUser(userId);
            }
        });
    }

}
</script>

<style lang="scss" scoped>
label, input, div.dropdown{
    font-size: 1.1rem !important;
}
.pwd-lbl{
    color: #666;
}
</style>
