<template>
    <div>
        <sui-button v-for="(method, index) in methods" :key="index"
        :class="pos.pay_method == method.name ? 'grey' : ''"
        @click="pos.pay_method = method.name"
        :disabled="method.name == 'prepaid' && pos.cantUsePrepaid">
            <i v-if="method.icon" :class="'icon ' + method.icon"></i> <br>
            {{ method.text }}
        </sui-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {mapState} from 'vuex';

@Component({
    computed: {
        ...mapState(['pos'])
    }
})
export default class PaymentMethods extends Vue{
    private methods: {}[] = [
        {name: 'cash', text: 'Cash', icon: 'money bill alternate'},
        {name: 'prepaid', text: 'Prepaid Card', icon: 'ticket alternate'},
        {name: 'invoice_ari', text: 'Invoice or Ari', icon: 'file alternate'},
        {name: 'card', text: 'Credit/Debit Card', icon: 'credit card'},
        {name: 'loyalty', text: 'Loyalty Card', icon: 'ticket alternate'},
        {name: 'other', text: 'Other or Free', icon: 'certificate'},
    ];
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
button{
    float: left;
    width: 32%;
    height: 6rem;
    margin-bottom: 0.22rem !important;
    font-size: 1.1rem !important;
    line-height: 1.3 !important;
    i{
        margin: 0 !important;
    }
}
</style>