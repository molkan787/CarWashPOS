<template>
    <div class="ui attached vertical segment no-padding">

        <sui-segment attached class="padding-2">
            <TripleButton :texts="['NEW PREPAID','RELOAD PREPAID','GIFT CERTIFICATE']"
                :colors="['orange', 'black', 'grey']" @click="buttonClicked" />
        </sui-segment>

        <sui-segment attached class="row1-block">
            <Products />
        </sui-segment>
        <sui-segment attached class="row2-block">
            <Adjustment />
        </sui-segment>
        
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TripleButton from '../Elts/TripleButton.vue';
import Products from './Products/Products.vue';
import Adjustment from './Adjustment/Adjustment.vue';
import MxHelper from '@/prs/MxHelper';
import Message from '@/ccs/Message';
import { mapState } from 'vuex';

@Component({
    components: {
        TripleButton,
        Products,
        Adjustment,
    },
    computed: mapState(['client']),
})
export default class CenterColumn extends Vue{
    buttonClicked(comp: any, btnIdx: number){
        if(btnIdx == 0){
            // @ts-ignore
            MxHelper.openPrepaidCardModal(false);
        }else if(btnIdx == 1){
            // @ts-ignore
            // if(!this.client.phone){
            //     Message.info('Please load client history before')
            //     return;
            // }
            // @ts-ignore
            MxHelper.openPrepaidCardModal(true);
        }else if(btnIdx == 2){
            // @ts-ignore
            MxHelper.addGiftCertificate();
        }
    }
}
</script>