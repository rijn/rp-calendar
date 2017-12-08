import Vue from 'vue';
import App from './App';
import jsforce from 'jsforce';

if (process.env.NODE_ENV == 'development') {
  window.__sfdcSessionId = '00D2F0000008v9r!AQMAQGjTUcb6Rtf5AxPBdR2GSX7Yx.RsIC4i97LpHD3hBGqG4.DOgE.sJ5IcdnyNjviNayBovCAtJzKfCG1eHEngMoo2Sl6X';
}

Vue.config.productionTip = false;

var conn = new jsforce.Connection({
  // instanceUrl: 'https://c.cs91.visual.force.com',
  version: '41.0',
  accessToken: window.__sfdcSessionId
});

Vue.prototype.$sforce = window.sforce;
Vue.prototype.$jsforce = window.jsforce = conn;

// eslint-disable-next-line
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
