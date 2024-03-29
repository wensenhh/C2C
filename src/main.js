import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'vant/es/dialog/style';
import 'vant/es/toast/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';
import App from './App.vue'
import router from './router'
import piniaPluginPersist from 'pinia-plugin-persist'//引入pinia数据持久化插件


let app = createApp(App)
app.config.globalProperties.getEnv = import.meta.env
app.use(createPinia().use(piniaPluginPersist)).use(router).mount('#app')
