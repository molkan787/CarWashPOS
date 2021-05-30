<template>
    <div class="root">
        <h3>
            <label>Amount to load</label>
            <label>Price</label>
        </h3>
        <div class="ui labeled input first">
            <div class="ui label">$</div>
            <input v-model="value.amount" type="text" placeholder="0.00">
        </div>
        <div class="ui labeled input">
            <div class="ui label">$</div>
            <input v-model="value.price" type="text" placeholder="0.00">
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class AmountPriceForm extends Vue{

    @Prop({default: () => ({
        amount: '',
        price: '',
    }) }) value!: any;

}
</script>

<style lang="scss" scoped>
div.root{
    text-align: center;
}
h3 > label{
    display: inline-block;
    width: 50%;
    box-sizing: border-box;
    text-align: left;
    padding-left: 5%;
}
.input{
    font-size: 1.2rem !important;
    &.first{
        margin-right: 1rem !important;
    }
}
input{
    width: 13rem !important;
}
</style>
