<template>
    <div class="root ui labeled input">
        <label class="ui label">{{label}}</label>
        <sui-dropdown
            selection
            :placeholder="ph || label"
            :options="options"
            :value="value"
            @input="input"
            :disabled="disabled"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class LabeledDropdown extends Vue{

    @Prop({default: null}) resetBus!: Vue;

    @Prop({default: ''}) label!: string;
    @Prop({default: ''}) ph!: string;
    
    @Prop({default: false}) disabled!: boolean;

    @Prop({default: null}) value!: any;

    @Prop({default: () => []}) options!: any[];

    input(value: any){
        this.$emit('input', value);
    }

    created(){
        if(this.resetBus){
            this.resetBus.$on('reset', () => {
                this.input(null);
            });
        }
    }

}
</script>

<style lang="scss" scoped>
div.root{
    display: inline-block;
    height: 2.7rem;
    margin: 0 0.2rem;
    label{
        float: left;
        height: 100%;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    div.dropdown{
        height: 100% !important;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}
</style>
