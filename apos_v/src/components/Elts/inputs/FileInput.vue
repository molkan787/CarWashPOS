<template>
    <div>
        <sui-button @click="click" :disabled="disabled" :loading="loading">
            <b v-if="filename">( {{ filename }} )</b>
            {{ text }}
        </sui-button>
        <input class="file-input" type="file" ref="fileinput" @change="onchange"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class FileInput extends Vue{

    private filename: string = '';
    private text: string = 'Select file';

    @Prop({default: () => null}) bus!: Vue;
    @Prop({default: false}) disabled!: boolean;
    @Prop({default: false}) loading!: boolean;

    private fileInputEl!: HTMLElement;

    click(){
        // @ts-ignore
        this.$refs.fileinput.click();
    }

    onchange(){
        // @ts-ignore
        this.setFile(this.fileInputEl.files[0]);
    }

    setFile(file: File){
        this.filename = file.name;
        this.text = ' - Click to change';

        this.$emit('input', file);
    }

    reset(){
        this.filename = '';
        this.text = 'Select file';
        // @ts-ignore
        this.fileInputEl.value = '';
        this.$emit('input', null);
    }

    mounted(){
         // @ts-ignore
        this.fileInputEl = this.$refs.fileinput;

        if(this.bus){
            this.bus.$on('reset', () => this.reset());
        }
    }

}
</script>

<style lang="scss" scoped>
.file-input{
    display: none;
}
b{
    color: #000;
}
</style>
