import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './components/login/login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/pos',
      name: 'pos',
      component: () => import('./components/pos/POS.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./components/admin/admin.vue'),
    },
  ],
});
