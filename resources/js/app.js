// import './bootstrap';

import { createApp } from 'vue'
import LeanStartupGame from './components/LeanStartupGame.vue'
import axios from 'axios';
import VueMatomo from 'vue-matomo'

import '@mdi/font/css/materialdesignicons.css'


const app = createApp()
 
app.component('lean-startup-game', LeanStartupGame)
 

app.use(VueMatomo, {
  host: 'https://matomo.modusoft.nl/',
  siteId: 1
});

app.config.globalProperties.$axios = axios;

app.mount('#app')