<template>
    <div>
        <h3>
            <span class="sub-s">Paid Cash: {{ pos.values.paidCash | price }}</span>
            <span class="second sub-s">
                Change:
                <span :class="{
                    positive: pos.values.changeDue > 0,
                    negative: pos.values.changeDue < 0
                }">{{ pos.values.changeDue | price }} </span>
            </span>
        </h3>
        <hr>
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
import { mapState, mapActions } from 'vuex';
import Payments from '@/prs/payments';

@Component({
    computed: mapState(['pos']),
    methods: mapActions(['markAsPaid']),
})
export default class CashPayment extends Vue{

    @Prop({default: {}}) bus!: any;

    finish(){
        Payments.requestPayment('cash', {});
    }
    start(talkingTo: string){
        // if(talkingTo !== 'cash') return;
    }
    mounted() {
        // @ts-ignore;
        this.bus.$on('start', this.start);
    }
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';

h3{
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.7rem;
    span.sub-s{
        text-align: left;
        display: inline-block;
        width: 50%;
        padding-left: 1rem;
        &.second{
            text-align: right;
            padding-right: 2rem;
        }
        span{
            &.positive{
            color: $green;
            }
            &.negative{
                color: $red;
            }
        }
    }
}
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
</style>
