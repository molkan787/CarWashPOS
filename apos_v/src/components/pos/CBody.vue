<template>
    <div class="m-el ui horizontal segments">

        <LeftColumn />
        <CenterColumn />
        <RightColumn />

    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LeftColumn from './LeftColumn.vue';
import CenterColumn from './CenterColumn.vue';
import RightColumn from './RightColumn.vue';

@Component({
    components: {
        LeftColumn,
        CenterColumn,
        RightColumn,
    }
})
export default class CBody extends Vue{
    buttonClicked(comp: any, btnIdx: number){
        console.log('Clicked: ' + btnIdx)
    }
}
</script>

<style lang="scss" scoped>
div.m-el{
    margin-top: 0 !important;
    width: 100%;
    box-shadow: none !important;
    border: none !important;
}
</style>
