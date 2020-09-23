import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '@/assets/css/global.css'

import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)

// 导入NProgress进度条动画
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入字体图标库
import '@/assets/fonts/iconfont.css'

// 导入全局axios
import axios from 'axios'
Vue.prototype.$axios = axios

//配置请求的根路径
// 'http://127.0.0.1:8888/api/private/v1/'
// 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截
axios.interceptors.request.use(config => {
	//在request拦截器中，显示进度条
	NProgress.start();
	
	config.headers.Authorization = window.sessionStorage.getItem('token')
	//在最后必须return config
	return config
})

//响应拦截
axios.interceptors.response.use(config => {
	//在response拦截器中，隐藏进度条
	NProgress.done();
	
	return config
})


import netClient from './network/index.js'
Vue.prototype.$netClient = netClient

Vue.config.productionTip = false

// 定义全局过滤器
Vue.filter('filterTime',(value)=>{
	const date = new Date(value)
	
	const y = date.getFullYear()
	const m = (date.getMonth() + 1 + '').padStart(2,'0')
	const d = (date.getDate() + '').padStart(2,'0')
	
	const h = (date.getHours() + '').padStart(2,'0')
	const min = (date.getMinutes() + '').padStart(2,'0')
	const ss = (date.getSeconds() + '').padStart(2,'0')
	
	return `${y}-${m}-${d} ${h}:${min}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
