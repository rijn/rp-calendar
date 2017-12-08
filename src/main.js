import Vue from 'vue'
import App from './App'

import './components/vue-event-calendar/dist/style.css'
import vueEventCalendar from './components/vue-event-calendar'
Vue.use(vueEventCalendar, { locale: 'en' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
