import Vue from 'vue';
import VueResource from 'vue-resource';
import FullCalendar from 'vue-full-calendar';
import App from './App.vue';

import './registerServiceWorker';

Vue.use(VueResource);
// Vue.http.options.root = 'https://vuejs-60074.firebaseio.com/'

Vue.use(FullCalendar);


Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
