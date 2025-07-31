// src/main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import api from './axios'

const app = createApp(App)
app.use(router)
app.config.globalProperties.$http = api
app.mount('#app')
