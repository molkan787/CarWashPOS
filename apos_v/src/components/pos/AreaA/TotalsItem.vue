<template>
    <div class="item" :class="{special, lowImportance, halfSize}">

        {{text}}
        <span :class="{
            positive: amount > 0 && colors,
            negative: amount < 0 && colors
        }">
            {{ amount | price }}
        </span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component
export default class TotalsItem extends Vue{

    @Prop({default: ''}) text!: string;
    @Prop({default: ''}) amount!: string;
    @Prop({default: false}) special!: boolean;
    @Prop({default: false}) lowImportance!: boolean;
    @Prop({default: false}) halfSize!: boolean;
    @Prop({default: false}) colors!: boolean;

}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';

div.item{
    padding: 0.4rem 0.8rem 0.6rem 0.5rem;
    font-size: 1.3rem;
    border-bottom: 1px solid #bbb;

    &.special{
        font-weight: bold;
        background-color: #dfdfdf;
    }
    &.lowImportance{
        color: rgb(107, 107, 107);
    }
    &.halfSize{
        width: 50%;
        float: left;
    }

    span{
        float: right;
        &.positive{
            color: $green;
        }
        &.negative{
            color: $red;
        }
    }
    &:nth-child(6), &:nth-child(7){
        border-bottom: none;
    }
}
</style>
