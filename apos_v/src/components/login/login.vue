<template>
    <div class="root">
        <sui-segment class="central">
            <div class="header">
                <img src="@/assets/logo.png">
                <h1>
                    <!-- APOS
                    <span v-if="demoMode"> - DEMO</span> -->
                </h1>
            </div>
            
            <div class="ui form">
                <div class="field">
                    <label>Username</label>
                    <input v-model="username" @keypress="inputKeyPress" type="text" placeholder="Username">
                </div>
                <div class="field">
                    <label>Password</label>
                    <input v-model="password" @keypress="inputKeyPress" type="password" placeholder="Password">
                </div>
                <button class="ui button" @click="loginClick">
                    <i class="unlock icon"></i>
                    Login
                </button>
            </div>
            <sui-dimmer :active="loading" inverted>
                <div class="ui loader"></div>
            </sui-dimmer>
        </sui-segment>

        <!-- <div class="fab">
            <i class="setting icon"></i>
        </div> -->
        <sui-dropdown class="labeled icon dpwb fab" button :text="demoMode ? 'DEMO' : 'LIVE'"
            :icon="'circle' + (demoMode ? ' outline' : '')" >
            <sui-dropdown-menu>
                <sui-dropdown-item @click="switchMode(false)" v-if="demoMode" icon="circle">Switch to live mode</sui-dropdown-item>
                <sui-dropdown-item @click="switchMode(true)" v-else icon="circle outline">Switch to demo mode</sui-dropdown-item>
            </sui-dropdown-menu>
        </sui-dropdown>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import comu from '@/prs/comu';
import Component from 'vue-class-component';
import Message from '../../ccs/Message';
import LoginService from '@/prs/login';
import { mapState } from 'vuex';
import config from '@/config';

@Component({
    computed: mapState(['demoMode']),
})
export default class Login extends Vue{
    private loading: boolean = false;
    private username: string = '';
    private password: string = '';

    inputKeyPress(e){
        if(e.keyCode == 13) this.loginClick();
    }

    loginClick(){
        if(this.username.length < 4){
            Message.info('Please type a valid username.').then((e: any) => e.hide());
        }else if(this.password.length < 4){
            Message.info('Please type a valid password.').then((e: any) => e.hide());
        }else{
            this.loading = true;
            this.login();
        }
    }

    login(){
        LoginService.login(this.username, this.password).then(() => {
            // this.username = '';
            this.password = '';
            this.$router.push('pos');
            // @ts-ignore
            Inac.reset();
        }).catch(error => {
            if(error == 'WRONG'){
                Message.info('Wrong combination of Username & Password.').then((e: any) => e.hide());
            }else{
                Message.info('An error occured when trying to log in, Please try again.').then((e: any) => e.hide());
            }
        }).finally(() => {
            this.loading = false;
        });
    }

    switchMode(demo: boolean){
        comu.switchMode(demo);
    }

    mounted(){
        if(config.devMode){
            this.username = 'admin';
            this.password = 'password123';
            this.login();
        }
    }
}
</script>

<style lang="scss" scoped>
$w: 40rem;
$h: 30rem;
.central{
    position: fixed !important;
    top: 50%;
    left: 50%;
    width: $w;
    height: $h;
    margin-top: $h / -2 !important;
    margin-left: $w / -2;
    padding: 0 !important;
    background-color: #f9f9f9;
}
.header{
    width: 100%;
    height: 10rem;
    text-align: center;
    img{
        // height: 100%;
        height: 80%;
        margin: 2rem;
    }
    h1{
        margin: 0;
        font-size: 2rem;
        margin-top: -2.5rem;
        background-color: rgba(73,155,234,1);
        background: -webkit-linear-gradient(45deg, rgba(51,102,150,1) 0%, rgba(114,29,135,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}
.form{
    padding: 2rem;
    font-size: 1.2rem !important;
    label, button{
        font-size: 1.2rem !important;
    }
    button{
        width: 100%;
    }
}
$fab-w: 3rem;
.fab{
    position: fixed !important;
    top: 100% !important;
    left: 0 !important;
    margin-top: $fab-w * -1.5  !important;
    margin-left: $fab-w * 0.5  !important;
    // width: $fab-w  !important;
    height: $fab-w  !important;
    background-color: #eee;
    border-radius: 6px;
    &:hover{
        background-color: rgb(214, 214, 214);
    }
    i{
        width: 100%;
        height: 100%;
        font-size: 1.8rem;
        margin-top: 0.8rem;
        color: #888;
        cursor: pointer;
    }
}
</style>

<style>
.dpwb > .menu.transition > .item{
    font-size: 1.2rem;
}
</style>
