<template>
    <div>
        <hr>
        <ReasonForm class="reason-form" v-model="reason" title="Reason of free order" :disabled="pos.finished"/>
        <div>
            <sui-button :icon="pos.finished ? 'circle check' : ''" size="large"
            :class="pos.finished ? 'green' : ''" @click="finish">
                <span v-if="pos.finished">Finished</span>
                <span v-else>Finish</span>
            </sui-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { mapState } from 'vuex';
import Payments from '@/prs/payments';
import ReasonForm from '../../Elts/inputs/ReasonForm.vue';

@Component({
    components: {
        ReasonForm,
    },
    computed: mapState(['pos']),
})
export default class OtherPayment extends Vue{

    @Prop({default: ''}) bus!: Vue;

    private reason: string = '';

    finish(){
        if(this.reason){
            Payments.requestPayment('other', {reason: this.reason});
        }else{
            this.bus.$emit('message', 'Please type the reason of free order.');
        }
    }

    created(){
        this.bus.$on('start', (pay_method: string) => {
            if(pay_method == 'other'){
                this.reason = '';
            }
        });
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
hr{
    margin: 2rem 0 1.5rem 0;
}
div{
    text-align: center;
    button{
        width: 60%;
        padding: 1.2rem !important;
    }
}
.reason-form{
    margin-bottom: 1rem;
}
</style>
