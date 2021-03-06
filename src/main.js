import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import treetable from 'vue-table-with-tree-grid'

//引入axios
import axios from 'axios'

//配置axios的默认根路径

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use( config =>{
  
  config.headers.Authorization = window.sessionStorage.getItem('token')

  return config
})
//挂载到vue原型对象上
Vue.prototype.$http = axios 



Vue.config.productionTip = false

Vue.component('tree-table', treetable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
