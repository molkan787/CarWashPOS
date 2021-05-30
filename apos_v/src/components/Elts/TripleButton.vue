<template>
    <div>
        <sui-button :class="moreButton ? 'mbs' : ''" @click="buttonClick(0)" :color="colors[0]" :icon="icons[0]">{{ texts[0] }}</sui-button>
        <sui-button :class="moreButton ? 'mbs' : ''" @click="buttonClick(1)" :color="colors[1]" :icon="icons[1]">{{ texts[1] }}</sui-button>
        <sui-button :class="moreButton ? 'mbs' : ''" @click="buttonClick(2)" :color="colors[2]" :icon="icons[2]">{{ texts[2] }}</sui-button>
        <sui-button class="mrb" @click="buttonClick(3)" v-if="moreButton">
          <i class="ellipsis vertical icon"></i>
        </sui-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class TripleButton extends Vue{

    @Prop({default: () => []})
    texts!: string[];

    @Prop({default: () => []})
    colors!: string[];

    @Prop({default: () => []})
    icons!: string[];

    @Prop({default: false}) moreButton!: boolean;

    buttonClick(buttonIndex: number){
        this.$emit('click', this, buttonIndex);
    }

}
</script>

<style lang="scss" scoped>
div{
    margin: 0 !important;
    display: flex;
    flex-direction: row;
    justify-content: center;
}
button {
    box-sizing: border-box;
    width: 33%;
    height: 3.5rem;
    margin: 0 !important;
    &:nth-child(1) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    &:nth-child(2) {
        border-radius: 0;
    }
    &:nth-child(3) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}

button.mbs{
    width: 30%;
    &:nth-child(3) {
        border-radius: 0;
    }
}
.mrb {
    width: 9%;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding: 0;
    box-sizing: border-box;
    i{
      margin: 0 !important;
    }
}
</style>


