<template>
    <div>
        <ProductItem v-for="(item, index) in items" :key="index"
        :item="item" @resetTimer="resetTimer"/>

        <div v-if="items.length == 0" class="empty-text">This Category is empty</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState, mapActions} from 'vuex';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import ProductItem from './Item.vue';

@Component({
    components: {
        ProductItem,
    },
    computed: {
        ...mapState(['products'])
    },
})
export default class Category extends Vue{
    @Prop({default: ''}) catID!: string;

    private items: any[] = [];

    resetTimer(){
        this.$emit('resetTimer');
    }

    mounted(){
        // @ts-ignore
        const prts = this.products[this.catID];
        this.items = prts || [];
    }
}
</script>

<style lang="scss" scoped>
div.empty-text{
    padding-top: 3.7rem;
    font-style: italic;
    text-align: center;
    font-size: 1.5rem;
    color: #aaa;
}
</style>
