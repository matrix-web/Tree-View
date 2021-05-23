import Toast from "../assets/js/modules/toast";

export default {
  install(Vue) {
    Vue.prototype.$message = function (html) {
      new Toast({ contentHTML: html });
    };

    Vue.prototype.$error = function (html) {
      new Toast({ contentHTML: html });
    };
  },
};
