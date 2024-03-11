import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import VueProgressBar from "vue-progressbar";
import store from "./store";
import "./plugins/vue-gapi";
import "./plugins/vue-notification";
import "./plugins/vue-modal";
import Vue2Filters from "vue2-filters";

Vue.use(Vue2Filters);

const options = {
    color: "#ff0101",
    failedColor: "#874b4b",
    thickness: "5px",
    transition: {
        speed: "0.2s",
        opacity: "0.6s",
        termination: 300,
    },
    autoRevert: true,
    location: "top",
    inverse: false,
    autoFinish: false,
};

Vue.use(VueProgressBar, options);

Vue.config.productionTip = false;

window.onerror = function (e) {
    alert("Error caught");
    console.log(e.error);
};

window.addEventListener("error", function (e) {
    alert("Error occurred: " + e.error.message);
    return false;
});
function onError() {
    window.addEventListener("error", function (e) {
        alert("Error occurred: " + e.error.message);
        return false;
    });
}

onError();
new Vue({
    router,
    store,
    mixins: [Vue2Filters.mixin],
    render: (h) => h(App),
}).$mount("#gwebmail");
