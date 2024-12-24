import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";


createApp(App).use(router).mount('#app')

if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
}

console.log("Kakao SDK Initialized");  