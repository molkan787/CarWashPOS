<template>
    <div class="page">
        <Header />
        <CBody />
        <PaymentModal />
        <GiftCertificateModal />
        <ToolsModal />
        <LoyaltyScanModal />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './Header.vue';
import CBody from './CBody.vue';
import PaymentModal from './Elements/PaymentModal.vue';
import GiftCertificateModal from '../pre/GiftCertificateModal.vue';
import ToolsModal from '../pre/ToolsModal.vue';
import LoyaltyScanModal from '../pre/LoyaltyScanModal.vue';

@Component({
    components: {
        Header,
        CBody,
        PaymentModal,
        GiftCertificateModal,
        ToolsModal,
        LoyaltyScanModal,
    },
})
export default class Home extends Vue {}
</script>
