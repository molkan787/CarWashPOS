<template>
    <div>
        <h4>{{ title }}</h4>
        <textarea :disabled="disabled" v-model="pvalue" :placeholder="ph" @input="emitChange"></textarea>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
    watch: {
        value: function (){
            // @ts-ignore
            this.updateValue();
        }
    }
})
export default class ReasonForm extends Vue{
    @Prop({default: ''}) value!: string;
    @Prop({default: 'Reason'}) title!: string;
    @Prop({default: 'Type here...'}) ph!: string;
    @Prop({default: false}) disabled!: boolean;

    private pvalue: string = '';

    updateValue(){
        this.pvalue = this.value;
    }

    emitChange(){
        this.$emit('input', this.pvalue);
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
h4{
    font-size: 1.5rem;
    text-align: left;
}
textarea{
    width: 100%;
    height: 5rem;
    resize: none;
    border-radius: 4px;
    border: 1px solid #dddddd;
    background-color: #fdfdfd;
    padding: 0.5rem;
    font-size: 1.2rem;
    outline: none;
    &:focus{
        border-color: $blue;
    }
}
</style>

