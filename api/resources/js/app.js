// import './bootstrap';

import { createApp } from 'vue'
import LeanStartupGame from './components/LeanStartupGame.vue'
import axios from 'axios';
import '@mdi/font/css/materialdesignicons.css'
 
const app = createApp()
 
app.component('lean-startup-game', LeanStartupGame)
 
app.config.globalProperties.$axios = axios;

app.mount('#app')