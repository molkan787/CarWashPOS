<template>
    <div>
        <h2>Categories</h2>
        <hr>
        <Switcher class="type-switcher" v-model="catType" leftText="Regular" rightText="Prepaid"
            @changed="reset"/>
        
        <sui-button class="item" v-for="(category, index) in categories" :key="index"
        @click="itemClick(category.id)" :class="category.id == cat ? 'blue': ''"
            v-if="catType == category.ctype">
            {{ category.name }}
            <sui-icon name="right chevron" v-if="category.id == cat"></sui-icon>
        </sui-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {mapState} from 'vuex';
import Switcher from '../pre/Switcher.vue';

@Component({
    components: {
        Switcher,
    },
    computed: {
        ...mapState(['categories'])
    }
})
export default class Categories extends Vue{

    private catType = '1';
    private cat = -1;

    itemClick(id: any){
        this.cat = id;
        this.$emit('change', id);
    }

    reset(){
        this.itemClick(-1);
    }

}
</script>

<style lang="scss" scoped>
.item{
    width: 100%;
    margin-bottom: 0.3rem;
    font-size: 1.3rem;
}
.type-switcher{
    width: 100%;
    margin-bottom: 0.4rem;
}
</style>


