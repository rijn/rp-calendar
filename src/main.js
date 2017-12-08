import Vue from 'vue';
import App from './App';
import jsforce from 'jsforce';

if (process.env.NODE_ENV == 'development') {
  window.__sfdcSessionId = '00D2F0000008v9r!AQMAQGjTUcb6Rtf5AxPBdR2GSX7Yx.RsIC4i97LpHD3hBGqG4.DOgE.sJ5IcdnyNjviNayBovCAtJzKfCG1eHEngMoo2Sl6X';
}

console.log(`session ${window.__sfdcSessionId}`);

Vue.config.productionTip = false;

var conn = new jsforce.Connection({
  // instanceUrl: 'https://c.cs91.visual.force.com',
  version: '41.0',
  accessToken: window.__sfdcSessionId
});

conn.metadata.describe('41.0', function (err, metadata) {
  if (err) { return console.error('err', err); }
  console.log(metadata);
  for (var i = 0; i < metadata.length; i++) {
    var meta = metadata[i];
    console.log('organizationNamespace: ' + meta.organizationNamespace);
    console.log('partialSaveAllowed: ' + meta.partialSaveAllowed);
    console.log('testRequired: ' + meta.testRequired);
    console.log('metadataObjects count: ' + metadataObjects.length);
  }
});

Vue.prototype.$sforce = window.sforce;
Vue.prototype.$jsforce = conn;

// eslint-disable-next-line
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
