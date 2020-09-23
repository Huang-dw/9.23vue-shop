<template>
	<div>
		
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片 -->
		<el-card>
			<!-- 添加角色 -->
			<el-button @click="addUserDialog = true" type="primary">添加角色</el-button>
			
			<!-- 表格 -->
			<el-table border stripe :data="roles">
				
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						
						<!-- 一级权限 -->
						<el-row :class="['rowbd-bottom', index1 == 0 ? 'rowbd-top' : '','flex-align']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
							<el-col :span="6">
								<el-tag @close="onDeltag(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<el-col :span="18">
								
								<!-- 二级权限 -->
								<el-row :class="[index2 == 0 ? '' : 'rowbd-top','flex-align']" v-for="(item2,index2) in item1.children" :key="item2.id">
									<el-col :span="6">
										<el-tag @close="onDeltag(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										<!-- 三级权限 -->
										<el-tag @close="onDeltag(scope.row,item3.id)" closable v-for="(item3,index3) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
								
							</el-col>
						</el-row>
						
					<!-- 	<pre>
							{{scope.row}}
						</pre> -->
					</template>
				</el-table-column>
				
				<el-table-column type="index"></el-table-column><!-- 索引列 -->
				<el-table-column prop="roleName"  label="角色名称"></el-table-column>
				<el-table-column prop="roleDesc" label="角色描述"></el-table-column>
				
				<!-- 操作 -->
				<el-table-column width="290px" label="操作">
					<template slot-scope="scope">
						<el-button @click="statusUser(scope.row)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
						<el-button @click="deleteUser(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
						<el-button @click="onPower(scope.row)" type="warning" size="mini" icon="el-icon-setting">分配权限</el-button>
					</template>
				</el-table-column>
				
			</el-table>
		</el-card>
		
		<!-- 分配权限对话框 -->
		<el-dialog
			title="分配权限"
			width="50%"
			@close="closeDialog"
			:visible.sync="powerDialog">
			
			<!-- 树形控件 -->
			<el-tree ref="treeRef" :data="powerStrator" node-key="id" :props="defaultProps" :default-checked-keys="defaPowerId" default-expand-all show-checkbox></el-tree>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="powerDialog = false">取 消</el-button>
				<el-button type="primary" @click="savePower">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 添加角色对话框 -->
		<el-dialog
			title="添加角色"
			width="50%"
			:visible.sync="addUserDialog"
			@close="onClose">
			
			<!-- 添加用户对话框内表单验证 -->
			<el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="80px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="ruleForm.roleName"></el-input>
				</el-form-item>
				
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="ruleForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="addUserDialog = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 点击修改角色对话框 -->
		<el-dialog
			title="编辑角色信息"
			width="50%"
			@close="onModiClose"
			:visible.sync="statusVisible">
		
			<!-- 修改角色对话框内表单验证 -->
			<el-form :model="modiInfo" :rules="modiRules" ref="modiRef" label-width="80px" >
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="modiInfo.roleName"></el-input>
				</el-form-item>
				
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="modiInfo.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			
			<span slot="footer">
				<el-button @click="statusVisible = false">取 消</el-button>
				<el-button type="primary" @click="onStatusUser">确 定</el-button>
			</span>
		</el-dialog>
		
	</div>
</template>

<script>
	import qs from 'qs'
	export default{
		data(){
			return{
				roles:[],
				powerDialog:false, //分配权限对话框显示隐藏
				powerStrator:[], //权限列表数据
				defaultProps: { //树形控件
					children: 'children',
					label: 'authName'
				},
				defaPowerId:[], //默认选中的三级权限id
				roleID:'',
				addUserDialog:false, //控制添加角色对话框显示或隐藏
				statusVisible:false, //控制修改角色对话框显示或隐藏
				modiInfo:{}, //根据id查询到的角色
				ruleForm:{ //数据绑定对象
					roleName:'',
					roleDesc:'',
				},
				rules: { // 验证规则对象
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
					roleDesc: [
						{ required: true, message: '请输入角色描述', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
				},
				modiInfo:{ //数据绑定对象
					roleName:'',
					roleDesc:'',
				},
				modiRules:{
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
					roleDesc: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
				}
			}
		},
		created() {
			this.getRoles()
		},
		methods:{
			getRoles(){ //获取角色列表
				this.$netClient.getRoles().then(res=>{
					console.log(res);
					this.roles = res.data.data
				})
			},
			onDeltag(role,rightId){ //删除三级权限tag
				this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.delete(`roles/${role.id}/rights/${rightId}`).then(res=>{
						// console.log(res);
						if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
						role.children = res.data.data
						this.$message.success('删除权限成功')
					})
				}).catch(() => {
						this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			onPower(role){ //点击分配权限按钮
				this.powerDialog = true
				this.roleID = role.id
				
				// 获取权限列表树形显示权限数据
				this.$axios.get('rights/tree').then(res=>{
					console.log(res);
					this.powerStrator = res.data.data
				})
				
				// 递归获取三级节点的id
				this.getDefaultId(role,this.defaPowerId)
			},
			getDefaultId(node,arr){ //通过递归的形式，获取角色下所有三级权限的id，并保存到defaPowerId数组中
				// 如果node节点不包含children属性，则是三级id
				if(!node.children){
					return arr.push(node.id)
				}
				
				node.children.forEach(item=>{
					this.getDefaultId(item,arr)
				})
			},
			closeDialog(){ //关闭分配权限对话框
				this.defaPowerId = []
			},
			savePower(){ //点击确定保存角色授权
				const keys = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				// console.log(keys);
				let strID = keys.join(',')
				
				// 获取角色授权数据
				this.$axios.post(`roles/${this.roleID}/rights`,{
					rids:strID
				}).then(res=>{
					// console.log(res);
					this.powerDialog = false
					if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
					this.$message.success('分配权限成功')
					this.getRoles()
				})
			},
			addUser(){ //添加角色
				this.$refs.ruleFormRef.validate(validate =>{
					if(!validate) return
					
					// 请求添加角色接口
					this.$axios.post('roles',this.ruleForm).then(res=>{
						console.log(res.data);
						if(res.data.meta.status != 201) return this.$message.error(res.data.meta.msg)
						this.$message.success('添加角色成功')
						this.addUserDialog = false
						this.getRoles()
					})
				})
				
			},
			onClose(){ //关闭对话框后执行 重置
				this.$refs.ruleFormRef.resetFields()
			},
			statusUser(row){ //点击修改角色按钮
				this.$axios.get(`roles/${row.id}`).then(res=>{
					// console.log(res.data);
					this.modiInfo = res.data.data
				})
				
				this.statusVisible = true
			},
			onStatusUser(){ //点击修改角色对话框内确定修改按钮
				// console.log(this.modiInfo);
				this.$refs.modiRef.validate(date=>{
					if(!date) return this.$message.error('修改角色失败')
					
					this.$axios.put(`roles/${this.modiInfo.roleId}`,this.modiInfo).then(res=>{
						// console.log(res.data);
						if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
						this.$message.success('修改用户成功')
						this.getRoles()
					})
					
					this.statusVisible = false
				})
			},
			onModiClose(){ //关闭对话框后执行 重置
				this.$refs.modiRef.resetFields()
			},
			deleteUser(row){ //删除角色
				// console.log(row);
				this.$confirm('此操作将永久删除这条数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.delete(`roles/${row.id}`).then(res=>{
						// console.log(res.data);
						if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
						this.$message.success('删除角色成功')
						this.getRoles()
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}
		}
	}
</script>

<style scoped="scoped">
	.el-breadcrumb {
		margin-bottom: 15px;
		font-size: 14px;
	}
	.el-tag{
		margin: 7px;
	}
	.rowbd-bottom{
		border-bottom: 1px solid #eee;
	}
	.rowbd-top{
		border-top: 1px solid #eee;
	}
	.flex-align{
		display: flex;
		align-items: center;
	}
	.el-table{
		margin-top: 15px;
		font-size: 12px;
	}
</style>
