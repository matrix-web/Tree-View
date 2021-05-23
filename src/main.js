import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import messagePlugin from "@/utils/message.plugin.js";

Vue.config.productionTip = false;
Vue.use(messagePlugin);

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
