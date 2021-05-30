<template>
    <sui-button class="root" @click="rootClick" @blur="hideControlls" >
        <span v-if="!controlls">{{ item.name }}</span>
        <div v-if="controlls" class="controls">
            <span>{{ item.name }}</span> <br>
            <div @click="editClick">
                <i class="edit icon"></i>
                Edit
            </div>
            <div @click="deleteClick">
                <i class="delete icon"></i>
                Delete
            </div>
        </div>
    </sui-button>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {mapActions, mapState} from 'vuex';
import { Prop } from 'vue-property-decorator';
import MxHelper from '@/prs/MxHelper';

@Component({
    computed: { ...mapState(['pos']) },
})
export default class Item extends Vue{

    @Prop({default: {}}) item!: any;

    private controlls = false;

    private count: any = 0;

    rootClick(e: any){
        this.controlls = true;
    }

    editClick(){
        this.$emit('editClick', this.item.id);
    }

    deleteClick(){
        this.$emit('deleteClick', this.item.id);
    }

    hideControlls(){
        this.controlls = false;
    }

}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
$root-h: 6rem;
button.root{
    width: 44%;
    height: $root-h;
    box-sizing: border-box;
    padding: 5% 0 8% 0;
    position: relative;
    margin: 1%;
    font-size: 1.3rem;
    float: left;
}
.controls{
    position: absolute;
    width: 100%;
    height: 100%;
    padding: $root-h / 6 0.4rem 0 0.4rem;
    top: 0;
    left: 0;
    div{
        display: inline-block;
        width: 50%;
        margin-top: $root-h / 6;
        background-color: rgba(255, 255, 255, 0.4);
        padding: 0.5rem;
    }
}
</style>
