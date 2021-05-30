<template>
    <Modal v-model="open" title="Inactivity for 5 minutes">
        <h3>
            <i class="lock icon"></i>
            Since you was inactive for 5 minutes,
            You will be automatically logged out in {{seconds}} second(s)
        </h3>
        <template v-slot:buttons>
            <sui-button @click="cancel">CANCEL</sui-button>
        </template>
    </Modal>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue';
import Component from 'vue-class-component';
import Modal from '../Elts/Modal.vue';

@Component({
    components: {
        Modal,
    }
})
export default class InActiveModal extends Vue{
    private open: boolean = false;

    private timer: number = 0;
    private seconds: number = 10;

    startLockProcedure(){
        this.seconds = 10;
        this.open = true;
        this.startTimer();
    }

    lock(){
        console.log('POS was locked!');
        this.$router.push('/');
        setTimeout(() => {
            this.open = false;
        }, 500);
    }

    cancel(){
         // @ts-ignore
        Inac.reset();
        this.open = false;
        this.stopTimer();
    }

    // ------------------------------------------

    tick(){
        this.seconds--;
        if(this.seconds <= 0){
            this.stopTimer();
            this.lock();
        }
    }

    startTimer(){
        this.stopTimer();
        this.timer = setInterval(() => this.tick(), 1000);
    }
    stopTimer(){
        if(this.timer) clearInterval(this.timer);
    }

    created(){
        // @ts-ignore
        Inac.addHandler(() => {
            this.startLockProcedure();
        });
    }
    
}
</script>

