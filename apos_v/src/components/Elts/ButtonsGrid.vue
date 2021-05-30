<template>
    <div class="root">
        <button v-for="(btn, index) in buttons" :key="index"
        @click="buttonClick(btn.key)">{{ btn.text }}</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class ButtonsGrid extends Vue{
    @Prop({default: {}}) buttons!: {};

    buttonClick(key: string){
        this.$emit('buttonClick', key);
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
$root-width: 24rem;
div.root{
    width: $root-width;
    margin: auto;
    text-align: left;
    box-shadow: 1px 1px 6px #ccc;

    button{
        box-sizing: border-box;
        width: calc(#{$root-width} / 4 + 1px);
        height: 3rem;
        font-size: 1.3rem;
        background-color: #fafafa;
        border: 1px solid #ddd;
        margin-right: -1px;
        margin-bottom: -1px;
        outline: none;

        &.darker{
            background-color: $grey;
        }

        &:active{
            background-color: $blue;
            color: white;
        }
    }
}
</style>