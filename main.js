import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
// 引入vuex 状态库
import store from "./store";
Vue.prototype.$store = store;

const app = new Vue({
    ...App
})
app.$mount()
