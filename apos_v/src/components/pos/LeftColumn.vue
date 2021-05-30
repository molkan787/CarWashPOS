<template>
    <div class="ui attached vertical segment no-padding">

        <sui-segment attached class="padding-2">
            <TripleButton :texts="['REGULAR WASH','PREPAID WASH','NEW LOYALTY CARD']"
                :colors="['blue', 'red', 'green']" :icons="icons" @click="buttonClicked" />
        </sui-segment>

        <sui-segment attached class="row1-block">
            <AreaA />
        </sui-segment>
        <sui-segment attached class="row2-block">
            <Stats />
        </sui-segment>
        
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState, mapActions} from 'vuex';
import Component from 'vue-class-component';
import PredefinedOrder from '@/prs/predefinedOrder';
import MxHelper from '@/prs/MxHelper';
import TripleButton from '../Elts/TripleButton.vue';
import AreaA from './AreaA/AreaA.vue';
import Stats from './Stats/Stats.vue';

@Component({
    components: {
        TripleButton,
        AreaA,
        Stats,
    },
    computed: mapState(['pos']),
    methods: mapActions(['setCatType']),
    watch: {
        "pos.catType": function (val: any){
            // @ts-ignore
            this.updateIcons(val);
        }
    }
})
export default class LeftColumn extends Vue{
    buttonClicked(comp: any, btnIdx: number){
        if(btnIdx == 0){
            PredefinedOrder.regularWash();
            // @ts-ignore
            this.setCatType(1);
        }else if(btnIdx == 1){
            PredefinedOrder.prepaidWash();
            // @ts-ignore
            this.setCatType(2);
        }else if(btnIdx == 2){
            // @ts-ignore
            MxHelper.openLoyaltyCardModal();
        }
    }

    private icons = ['circle check', ''];

    updateIcons(ctype: any){
        if(ctype == 1){
            // this.icons[0] = 'circle check';
            // this.icons[1] = '';
            Vue.set(this.icons, 0, 'circle check');
            Vue.set(this.icons, 1, '');
        }else if(ctype == 2){
            // this.icons[1] = 'circle check';
            // this.icons[0] = '';
            Vue.set(this.icons, 1, 'circle check');
            Vue.set(this.icons, 0, '');
        }
    }
}
</script>