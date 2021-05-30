<template>
    <div class="root">
        <sui-grid :columns="2" relaxed="very">
            <sui-grid-column>
                <Categories @change="categoryChanged" />
            </sui-grid-column>
            <sui-divider vertical>and</sui-divider>
            <sui-grid-column>
                <Products :bus="productsBus" />
            </sui-grid-column>
        </sui-grid>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Categories from './Categories.vue'
import Products from './Products.vue'

@Component({
    components: {
        Categories,
        Products,
    }
})
export default class ProductsTab extends Vue {
    private productsBus: Vue = new Vue();

    categoryChanged(catID: any){
        if(catID == '+'){
            this.productsBus.$emit('setCat', '');
        }else{
            this.productsBus.$emit('setCat', catID);
        }
    }

}
</script>
