import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
//引入pinia
import { createPinia } from 'pinia';
//完整引入element-plus
import ElementPlus from 'element-plus';
import * as ElIcons from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';

//引入公共样式
import './assets/style/index.scss';
import './assets/style/reset.css';
import './assets/iconfont/iconfont.css';

const app = createApp(App);

//注册el图标
for (const name in ElIcons) {
    app.component(name, ElIcons[name]);
}
app.provide('icons', ElIcons);
app.use(router).use(ElementPlus).use(createPinia());
app.mount('#app');
