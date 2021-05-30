<template>
    <div>
        <Header />
        <Body />
        <ProductModal />
        <UserModal />
        <EditCardBalanceModal />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Header from './Header.vue';
import Body from './Body.vue';
import ProductModal from '../pre/ProductModal.vue';
import UserModal from '../pre/UserModal.vue';
import EditCardBalanceModal from '../pre/EditCardBalanceModal.vue';

@Component({
    components: {
        Header,
        Body,
        ProductModal,
        UserModal,
        EditCardBalanceModal,
    }
})
export default class Admin extends Vue{

}
</script>
