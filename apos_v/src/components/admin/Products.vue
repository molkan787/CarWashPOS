<template>
    <div>
        <h2>
            Products
            <sui-button :disabled="!catID" class="add" icon="plus circle" @click="addNew"></sui-button>
        </h2>
        <hr>
        <ProductItem v-for="(item, index) in items" :key="index"
        :item="item" @editClick="editClick" @deleteClick="deleteClick"/>

        <div v-if="noCat" class="empty-text">No Category Selected.</div>
        <div v-else-if="items.length == 0" class="empty-text">This Category is empty!</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState, mapActions} from 'vuex';
import MxHelper from '@/prs/MxHelper';
import DS from '@/prs/ds';
import Message from '@/ccs/Message';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ProductItem from './ProductItem.vue';

@Component({
    components: {
        ProductItem,
    },
    computed: {
        ...mapState(['products', 'productsByIds'])
    },
})
export default class Products extends Vue{
    
    @Prop({default: null}) bus!: Vue;

    private items: any[] = [];
    private catID: any = '';
    private noCat: boolean = true;

    editClick(id: any){
        // @ts-ignore
        MxHelper.editProduct(id, this.catID);
    }

    deleteClick(id: any){
        // @ts-ignore
        const p = this.productsByIds[id];
        Message.ask(`Do really want to delete product "${p.name}" ?`).then(e => {
            if(e.answer){
                e.loading();
                DS.deleteProduct(id).then(() => {
                    e.hide();
                }).catch(error => {
                    console.log(error)
                    e.dialog.show('We could not complete the action, You may be offline.');
                })
            }else{
                e.hide();
            }
        });
    }

    addNew(){
        // @ts-ignore
        MxHelper.editProduct('new', this.catID);
    }

    update(catID: any){
        this.catID = catID;
        if(catID == -1 || catID == '+'){
            this.items = [];
            this.noCat = true;
        }else{
            // @ts-ignore
            const prts = this.products[catID];
            this.items = prts || [];
            this.noCat = false;
        }
    }

    created(){
        if(this.bus){
            this.bus.$on('setCat', (catID: any) => {
                this.update(catID);
            });
        }
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
button.add{
    float: right;
}
</style>
