<template>
    <Modal v-model="open" :title="title" :loading="mr._loading" @dialogAnswer="open = false" :dialog="dialog">
        <h3 class="content-area">{{text}}</h3>
        <template v-slot:buttons>
            <template v-if="type == 2">
                <sui-button @click="noClick">NO</sui-button>
                <sui-button @click="yesClick">YES</sui-button>
            </template>
            <template v-else >
                <sui-button @click="yesClick">OK</sui-button>
            </template>

        </template>
    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Message from '@/ccs/Message';
import MessageResponse from '@/ccs/MessageResponse';
import ModalDialog from '@/ccs/ModalDialog';
import Component from 'vue-class-component';
import Modal from '../Elts/Modal.vue';

@Component({
    components: {
        Modal,
    }
})
export default class MessageModal extends Vue{
    private open: boolean = false;
    private title: string = '';
    private text: string = '';
    private type: number = 1;
    private dialog = new ModalDialog();
    
    private mr = new MessageResponse();
    private callback: any;

    noClick(){
        this._answer(false);
    }
    yesClick(){
        this._answer(true);
    }

    _answer(answer: boolean){
        this.mr.reset();
        this.mr.answer = answer;
        this.callback(this.mr);
    }

    show(data: any){
        return new Promise((resolve, reject) => {
            this.callback = resolve;
            this.mr._loading = false;

            this.title = data.title;
            this.text = data.text;
            this.type = data.type;
            this.open = true;
        });
    }
    

    hide(){
        this.open = false;
    }

    created(){
        Message.register(this);
        this.mr.hide = () => {
            this.open = false;
        }
        this.mr.dialog = this.dialog;
    }
}
</script>

<style scoped>
.content-area{
    white-space: pre-wrap;
}
</style>
