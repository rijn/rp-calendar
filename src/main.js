import Vue from 'vue';
import App from './App';
import jsforce from 'jsforce';
// import router from './router';
import FullCalendar from 'vue-full-calendar';
import 'normalize.css/normalize.css';
import {
  Container, Header, Aside, Main, Button, Form, FormItem, Input,
  Message, Steps, Step, Row, Col, Switch
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
// import 'vue-event-calendar/dist/style.css';
import vueEventCalendar from './components/vue-event-calendar';

Vue.use(vueEventCalendar, {locale: 'en'});

window.jQuery = window.$ = require('jquery');
Vue.use(FullCalendar);

locale.use(lang);

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Row);
Vue.use(Col);
Vue.use(Switch);

Vue.prototype.$message = Message;

Vue.prototype.$error = (errors) => {
  Message.error(errors);
};

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

Vue.prototype.$rules = {
  mappers: [
    date => date.day() === 0 ? [] : [ { start: date.clone().set({ 'hour': 13, 'minute': 30 }), duration: { minute: 15 } } ],
    date => date.day() === 0 ? [] : [ { start: date.clone().set({ 'hour': 14, 'minute': 30 }), duration: { minute: 15 } } ]
  ],
  filters: [
    ({ start }) => start.format('YYYY-MM-DD') !== '2018-02-26'
  ]
};

// eslint-disable-next-line
new Vue({
  el: '#app',
  // router,
  template: '<App/>',
  components: { App }
});
