<template>
    <div class="m-el">
        <sui-segment attached class="items">
            <OrderItem v-for="(item, index) in pos.items" :key="index" :text="item.name"
             :label="prefix[item.category_id] || item.label" :amount="item.price"
             :count="pos.itemsCount[item.id]"/>
            <div v-if="pos.items.length == 0" class="empty-text">No items added</div>
        </sui-segment>
        <Totals class="totals" />  
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState, mapActions} from 'vuex';
import Component from 'vue-class-component';
import OrderItem from './OrderItem.vue';
import Totals from './Totals.vue';
import Things from '@/prs/things.ts';

@Component({
    components:{
        OrderItem,
        Totals,
    },
    computed: {
        ...mapState(['pos'])
    },
    methods: {
        ...mapActions(['loadData'])
    }
})
export default class OrderSummary extends Vue{

    private prefix!: {};

    constructor(){
        super();
        this.prefix = Things.prefix;
    }

}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
$totals-height: 16.95rem;
div.m-el{
    div.segment{
        padding: 0 !important;
        overflow-x: hidden;
        overflow-y: scroll;
        
        &.items{
            height: $block1-height - $totals-height - 6.5rem;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
        }
        &.totals{
            height: $totals-height;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
        }
    }
}
div.empty-text{
    padding-top: 3rem;
    font-style: italic;
    text-align: center;
    font-size: 1.5rem;
    color: #aaa;
}
</style>
