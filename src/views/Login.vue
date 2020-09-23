<template>
	<div class="login-dbox">

		<div class="login-content">
			<div class="content-log">
				<img src="../assets/logo.png" width="100%" height="100%">
			</div>

			<!-- 表单 -->
			<el-form ref="formRef" :model="loginForm" :rules="rules" label-width="0" class="login-from">
				<!-- 用户名 -->
				<el-form-item prop="name">
					<el-input v-model="loginForm.name" prefix-icon="iconfont icon-user"></el-input>
				</el-form-item>

				<!-- 密码 -->
				<el-form-item prop="region">
					<el-input show-password v-model="loginForm.region" prefix-icon="iconfont icon-3702mima"></el-input>
				</el-form-item>

				<!-- 按钮 -->
				<el-form-item class="from-btn">
					<el-button @click="onLogin" type="primary">登录</el-button>
					<el-button @click="onReset" type="info">重置</el-button>
				</el-form-item>
			</el-form>
		</div>

	</div>
</template>

<script>
	import qs from 'qs'
	export default {
		data() {
			return {
				loginForm: {
					name: 'admin',
					region: '123456'
				},
				rules: {
					name: [
						{required: true,message: '请输入登录名称',trigger: 'blur'},
						{min: 3,max: 6,message: '长度在 3 到 6 个字符',trigger: 'blur'}
					],
					region: [
						{required: true,message: '请输入登录密码',trigger: 'blur'},
						{min: 3,max: 15,message: '长度在 3 到 15 个字符',trigger: 'blur'}
					],
				}
			}
		},
		methods:{
			onReset(){ //重置按钮
				this.$refs.formRef.resetFields()
			},
			onLogin(){ //登录按钮
				this.$refs.formRef.validate(value=>{
					// console.log(value);
					if(value){
						this.$netClient.getLogin(
							qs.stringify({
								username:this.loginForm.name,
								password:this.loginForm.region
							})
						).then(res=>{
							console.log(res);
							let text = res.data.meta.msg
							if(res.data.meta.status == 200){
								this.$message({
									message: text,
									type: 'success'
								});
								window.sessionStorage.setItem("token",res.data.data.token)
								this.$router.push('/home')
							}else{
								this.$message({
									message: text,
									type: 'warning'
								});
							}
						})
					}else{
						this.$message.error('登录失败！');
					}
				})
			}
		}
	}
</script>

<style scoped>
	.login-dbox {
		width: 100%;
		height: 100%;
		background-color: #2b4b6B;
		position: relative;
	}

	.login-content {
		width: 50%;
		height: 50%;
		background-color: white;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		border-radius: 5px;
	}

	.content-log {
		width: 100px;
		height: 100px;
		border: 1px solid gainsboro;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #DCDCDC;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
	}

	.content-log img {
		border-radius: 50%;
		background-color: #DCDCDC;
	}

	.login-from {
		width: 100%;
		position: absolute;
		bottom: 0;
		box-sizing: border-box;
		padding: 0 20px;
	}

	.from-btn {
		display: flex;
		justify-content: flex-end;
	}
</style>
