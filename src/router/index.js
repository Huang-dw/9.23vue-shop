import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'login',
		component: () => import('@/views/Login')
	},
	{
		path: '/home',
		name: 'home',
		redirect:'/welcome',
		component: () => import('@/views/Home'),
		children:[
			{
				path:'/welcome',
				name:'welcome',
				component: ()=> import('@/views/Welcome')
			},
			{
				path:'/users',
				component: ()=> import ('@/views/users/Users')
			},
			{
				path:'/rights',
				component: ()=> import ('@/views/power/Rights')
			},
			{
				path:'/roles',
				component: ()=> import ('@/views/power/Roles')
			},
			{
				path:'/categories',
				component: ()=> import ('@/views/goods/Categories')
			},
			{
				path:'/params',
				component: ()=> import ('@/views/goods/Params')
			},
			{
				path:'/goods',
				component: ()=> import ('@/views/goods/Goods')
			},
			{
				path:'/goods/addgoods',
				component: ()=> import ('@/views/goods/AddGoods')
			},
			{
				path:'/orders',
				component: ()=> import ('@/views/orders/Orders')
			},
			{
				path:'/reports',
				component: ()=> import ('@/views/reports/Reports')
			}
		]
	},
]

const router = new VueRouter({
	routes
})

// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
	
	if(to.path === '/'){
		return next()
	}
	
	// 获取token
	const tokenStr =  window.sessionStorage.getItem('token')
	
	if(!tokenStr){
		return next('/')
	}else{
		return next()
	}
})

export default router
