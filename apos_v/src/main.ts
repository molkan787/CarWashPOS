import Vue from 'vue';
import filters from './filters/';
// @ts-ignore
import SuiVue from 'semantic-ui-vue';
import PortalVue from 'portal-vue';
import Datetime from 'vue-datetime'
import App from './App.vue';
import router from './router';
import store from './store';
import 'vue-datetime/dist/vue-datetime.css'

Vue.config.productionTip = false;
Vue.use(SuiVue);
Vue.use(PortalVue);
Vue.use(Datetime);
Vue.use(filters);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

