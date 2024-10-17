import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import VueGoogleMaps from '@fawmi/vue-google-maps';
import router from './router';

const app = createApp(App);
app.use(router);
app.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_MAPS_API_KEY,
  },
});
app.mount('#app');
