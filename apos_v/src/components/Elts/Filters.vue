<template>
    <div class="root ui segment">
        
        <template v-for="(item, index) in items">
            <LabeledDropdown :key="index" v-if="item.type == 'dropdown'"
                :class="item.small ? 'flt-small-inp' : 'flt-normal-inp'"
                :label="item.text"
                :ph="item.ph"
                :options="item.options"
                v-model="values[item.name]"
                :resetBus="resetBus"
            />
            <LabeledInput :key="index" v-else
                :class="item.small ? 'flt-small-inp' : 'flt-normal-inp'"
                :type="item.type"
                :label="item.text"
                :ph="item.ph"
                v-model="values[item.name]"
                :resetBus="resetBus"
            />
        </template>

        <sui-button @click="applyFilters" color="blue" style="float: right" icon="circle check outline">Apply filters</sui-button>
        <sui-button @click="clearFilters" icon="close" style="float: right">Clear filters</sui-button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import LabeledDropdown from './inputs/LabeledDropdown.vue';
import LabeledInput from './inputs/LabeledInput.vue';

@Component({
    components: {
        LabeledDropdown,
        LabeledInput,
    }
})
export default class Filters extends Vue{

    private resetBus: Vue = new Vue();

    @Prop({default: () => []}) items!: any[];

    @Prop({default: () => {}}) values!: any;

    applyFilters(){
        this.emitChanged();
    }

    clearFilters(){
        this.resetBus.$emit('reset');
        this.emitChanged();
    }

    emitChanged(){
        this.$emit('changed', this.values);
    }

}
</script>

<style>
.flt-normal-inp > input, .flt-normal-inp > div.dropdown{
    width: 12rem;
}
.flt-small-inp > input, .flt-small-inp > div.dropdown{
    width: 5rem;
}
</style>
