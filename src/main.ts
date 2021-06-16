import { createApp } from 'vue';
import App from './App.vue';


const app = createApp(App);

// @ts-ignore
window.__app__ = app;
