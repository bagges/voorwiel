import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

var appConfig = require(`../config/config.${process.env.NODE_ENV}.js`).default;

Vue.use(Vuex);
Vue.use(VueRouter);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false;

Vue.prototype.$appConfig = appConfig;

import Login from './components/Login';
import Rent from './components/Rent';

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', component: Login },
    { path: '/rent', component: Rent, meta: { requiresAuth: true }, props: (route) => {
      if (route.query && route.query.id) {
        return { bikeId: route.query.id }
      }
      return {};
    }},
    { path: '/b/:id', redirect: to => {
      const { params } = to;
      return { path: '/rent', query: { id: params.id } };
    }},
  ],
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  store.dispatch("IS_AUTHENTICATED")
    .then(() => next())
    .catch(() => next({ path: '/login' }));
});

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app');
