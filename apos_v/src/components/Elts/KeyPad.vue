<template>
    <div class="root" :class="shadow ? 'shadow' : ''">
        <button v-for="(btn, index) in buttons" :key="index"
        :class="isNaN(btn) ? 'darker' : ''" @click="btnClick(btn)">{{ btn }}</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import PrsUtils from '@/prs/utils';

@Component
export default class KeyPad extends Vue{

    @Prop({default: ''}) value!: string;
    @Prop({default: true}) shadow!: boolean;

    private buttons: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '<'];

    btnClick(key: string){
        this.$emit('keyPressed', key);
        this.updateValue(key);
    }

    updateValue(key: string){
        const new_value = PrsUtils.mutateNumber(this.value, key, 8, 2);
        this.$emit('input', new_value);
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

    &.shadow{
        box-shadow: 2px 2px 10px #ccc;
    }

    button{
        box-sizing: border-box;
        width: calc(#{$root-width} / 3 + 1px);
        height: 3.5rem;
        font-size: 1.7rem;
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


