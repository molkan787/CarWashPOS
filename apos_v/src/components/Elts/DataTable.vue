<template>
    <div>
        
        <div class="ui horizontal segments">
            <div class="ui segment" v-if="controlls.length">
                <button class="ui button" v-for="(controll, index) in controlls" :key="index"
                    @click="controll.handler" >
                    <i v-if="controll.icon" class="icon" :class="controll.icon"></i>
                    {{ controll.text }}
                </button>
            </div>
            <Filters v-if="filtersSchema.length" :items="filtersSchema" :values="filtersValues" @changed="filtersChanged" />
        </div>

        <div class="dataTable dimmable">
            <div class="ui active inverted dimmer" v-if="loading">
                <div class="ui loader"></div>
            </div>
            <sui-table celled striped size="large">
                <sui-table-header>
                    <sui-table-row>

                        <sui-table-header-cell v-for="(col, index) in cols" :key="index">
                            {{ col.name }}
                        </sui-table-header-cell>

                    </sui-table-row>
                </sui-table-header>

                <sui-table-body>

                    <sui-table-row v-for="(item, index) in items" :key="index" :class="needToBeHidden(item, condition) ? 'hidden' : ''">

                        <sui-table-cell v-for="(col, index) in cols" :key="index" :class="col.buttons ? 'collapsing' : ''">

                            <template v-if="checkConditional(col, item)">
                                <span :class="col.conditional.styleClass || ''">
                                    {{ col.conditional.text }}
                                </span>
                            </template>
                            <template v-else-if="col.buttons">

                                <template v-for="(btn, index) in col.buttons">

                                    <sui-popup v-if="btn.tooltip" :key="index" :content="btn.tooltip" position="top center" >
                                        <sui-button class="row-buttons" :key="index" slot="trigger"
                                            @click="buttonClick(btn.name, (col.prop == '@') ? item : item[col.prop])"
                                            :class="needToBeHidden(item, btn.hideIf) ? 'hidden' : ''">
                                            <i v-if="btn.icon" :class="btn.icon + ' icon' + (btn.text ? '' : ' no-margin')"></i>
                                            {{ btn.text }}
                                        </sui-button>
                                    </sui-popup>

                                    <sui-button v-else class="row-buttons" :key="index"
                                        @click="buttonClick(btn.name, (col.prop == '@') ? item : item[col.prop])"
                                        :class="needToBeHidden(item, btn.hideIf) ? 'hidden' : ''">
                                        <i v-if="btn.icon" :class="btn.icon + ' icon' + (btn.text ? '' : ' no-margin')"></i>
                                        {{ btn.text }}
                                    </sui-button>

                                </template>

                            </template>

                            <template v-else-if="item[col.prop] || item[col.prop] == 0">
                                {{ applyFilter(col.filter, item[col.prop]) || col.default || '---' }}
                            </template>
                            <template v-else>{{ col.default }}</template>
                        </sui-table-cell>

                    </sui-table-row>

                </sui-table-body>

                <sui-table-footer>
                    <sui-table-row>
                        <sui-table-header-cell :colspan="cols.length">
                        <sui-menu v-sui-floated:right pagination>
                            <sui-menu-item @click="prevClick" :disabled="page == 1">
                                <sui-icon name="left chevron" />
                            </sui-menu-item>
                            <sui-menu-item>{{ page }}</sui-menu-item>
                            <sui-menu-item @click="nextClick" :disabled="items.length < itemsPerPage">
                                <sui-icon name="right chevron" />
                            </sui-menu-item>
                        </sui-menu>
                        </sui-table-header-cell>
                    </sui-table-row>
                </sui-table-footer>
            </sui-table>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Filters from '../Elts/Filters.vue';
import OrdersLoader from '@/prs/ordersLoader';
import { Prop } from 'vue-property-decorator';

@Component({
    components: {
        Filters
    },
})
export default class DataTable extends Vue{

    private itemsPerPage = 10;
    private page = 1;

    @Prop({default: false}) loading!: boolean;

    @Prop({default: () => []}) cols!: any[];
    @Prop({default: () => []}) items!: any[];

    @Prop({default: () => []}) filtersSchema!: any[];
    @Prop({default: () => {}}) filtersValues!: any;

    @Prop({default: () => []}) controlls!: any[];

    @Prop({default: () => null}) condition!: any;


    applyFilter(filterName: string, value: any){
        if(filterName)
            return Vue.filter(filterName)(value);
        else
            return value;
    }

    filtersChanged(filters: any){
        // this.$emit('filtersChanged', filters);
        this.page = 1;
        this.updateOffset();
        this.emitFiltersChanged();
    }

    prevClick(){
        this.changePage(-1);
    }

    nextClick(){
        this.changePage(1);
    }

    buttonClick(eventName: string, payload: any){
        this.$emit(eventName, payload);
    }

    changePage(dir: number){
        if((dir < 0 && this.page == 1) || (dir > 0 && this.items.length < this.itemsPerPage)) return;
        this.page += dir;
        this.updateOffset();
        this.emitFiltersChanged();
    }

    updateOffset(){
        if(typeof this.filtersValues == 'object')
            this.filtersValues.offset = (this.page - 1) * this.itemsPerPage;
    }

    emitFiltersChanged(){
        this.$emit('filtersChanged', this.filtersValues);
    }

    // -----------------------------

    needToBeHidden(item:any, cn: any){
        if(cn){
            if(typeof cn == 'function'){
                return cn(item);
            }else{
                return item[cn.prop] == cn.value;
            }
        }else{
            return false;
        }
    }

    checkConditional(col: any, item: any){
        if(col.conditional){
            return this.checkCondition(item[col.conditional.prop], col.conditional.value, col.conditional.compareMethod || '=');
        }else{
            return false;
        }
    }

    checkCondition(val1: any, val2: any, compareMethod: string){
        switch (compareMethod) {
            case '=':
                return val1 == val2;
            case '>':
                return val1 > val2;
            case '<':
                return val1 < val2;
            case '>=':
                return val1 >= val2;
            case '<=':
                return val1 <= val2;
            default:
                return false;
        }
    }

    // -----------------------------

    created(){
        this.updateOffset();
    }

}
</script>

<style lang="scss" scoped>
hr{
    margin: 1rem 0 0.5rem 0;
}
.special-cell{
    color: #888;
    font-style: italic;
}
.user-cell > i{
    opacity: 0.5;
}
.no-margin{
    margin: 0 !important;
}
.row-buttons{
    margin-top: -2rem !important;
    margin-bottom: -2rem !important;
    background-color: #f1f1f1;
    // &:first-child{
    //     margin-left: -0.6rem !important;
    // }
}
.hidden{
    visibility: hidden;
    display: none;
}
</style>
