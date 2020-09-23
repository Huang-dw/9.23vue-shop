<template>
	<div style="height: 100%;width: 100%;">

		<el-container class="home-container">
			
			<!-- 头部组件 -->
			<el-header>
				<div class="header-box1">
					<div>
						<img src="../assets/img/heima.png" width="100%" height="100%">
					</div>
					<div style="color: white;margin-left: 10px;">电商后台管理系统</div>
				</div>
				<el-button @click="onLogout" style="height: 60%;" type="info">退出</el-button>
			</el-header>

			<el-container>
				
				<!-- 侧边栏 -->
				<el-aside :width="fold ? '64px' : '200px'">
					<div @click="onFold" class="aside-top">|||</div>
					
					<el-menu default-active="2" 
						class="el-menu-vertical-demo" 
						background-color="#313743"
						text-color="#fff" 
						active-text-color="#409EFF"
						unique-opened
						router
						:default-active="savePath"
						:collapse-transition="false"
						:collapse="fold">
					
						<!-- 一级菜单 -->
						<el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
							<template slot="title">
								<i :class="iconImg[item.id]"></i>
								<span>{{item.authName}}</span>
							</template>

							<!-- 二级菜单 -->
							<el-menu-item :index="'/' + item2.path" 
								v-for="item2 in item.children" :key="item2.id"
								@click="onTwonav('/' + item2.path)">
								<template slot="title">
									<i class="el-icon-menu"></i>
									<span>{{item2.authName}}</span>
								</template>
							</el-menu-item>
							
						</el-submenu>
						
					</el-menu>
				</el-aside>
				
				<!-- 右侧内容 -->
				<el-main>
					<router-view></router-view>
				</el-main>
				
			</el-container>
			
		</el-container>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				menusList:[],
				iconImg:{
					'125':'iconfont icon-users',
					'103':'iconfont icon-tijikongjian',
					'101':'iconfont icon-shangpin',
					'102':'iconfont icon-danju',
					'145':'iconfont icon-baobiao',
				},
				fold:false,
				savePath:''
			}
		},
		created() {
			this.$netClient.getCnav().then(res=>{
				// console.log(res.data);
				if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg);
				this.menusList = res.data.data
			})
			
			this.savePath = window.sessionStorage.getItem('savePath')
		},
		methods: {
			onLogout() { //退出登录
				window.sessionStorage.clear()
				this.$router.push('/')
			},
			onFold(){ //点击折叠菜单
				this.fold = !this.fold
			},
			onTwonav(savePath){ //点击二级菜单
				window.sessionStorage.setItem('savePath',savePath)
				this.savePath = savePath
			}
		}
	}
</script>

<style scoped>
	.el-header {
		background-color: #363D40;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 0;
	}

	.el-aside {
		background-color: #313743;
	}

	.el-main {
		background-color: #E9EDF1;
	}

	.home-container {
		height: 100%;
	}

	.header-box1 {
		display: flex;
		align-items: center;
	}
	.iconfont{
		margin-right: 10px;
	}
	.aside-top{
		background-color: #4A5064;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		height: 30px;
		letter-spacing: 3px;
		cursor: pointer;
	}
	.el-menu{
		border-right: 0px;
	}
</style>
