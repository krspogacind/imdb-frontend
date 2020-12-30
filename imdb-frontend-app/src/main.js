import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from "./router";
import "./axios";
import Toast from "vue3-toast-single";
import "vue3-toast-single/dist/toast.css";
import store from "./vuex";
import vueDebounce from "vue-debounce";

createApp(App)
  .use(router)
  .use(store)
  .use(vueDebounce, {
    defaultTime: "750ms",
  })
  .use(Toast, { verticalPosition: "bottom", duration: 1500 })
  .mount("#app");
