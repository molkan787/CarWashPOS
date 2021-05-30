<template>
    <div class="m-el">
        <img src="@/assets/logo.png">
        <span class="bis">
            <sui-icon name="clock"/> <strong>{{currentTime}}</strong> <br>
            <sui-icon name="user circle"/> <strong class="">{{user.username}}</strong>
            <sui-label class="logout-btn" icon="power off" @click="logout">Logout</sui-label>
        </span>
        <h1>Admin Panel</h1>
        <div class="right-side">
            <sui-button icon="reply" @click="goToPOS">Go back to POS</sui-button>
        </div>
        <div v-if="message.visible" class="ui icon message">
            <i :class="message.icon"></i>
            <div class="content">
                <div class="header">
                    {{ message.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// @ts-nocheck
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import Utils from '@/utils';
import comu from '@/prs/comu';
import Message from '@/ccs/Message';
import ClientLoader from '@/prs/clientLoader';

@Component({
    computed: mapState(['user', 'currentTime']),
})
export default class Header extends Vue {
    private message = {
        visible: false,
        text: '',
        icon: '',
        timeout: 0,
    };

    setMessageContent(status: string, autoHide?: boolean){
        const msg = this.message;
        if(status == 'fetching'){
            msg.text = 'Fetching data...';
            msg.icon = 'notched circle loading icon';
        }else if(status == 'found'){
            msg.text = 'Client history loaded';
            msg.icon = 'circle check outline icon';
        }else if(status == 'NOT_FOUND'){
            msg.text = 'Client not found';
            msg.icon = 'ban icon';
        }else{
            msg.text = 'An error occured';
            msg.text = 'close circle icon';
        }
        if(msg.timeout) clearTimeout(msg.timeout);
        msg.visible = true;
        if(autoHide) this.hideMessage();
    }

    hideMessage(){
        this.message.timeout = setTimeout(() => {
            this.message.visible = false;
        }, 4000);
    }

    goToPOS(){
        this.$router.push('pos');
    }

    // ========================================

    logout(){
        Message.ask('Are you sure you want to logout ?').then((e: any) => {
            e.hide();
            if(e.answer){
                console.log('Logging out...')
                comu.setToken('');
                this.$router.push('/');
                // @ts-ignore
                Inac.stop();
            }
        });
    }

}
</script>

<style lang="scss" scoped>
$root-h: 6rem;

div.m-el{
    height: $root-h;
    border-bottom: 1px solid #bbb;
    img{
        height: 100%;
        float: left;
        // height: 70%;
        // float: left;
        // margin: 1rem;
    }
}
h1{
    display: inline-block;
    float: left;
    margin-left: 19%;
}
.bis{
    float: left;
    line-height: 1.2;
    text-align: left;
    font-size: 1.3rem;
    margin-top: $root-h * 0.25;
}
.right-side{
    width: 15rem;
    height: 100%;
    float: right;
    padding: 1rem;
    margin-right: 0rem;
    text-align: right;
    button{
        height: 100%;
    }
}
.logout-btn{
    margin-left: 1rem;
}
div.message{
    display: inline-block !important;
    width: 250px !important;
    height: 3.9rem !important;
    float: right !important;
    padding: 0.8rem !important;
    text-align: left;
    i{
        float: left;
        zoom: 0.82;
    }
    div.header{
        line-height: 2.3;
    }
}
</style>
