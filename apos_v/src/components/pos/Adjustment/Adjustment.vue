<template>
    <div>
        <sui-button :class="currentDiscount == '3' ? 'grey' : ''"
        icon="tag" @click="putDiscount('3')"><br>Promo $3 OFF</sui-button>

        <sui-button :class="currentDiscount == '5' ? 'grey' : ''"
        icon="tag" @click="putDiscount('5')"><br>Promo $5 OFF</sui-button>

        <sui-button :class="currentDiscount == 'full' ? 'grey' : ''"
        icon="tag" @click="putDiscount('full')"><br>FULL Discount</sui-button>

        <sui-button icon="tags" :class="currentDiscount == 'custom' ? 'grey' : ''" @click="discountClick" >
            <br>Other Discount<br>
            <span v-if="customDiscount > 0" class="positive-color">({{ customDiscount | price }})</span>
        </sui-button>

        <sui-button icon="plus square" @click="extraChargeClick">
            <br>Extra Charge<br>
            <span v-if="pos.values.extraCharge > 0" class="positive-color">({{ pos.values.extraCharge | price }})</span>
        </sui-button>
        <sui-button icon="money bill alternate" @click="tipsClick">
            <br>Add Tip<br>
            <span v-if="pos.values.tips > 0" class="positive-color">({{ pos.values.tips | price }})</span>
        </sui-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { mapActions, mapState } from 'vuex';
import Comu from '@/prs/comu';
import MxHelper from '@/prs/MxHelper';

@Component({
    computed: mapState(['pos', 'extraChargeReason', 'discountReason']),
    methods: mapActions(['setDiscount', 'setExtraCharge', 'setTips'])
})
export default class Adjustment extends Vue{
    private currentDiscount: any = '';
    private tipAmount: number = 0;
    private customDiscount = 0;

    extraChargeClick(){
        MxHelper.getCustomValue({
            title: 'Extra Charge',
            reason: true,
            reasonTitle: 'For what ?',
            // @ts-ignore
            reasonText: this.extraChargeReason,
            // @ts-ignore
            value: this.pos.values.extraCharge
        }).then(result => {
            // @ts-ignore
            this.setExtraCharge(result);
        }).catch(() => {});
    }

    tipsClick(){
        MxHelper.getCustomValue({
            title: 'Add Tips',
            // @ts-ignore
            value: this.pos.values.tips
        }).then(value => {
            // @ts-ignore
            this.setTips(value);
        }).catch(() => {});
    }

    discountClick(){
        MxHelper.getCustomValue({
            title: 'Custom Discount',
            reason: true,
            // @ts-ignore
            value: this.customDiscount
        }).then((result: any) => {
            // @ts-ignore
            this.customDiscount = result.value;
            this.putDiscount('custom', result.reason);
        }).catch(() => {});
    }

    putDiscount(discount: string, reason?: string){
        const prevDiscount = this.currentDiscount;
        const prevCustom = this.customDiscount;
        if(this.currentDiscount == discount && discount != 'custom')
            this.currentDiscount = '';
        else
            this.currentDiscount = discount;
        if(this.currentDiscount == ''){
            // @ts-ignore
            this.setDiscount(0);
        }else if(this.currentDiscount == 'full'){
            // @ts-ignore
            MxHelper.getReason({title: 'Reason of full discount'}).then((reason: string) => {
                // @ts-ignore
                this.setDiscount({value: this.currentDiscount, reason});
            }).catch((error: any) => {
                this.currentDiscount = prevDiscount;
                this.customDiscount = prevCustom;
            });
        }else if(this.currentDiscount == 'custom'){
            // @ts-ignore
            this.setDiscount({value: this.customDiscount, reason});
        }else{
            // @ts-ignore
            this.setDiscount(parseInt(this.currentDiscount));
        }

        if(discount == 'custom'){
            if(this.customDiscount <= 0)
                this.currentDiscount = '';
        }else{
            this.customDiscount = 0;
        }
            
    }

    reset(){
        this.currentDiscount = '';
        this.customDiscount = 0;
    }

    created(){
        Comu.registerToReset(this);
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
button{
    float: left;
    width: 32%;
    height: 6rem;
    margin-bottom: 0.22rem !important;
    font-size: 1.1rem !important;
    line-height: 1.3 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    i{
        margin: 0 !important;
    }
}
.positive-color{
    color: $green;
}
</style>

