import Vue from 'vue';
import App from './App';
import jsforce from 'jsforce';
import FullCalendar from 'vue-full-calendar';

window.jQuery = window.$ = require('jquery');

Vue.use(FullCalendar);

// if (process.env.NODE_ENV === 'development') {
//   window.__sfdcSessionId = '00D2F0000008v9r!AQMAQGjTUcb6Rtf5AxPBdR2GSX7Yx.RsIC4i97LpHD3hBGqG4.DOgE.sJ5IcdnyNjviNayBovCAtJzKfCG1eHEngMoo2Sl6X';
// }

Vue.config.productionTip = false;

var _jsforce = new jsforce.Connection({
  // instanceUrl: 'https://c.cs91.visual.force.com',
  version: '41.0',
  accessToken: window.__sfdcSessionId
});

Vue.prototype.$sforce = window.sforce;

window.jsforce = _jsforce;
window.$jsforce = Vue.prototype.$jsforce = {
  query: q => new Promise((resolve, reject) => {
    _jsforce.query(q, (err, result) => {
      if (err) reject(err); else resolve(result);
    });
  })
};

// eslint-disable-next-line
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
