import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Main';
import EventPage from '@/components/EventPage';

Vue.use(Router);

let router = new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    name: 'MainPage',
    component: Main
  }, {
    path: '/:eventId',
    component: Main,
    children: [{
      path: '/',
      name: 'EventPage',
      component: EventPage
    }]
  }],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

export default router;
