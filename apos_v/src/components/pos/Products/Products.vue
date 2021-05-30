<template>
    <div class="root">
        <div class="header" :class="headerClass">
            <sui-icon v-if="catID != 'all'" name="arrow left" class="backBtn" @click="goBack" />
            {{ headerText }} <span class="label">({{ suffix }})</span>
        </div>
        <Categories v-if="catID == 'all'" @catSelected="categorySelected" />
        <Category v-if="catID != 'all'" :catID="catID" @resetTimer="resetTimer" />
    </div>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue';
import {mapGetters} from 'vuex';
import Comu from '@/prs/comu';
import Component from 'vue-class-component';
import Categories from './Categories.vue';
import Category from './Category.vue';
import Modal from '../../Elts/Modal.vue';

@Component({
    components: {
        Categories,
        Category,
        Modal
    },
    computed: {
        ...mapGetters(['getCategory', 'pos'])
    },
    watch: {
        "pos.catType": function (val: any){
            // @ts-ignore
            this.updateHeader(val);
            // @ts-ignore
            this.goBack();
        }
    }
})
export default class Products extends Vue{

    private headerText: string = 'Categories';
    private suffix: string = 'Regular';
    private catID: string = 'all';

    private headerClass: string = 'regular';

    private goBackTimer = 0;

    categorySelected(cat_id: any){
        this.catID = cat_id;
        // @ts-ignore
        let cat = this.getCategory(cat_id);
        this.headerText = cat.name;
    }

    goBack(){
        this.headerText = 'Categories';
        this.catID = 'all';
    }

    updateHeader(ctype: any){
        this.suffix = ctype == 1 ? 'Regular' : 'Prepaid';
        this.headerClass = ctype == 1 ? 'regular' : 'prepaid';
    }

    reset(){
        this.goBack();
    }

    resetTimer(){
        if(this.goBackTimer) clearTimeout(this.goBackTimer);

        if(!Comu.settings.getItem('categoryAutoBack')) return;
        
        this.goBackTimer = setTimeout(() => this.reset(), 700);
    }

    created(){
        Comu.registerToReset(this);
    }
    
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars.scss';
$header-h: 2.6rem;
div.root{
    padding-top: $header-h !important;
}
.header{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: $header-h;
    padding: 0.5rem;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
}
.label{
    opacity: 0.7;
    font-weight: normal;
    font-style: italic;
}
.backBtn{
    float: left;
    margin-left: 0.3rem;
    margin-right: -100px;
}
.regular{
    background-color: $blue;
}
.prepaid{
    background-color: $red;
}
</style>
