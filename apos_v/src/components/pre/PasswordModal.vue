<template>
    <Modal v-model="open" title="Enter Password (PIN)" :loading="loading" :dialog="dialog" >

        <sui-input v-model="password" placeholder="Password" id="fssd40" type="password" autofocus/>

        <template v-slot:buttons>
            <button class="ui button" @click="cancel">CANCEL</button>
            <button class="ui green button" @click="validate">VALIDATE</button>
        </template>
    </Modal>
</template>

<script>
import Modal from '../Elts/Modal.vue';
import MxHelper from '@/prs/MxHelper';
import ModalDialog from '@/ccs/ModalDialog';
import md5 from 'md5';
export default {
    components: {
        Modal,
    },
    data: () => ({
        open: false,
        loading: false,
        dialog: new ModalDialog(),

        password: '',

        resolve: null,
        reject: null,
    }),

    methods: {
        cancel(){
            this.open = false;
            if(this.reject) this.reject('CANCELED');
        },
        validate(){
            const hashed = md5(this.password);
            const index = this.$store.state.user.passwords.indexOf(hashed);
            if(index != -1){
                this.open = false;
                if(this.resolve) this.resolve();
            }else{
                this.dialog.show('The password you typed is Incorrect.');
            }
        },
        handle(){
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;

                this.password = '';
                this.open = true;

            });
        }
    },

    mounted(){
        MxHelper.registerFunction('confirmPassword', () => this.handle());
    }
}
</script>

<style scoped>
.input{
    width: 60%;
}
.input > input{
    font-size: 20px !important;
}
</style>