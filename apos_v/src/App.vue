<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
    <CustomValueModal />
    <PrepaidCardModal />
    <LoyaltyCardModal />
    <MessageModal />
    <InActiveModal />
    <OptionsModal />
    <ClientModal />
    <ReasonModal />
    <ImportDataModal />
    <ExportDataModal />
    <EditCardBarcodeModal />
    <AddLoyaltyPointsModal />
    <PasswordModal />

    <div class="demo-label" v-if="demoMode">
      DEMO / TESTING
    </div>

    <portal-target name="semantic-ui-vue" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions, mapState} from 'vuex';
import CustomValueModal from './components/Helpers/CustomValueModal.vue';
import PrepaidCardModal from './components/pre/PrepaidCardModal.vue';
import LoyaltyCardModal from './components/pre/LoyaltyCardModal.vue';
import MessageModal from './components/pre/MessageModal.vue';
import InActiveModal from './components/pre/InActiveModal.vue';
import OptionsModal from './components/pre/OptionsModal.vue';
import ClientModal from './components/pre/ClientModal.vue';
import ReasonModal from './components/pre/ReasonModal.vue';
import ImportDataModal from './components/pre/ImportDataModal.vue';
import ExportDataModal from './components/pre/ExportDataModal.vue';
import EditCardBarcodeModal from './components/pre/EditCardBarcodeModal.vue';
import AddLoyaltyPointsModal from './components/pre/AddLoyaltyPointsModal.vue';
import PasswordModal from './components/pre/PasswordModal.vue';

export default Vue.extend({
  components: {
    CustomValueModal,
    PrepaidCardModal,
    LoyaltyCardModal,
    MessageModal,
    InActiveModal,
    OptionsModal,
    ClientModal,
    ReasonModal,
    ImportDataModal,
    ExportDataModal,
    EditCardBarcodeModal,
    AddLoyaltyPointsModal,
    PasswordModal,
  },
  methods: {
    ...mapActions(['setup'])
  },
  computed: mapState(['demoMode']),

  created(){
    this.setup();
  }
});
</script>


<style lang="scss">
@import '@/scss/vars.scss';
@import '@/scss/global.scss';
body{
  padding: 0;
  margin: 0;
  padding-top: $navbar-h;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  position: fixed;
  z-index: 1000;
  top: 0; left: 0;
  width: 100%;
  height: $navbar-h;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fafafa;
  box-shadow: 0 0 6px #999;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

$dl-w: 14rem;
.demo-label{
  position: fixed;
  top: 0;
  left: 50%;
  margin-left: $dl-w / -2;
  width: $dl-w;
  height: 2rem;
  background-color: #42b983;
  color: white;
  border: 1px solid #2b865d;
  font-size: 1.2rem;
  box-sizing: border-box;
  padding-top: 0.2rem;
  font-weight: bold;
  box-shadow: 0 0 3px #2b865d;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  user-select: none;
}
</style>
