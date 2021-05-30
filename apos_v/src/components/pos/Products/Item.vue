<template>
    <sui-button class="root" @click="rootClick" :class="count > 0 ? 'blue' : ''" >
        <span>{{ item.name }}</span>
        <div v-if="count > 0">
            <template v-if="item.product_type == 1">
                <button @click="minusClick" class="ctrl" cancel-click="1">
                    <i class="minus icon" cancel-click="1"></i>
                </button>
                <button class="ctrl" disabled>{{ count }}</button>
                <button @click="plusClick" class="ctrl">
                    <i class="plus icon"></i>
                </button>
            </template>
            <template v-else-if="item.product_type == 2">
                <button class="ctrl price" disabled>
                    <i v-if="item.addTaxes" class="balance scale icon"></i>
                    {{ item.price | price }}
                </button>
                <button @click="getPrice" class="ctrl edit">
                    <i class="edit icon"></i>
                </button>
            </template>
        </div>

    </sui-button>
</template>

<script lang="ts">
import Vue from 'vue';
// import Component from 'vue-class-component';
import {mapActions, mapState} from 'vuex';
import { Prop, Component } from 'vue-property-decorator';
import MxHelper from '@/prs/MxHelper';

@Component({
    computed: mapState(['pos']),
    methods: mapActions(['incItemCount', 'decItemCount', 'setCustomPriceItem'])
})
export default class Item extends Vue{

    @Prop({default: {}}) item!: any;

    private count: any = 0;

    rootClick(e: any){
        if(this.count > 0) return;
        if(e && e.srcElement && e.srcElement.getAttribute('cancel-click')) return;
        if(this.item.product_type == 1){
            // @ts-ignore
            this.incItemCount(this.item.id);
            this.updateCount();
        }else{
            this.getPrice();
        }
    }

    // For type 2
    getPrice(){
        MxHelper.getCustomValue({
            title: 'Set Price for "' + this.item.name + '"',
            value: this.item.price,
            taxes: true,
            taxesIncluded: this.item.addTaxes ? false : true,
        }).then((response: any) => {
            const value = response.value;
            // @ts-ignore
            this.setCustomPriceItem({
                taxesIncluded: response.taxesIncluded,
                itemId: this.item.id,
                price: value,
            });
            this.updateCount();
        }).catch(() => {});
    }
    // =============

    // For type 1
    minusClick(){
        // @ts-ignore
        this.decItemCount(this.item.id);
        this.updateCount();
    }

    plusClick(){
        // @ts-ignore
        this.incItemCount(this.item.id);
        this.updateCount();
    }

    updateCount(resetTimer?: boolean){
        // @ts-ignore
        this.count = this.pos.itemsCount[this.item.id];
        if(resetTimer || typeof resetTimer == 'undefined'){
            this.resetTimer();
        }
    }
    // =============

    resetTimer(){
        this.$emit('resetTimer');
    }

    mounted(){
        this.updateCount(false);
    }

}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
button.root{
    width: 48%;
    height: 6rem;
    padding-left: 0;
    padding-right: 0;
    position: relative;
    margin: 1%;
    font-size: 1.2rem;
    float: left;
}
button.blue > span{
    position: relative;
    top: 0.2rem;
}
div{
    margin-top: 0.9rem;
    text-align: center;
}
div > button.ctrl{
    width: calc(100% / 3);
    height: 3rem;
    color: white;
    font-weight: bold;
    border: none;
    background-color: lighten($blue, 10);
    outline: none;
    &:active{
        background-color: darken($blue, 20);
    }
    &:nth-child(1){
        float: left;
        border-bottom-left-radius: 0.3rem;
    }
    &:nth-child(3){
        float: right;
        border-bottom-right-radius: 0.3rem;
    }
    &.price{
        width: calc(100% / 3 * 2);
    }
    &.edit{
        border-bottom-right-radius: 0.3rem;
    }
}
</style>
