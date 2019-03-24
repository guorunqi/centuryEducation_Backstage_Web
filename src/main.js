import Vue from 'vue'
import common from './common/js/common.js'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//import Mock from './mock'      -----------mock
//Mock.bootstrap();              -----------mock
import axios from 'axios';

//UE富文本
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

import  VueQuillEditor from 'vue-quill-editor';
Vue.use(VueQuillEditor);

axios.defaults.withCredentials = true;
axios.interceptors.response.use(data => {// 响应成功关闭loading
  if(data.data=="{error:'session过期'}"){
    router.push({ path: '/login' });
  }else{
    return data
  }

});

Vue.prototype.$ajax = axios;
import qs from 'qs';


Vue.config.devtools = true;


import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(common)
Vue.use(qs)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

