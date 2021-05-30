<template>
    <div class="ui form">
        <div class="inline fields">
            <div class="nine wide field">
                <label>Name</label>
                <sui-input v-model="data.first_name" placeholder="First Name" icon="user"/>
            </div>
            <div class="seven wide field">
                <sui-input v-model="data.last_name" placeholder="Last Name" icon="user"/>
            </div>
        </div>
        <div class="inline fields">
            <div class="nine wide field">
                <label>Phone</label>
                <PhoneInput v-model="data.phone" placeholder="Phone number" icon="phone" />
            </div>
            <div class="seven wide field">
                <sui-input v-model="data.email" placeholder="Email" icon="at"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import PhoneInput from './PhoneInput.vue'

@Component({
    components: {
        PhoneInput,
    }
})
export default class ClientInfoForm extends Vue{

    @Prop({default: () => ({
            phone: '',
            email: '',
            first_name: '',
            last_name: ''
        }) }) data!: any;

}
</script>


<style lang="scss" scoped>
.field > label{
    font-size: 1.3rem !important;
    width: 6rem !important;
}
</style>
