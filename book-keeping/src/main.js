import { createApp } from "vue";
import { ConfigProvider } from "vant";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "@/router";
import "vant/lib/index.css";
import "@/assets/iconfont/iconfont.css";
import useStorage from "./utils/storage";

const storage = useStorage();
const app = createApp(App);

app.use(ConfigProvider);
app.use(router);
app.use(createPinia());

app.mount("#app");

window.addEventListener("beforeunload", () => {
  if (!storage.getItem("rememberPwd")) {
    storage.clear();
  }
});
