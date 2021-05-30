<template>
    <Modal v-model="open" :title="title" :loading="loading" :dialog="dialog" >
        <sui-form>
            <sui-form-field>
                <label>Product Name</label>
                <input v-model="p_name" placeholder="Product Name" >
            </sui-form-field>
            <sui-form-field>
                <label>Price type</label>
                <sui-dropdown
                    selection
                    placeholder="Price type"
                    :options="options"
                    v-model="p_type"
                />
            </sui-form-field>
            <sui-form-field :disabled="p_type != '1'">
                <label>Price ($)</label>
                <input v-model="p_price" placeholder="0.00" >
            </sui-form-field>
        </sui-form>

        <template v-slot:buttons>
            <sui-button @click="open = false">Cancel</sui-button>
            <sui-button @click="saveClick" color="green">Save</sui-button>
        </template>
    </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import Modal from '../Elts/Modal.vue';
import Component from 'vue-class-component';
import MxHelper from '@/prs/MxHelper';
import DS from '@/prs/ds';
import { mapState } from 'vuex';
import ModalDialog from '@/ccs/ModalDialog';

@Component({
    components: {
        Modal,
    },
    computed: mapState({
        products: (state: any) => state.productsByIds,
    })
})
export default class ProductModal extends Vue{
    private open: boolean = false;
    private title: string = '';
    private loading: boolean = false;
    private dialog = new ModalDialog();

    private c_id: any = '';
    private p_id: any = '';
    private p_type: any = '1';
    private p_name: any = '';
    private p_price: any = '';

    private options: any[] = [
        {value: '1', text: 'Fixed Price'},
        {value: '2', text: 'User Defined'},
    ];

    private saveClick(){
        if(this.validateForm()){
            this.save();
        }
    }

    private save(){
        const data = {
            id: this.p_id,
            category_id: this.c_id,
            name: this.p_name,
            product_type: this.p_type,
            price: this.p_price,
        }
        this.loading = true;
        DS.editProduct(data).then(() => {
            this.dialog.show('Product was successfully saved!').then(() => {
                this.open = false;
            });
        }).catch(error => {
            this.dialog.show('We could not save changes, You may be offline.');
        }).finally(() => {
            this.loading = false;
        });
    }

    // --------------------------------
    private validateForm(){
        return true;
    }
    // --------------------------------

    private loadProduct(product_id: any, category_id: any){
        this.p_id = product_id;
        this.c_id = category_id;
        // @ts-ignore
        const p = this.products[product_id];
        if(p){
            this.p_type = p.product_type + '';
            this.p_name = p.name;
            this.p_price = p.price;

            this.title = `Edit Product: ${p.name}`;
            this.open = true;
        }
    }

    private newProduct(category_id: any){
        this.title = 'Add new product';
        this.c_id = category_id;
        this.p_id = 'new';
        this.p_type = '1';
        this.p_name = '';
        this.p_price = '';
        this.open = true;
    }

    created(){
        MxHelper.registerFunction('editProduct', (product_id: any, category_id: any) => {
            this.c_id = category_id;
            if(product_id == 'new'){
                this.newProduct(category_id);
            }else{
                this.loadProduct(product_id, category_id);
            }
        });
    }
}
</script>

<style lang="scss" scoped>
label, input, div.dropdown{
    font-size: 1.2rem !important;
}
</style>
