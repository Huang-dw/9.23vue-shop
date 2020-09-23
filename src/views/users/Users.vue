<template>
	<div>
		
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片 -->
		<el-card class="box-card">
			
			<!-- 搜索 -->
			<el-row :gutter="20">
				<el-col :span="10">
					<el-input @clear="getUser" v-model="query" clearable placeholder="请输入内容">
						<el-button @click="getUser" slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>

				<el-col :span="4">
					<el-button @click="dialogVisible = true" type="primary">添加用户</el-button>
				</el-col>
			</el-row>
			
			<!-- 表格 -->
			<el-table border stripe :data="userList">
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="username"  label="姓名"></el-table-column>
				<el-table-column prop="email" label="邮箱"></el-table-column>
				<el-table-column prop="mobile" label="电话"></el-table-column>
				<el-table-column prop="role_name" label="角色"></el-table-column>
				
				<el-table-column label="状态">
					<template slot-scope="scope">
						<!-- {{scope.row}} -->
						<el-switch 
							v-model="scope.row.mg_state"
							active-color="#409EFF"
							@change="onSwitch(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				
				<el-table-column width="180px" label="操作">
					<template slot-scope="scope">
						<el-button @click="onModi(scope.row.id)" type="primary" size="mini" icon="el-icon-edit"></el-button>
						<el-button @click="delUser(scope.row.id)" type="danger" size="mini" icon="el-icon-delete"></el-button>
						
						<el-tooltip :enterable="false" class="item" effect="dark" content="管理" placement="top">
							<el-button @click="onManage(scope.row)" type="warning" size="mini" icon="el-icon-setting"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			
			<!-- 分页 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage4"
			      :page-sizes="[2,4,5,10]"
			      :page-size="5"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			</el-pagination>
			
		</el-card>
		
		
		<!-- 添加用户的对话框 -->
		<el-dialog
			title="添加用户"
			width="50%"
			@close="onClose"
			:visible.sync="dialogVisible"
			>
			
			<!-- 对话框内表单验证 -->
			<el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="70px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="ruleForm.username"></el-input>
				</el-form-item>
				
				<el-form-item label="密码" prop="password">
					<el-input v-model="ruleForm.password"></el-input>
				</el-form-item>
				
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="ruleForm.email"></el-input>
				</el-form-item>
				
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="ruleForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>
		
		
		<!-- 修改用户对话框 -->
		<el-dialog
			title="修改用户"
			width="50%"
			@close="onModiClose"
			:visible.sync="modiVisible">
		  
			<!-- 修改用户对话框内表单验证 -->
			<el-form :model="modiInfo" :rules="modiRules" ref="modiRef" label-width="70px" class="demo-ruleForm">
				<el-form-item label="用户名">
					<el-input disabled v-model="modiInfo.username"></el-input>
				</el-form-item>
				
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="modiInfo.email"></el-input>
				</el-form-item>
				
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="modiInfo.mobile"></el-input>
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="modiVisible = false">取 消</el-button>
				<el-button type="primary" @click="modiUser">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 分配角色对话框 点击管理按钮显示隐藏-->
		<el-dialog
			title="分配角色"
			width="50%"
			@close="selectClose"
			:visible.sync="manageDialog">
			
			<div>
				<p>当前的用户：{{userInfo.username}}</p>
				<p>当前的角色：{{userInfo.role_name}}</p>
				<p>分配新角色：
					<el-select v-model="value" placeholder="请选择">
						<el-option
							v-for="item in rolesList"
							:key="item.id"
							:label="item.roleName"
							:value="item.id">
						</el-option>
					</el-select>
				</p>
			</div>
			
			<span slot="footer">
				<el-button @click="manageDialog = false">取 消</el-button>
				<el-button type="primary" @click="onManageDialog">确 定</el-button>
			</span>
		</el-dialog>
		
	</div>
</template>

<script>
	import qs from 'qs'
	export default {
		data() {
			// 验证邮箱正则
			var checkEmail = (rule, value, callback) => {
				const regEmail = /^\w+@\w+(\.\w+)+$/
				if(regEmail.test(value)){
					return callback()
				}
				callback(new Error('请输入合法的邮箱'))
			};
			// 验证手机号正则
			var checkTel = (rule, value, callback) => {
				const regTel = /^1[34578]\d{9}$/
				if(regTel.test(value)){
					return callback()
				}
				callback(new Error('请输入正确的手机号'))
			};
			return {
				userList: [],
				total: 0,
				currentPage4:1,
				pagesize:5, //每页显示条数
				pagenum:1, //当前页码
				query:'', //查询参数
				dialogVisible:false, //添加用户对话框显示或隐藏
				modiVisible:false, //修改用户对话框显示或隐藏
				modiInfo:{}, //根据 ID 查询到的用户信息
				manageDialog:false, //分配角色对话框显示或隐藏
				userInfo:{},
				rolesList:[], //角色列表数据
				value:'',
				ruleForm:{ //数据绑定对象
					username:'',
					password:'',
					email:'',
					mobile:'',
				},
				rules: { // 验证规则对象
					username: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
					],
					email: [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
						{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
						{ validator: checkEmail , trigger: 'blur' }
					],
					mobile: [
						{ required: true, message: '请输入电话号码', trigger: 'blur' },
						{ min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' },
						{ validator: checkTel , trigger: 'blur' }
					],
				},
				modiRules:{
					email: [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
						{ min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
						{ validator: checkEmail , trigger: 'blur' }
					],
					mobile: [
						{ required: true, message: '请输入电话号码', trigger: 'blur' },
						{ min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' },
						{ validator: checkTel , trigger: 'blur' }
					],
				}
			}
		},
		created() {
			this.getUser()
		},
		methods: {
			getUser(){ //封装用户数据列表接口
				this.$netClient.getUser({
					params: {
						query: this.query,
						pagenum: this.pagenum,
						pagesize: this.pagesize
					}
				}).then(res => {
					console.log(res.data);
					if (res.data.meta.status != 200) {
						return this.$message.error(res.data.meta.msg);
					}
					this.userList = res.data.data.users
					this.total = res.data.data.total
				})
			},
			handleSizeChange(pageSize){ //pageSize 改变时会触发
				console.log(pageSize);
				this.pagesize = pageSize
				this.getUser()
			},
			handleCurrentChange(currentPage){ //currentPage 改变时会触发
				// console.log(currentPage);
				this.pagenum = currentPage
				this.getUser()
			},
			onSwitch(value){ //点击开关按钮
				// console.log(value);
				this.$axios.put(`users/${value.id}/state/${value.mg_state}`)
				.then(res=>{
					// console.log(res);
					if(res.data.meta.status != 200){
						this.$message.error('更新状态失败')
					}else{
						this.$message.success('更新状态成功')
					}
				})
			},
			onClose(){ //关闭对话框后执行 重置
				this.$refs.ruleFormRef.resetFields()
			},
			addUser(){ //添加用户
				this.$refs.ruleFormRef.validate(validate =>{
					if(!validate) return
					
					// 请求添加用户接口
					this.$netClient.getaddUser(
						qs.stringify(this.ruleForm)
					).then(res=>{
						// console.log(res);
						if(res.data.meta.status != 201){
							return this.$message.error('添加用户失败')
						}
						this.$message.success('添加用户成功')
						this.dialogVisible = false
						this.getUser()
					})
				})
			},
			onModi(id){ //修改操作 点击修改按钮
				// console.log(id);
				
				this.$axios.get(`users/${id}`).then(res=>{
					console.log(res);
					this.modiInfo = res.data.data
				})
				
				this.modiVisible = true
			},
			onModiClose(){ //关闭对话框后执行 重置
				this.$refs.modiRef.resetFields()
			},
			modiUser(){ //点击修改确定按钮 进行验证
				this.modiVisible = false
				
				this.$refs.modiRef.validate(date=>{
					if(!date){
						return this.$message.error('修改用户失败')
					}
					
					this.$axios.put(`users/${this.modiInfo.id}`,{
						email:this.modiInfo.email,
						mobile:this.modiInfo.mobile
					}).then(res=>{
						// console.log(res);
						if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
						this.$message.success('修改用户成功')
						this.getUser() //更新数据列表
					})
				})
			},
			delUser(id){ //删除用户
				// console.log(id);
				this.$confirm('此操作将永久删除这条数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.delete(`users/${id}`).then(res=>{
						// console.log(res);
						if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
						this.$message.success('删除成功')
						this.getUser()
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			onManage(row){ //点击管理按钮
				this.manageDialog = true
				this.userInfo = row
				
				// 角色列表数据
				this.$netClient.getRoles().then(res=>{
					console.log(res);
					this.rolesList = res.data.data
				})
			},
			onManageDialog(){ //点击确定按钮分配角色
				this.$axios.put(`users/${this.userInfo.id}/role`,{
					rid:this.value
				}).then(res=>{
					console.log(res.data);
					if(!this.value) return this.$message.warning('请选择要分配的角色')
					this.$message.success(res.data.meta.msg)
					this.manageDialog = false
					this.getUser()
				})
			},
			selectClose(){ //关闭对话框清除下拉菜单选中
				this.value = ''
				this.userInfo = {}
			}
		}
	}
</script>

<style scoped="scoped">
	.el-breadcrumb {
		margin-bottom: 15px;
		font-size: 14px;
	}

	.box-card {
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
	}
	
	.el-table{
		margin-top: 15px;
		font-size: 12px;
	}
	.el-pagination{
		margin-top: 15px;
	}
</style>
