<template>
    <sui-input class="phoneInput" :class="flatBorder == 'left' ? 'fl' : ''"
        v-model="val" @input="change" :placeholder="placeholder" :icon="icon" :iconPosition="iconPosition" />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
    watch: {
        value: function (newVal){
            // @ts-ignore
            this.val = newVal;
            // @ts-ignore
            this.change();
        }
    }
})
export default class PhoneInput extends Vue{
    @Prop({default: ''}) value!: string;
    @Prop({default: ''}) placeholder!: string;
    @Prop({default: ''}) icon!: string;
    @Prop({default: 'right'}) iconPosition!: string;
    @Prop({default: ''}) flatBorder!: string;

    private val: string = '';

    change(){
        if(!this.val) this.val = '';
        const raw = this.extractRawNumber(this.val);
        this.$emit('input', raw.substring(0, 10));
        this.val = this.formatPhoneNumber(raw);
    }

    formatPhoneNumber(num: any){
        let result = '';
        for(let i = 0; i < num.length && i < 10; i++){
            if(i == 3 || i == 6)
                result += '-';
            result += num.charAt(i);
        }
        return result;
    }

    extractRawNumber(val: string){
        return val.replace(/[^0-9]/g, '');
    }

}
</script>

<style lang="scss">
.phoneInput.fl > input{
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
}
</style>