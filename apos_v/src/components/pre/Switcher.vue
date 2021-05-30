<template>
    <div is="sui-button-group">
        <sui-button :disabled="disabled" :positive="pvalue == 1" @click="clicked(1)">{{leftText}}</sui-button>
        <sui-button-or />
        <sui-button :disabled="disabled" :positive="pvalue == 2" @click="clicked(2)">{{rightText}}</sui-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
    watch: {
        value: function (val: any){
            // @ts-ignore
            this.pvalue = this.value;
        }
    }
})
export default class Switcher extends Vue{
    private pvalue = 1;

    @Prop({default: false}) disabled!: boolean;
    @Prop({default: 1}) value!: number;

    @Prop({default: ''}) leftText!: string;
    @Prop({default: ''}) rightText!: string;

    clicked(index: number){
        this.pvalue = index;
        this.$emit('input', index);
        this.$emit('changed', index);
    }
}
</script>

