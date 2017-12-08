import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

Vue.prototype.$sforce = window.sforce;

// eslint-disable-next-line
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
