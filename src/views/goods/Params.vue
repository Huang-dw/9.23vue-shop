<template>
	<div>
		
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片 -->
		<el-card>
			<!-- 警告 -->
			<el-alert show-icon title="注意:只允许为第三级分类设置相关参数!" :closable="false" type="warning">
			</el-alert>
			
			<div class="params-cascader">
				<span>选择商品分类：</span>
				
				<!-- 级联选择器 -->
				<el-cascader
				    v-model="cascaderValue"
				    :options="cateList"
				    :props="paramsProps"
				    @change="handleChange">
				</el-cascader>
			</div>
			
			<!-- tabs标签页 -->
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<el-tab-pane label="动态参数" name="many">
					<el-button @click="addParams" :disabled="btnShow" type="primary" size="medium">添加参数</el-button>
					
					<!-- 动态参数表格 -->
					<el-table :data="manyTabData" border stripe>
						
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag @close="delClose(scope.row,index)" closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
								
								<!-- 动态编辑标签 -->
								<el-input
									class="input-new-tag"
									v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									ref="saveTagInput"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
								
							</template>
						</el-table-column>
						
						<el-table-column type="index"></el-table-column>
						<el-table-column prop="attr_name" label="参数名称"></el-table-column>
						
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button @click="onModi(scope.row)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
								<el-button @click="delParams(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					
				</el-tab-pane>
				
				<el-tab-pane label="静态属性" name="only">
					<el-button @click="addParams" :disabled="btnShow" type="primary" size="medium">添加属性</el-button>
					
					<!-- 静态属性表格 -->
					<el-table :data="onlyTabData" border stripe>
						
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag @close="delClose(scope.row,index)" closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
								
								<!-- 动态编辑标签 -->
								<el-input
									class="input-new-tag"
									v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									ref="saveTagInput"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
								
							</template>
						</el-table-column>
						<el-table-column type="index"></el-table-column>
						<el-table-column prop="attr_name" label="属性名称"></el-table-column>
						
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button @click="onModi(scope.row)" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
								<el-button @click="delParams(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					
				</el-tab-pane>
			</el-tabs>
			
		</el-card>
		
		
		<!-- 添加参数，添加属性对话框 -->
		<el-dialog
			width="50%"
			@close="addParamsClose"
			:title="'添加' + dislogText"
			:visible.sync="dialogAddParams">
			
			<!-- 添加参数或属性对话框内表单验证 -->
			<el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="80px">
				<el-form-item :label="dislogText" prop="attr_name">
					<el-input v-model="addParamsForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogAddParams = false">取 消</el-button>
				<el-button type="primary" @click="sureParams">确 定</el-button>
			</span>
		</el-dialog>
		
		
		<!-- 编辑按钮的对话框 -->
		<el-dialog
			width="50%"
			@close="modiParamsClose"
			:title="'修改' + dislogText"
			:visible.sync="dialogModiParams">
			
			<!-- 添加参数或属性对话框内表单验证 -->
			<el-form :model="modiParamsForm" :rules="modiParamsRules" ref="modiParamsRef" label-width="80px">
				<el-form-item :label="dislogText" prop="attr_name">
					<el-input v-model="modiParamsForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogModiParams = false">取 消</el-button>
				<el-button type="primary" @click="sureModiParams">确 定</el-button>
			</span>
		</el-dialog>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				cateList:[],
				paramsProps:{ //级联选择框的配置对象
					value:'cat_id',
					label:'cat_name',
					children:'children',
					expandTrigger: 'hover'
				},
				cascaderValue:[], //级联选择框双向绑定到的数组
				activeName:'many',
				manyTabData:[], //动态参数数据
				onlyTabData:[], //静态属性数据
				dialogAddParams:false, //控制添加参数，添加属性对话框显示或隐藏
				dialogModiParams:false, //控制修改参数的对话框显示或隐藏
				// 添加参数的表单数据对象
				addParamsForm:{
					attr_name:''
				},
				//验证规则对象
				addParamsRules:{
					attr_name: [
						{ required: true, message: '请输入参数名称', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
				},
				//修改参数的表单数据对象
				modiParamsForm:{
					attr_name:''
				},
				//验证规则对象
				modiParamsRules:{
					attr_name: [
						{ required: true, message: '请输入参数名称', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
				}
			}
		},
		created() {
			this.getCateList()
		},
		computed:{
			btnShow(){ //计算按钮是否禁用
				if(this.cascaderValue.length != 3){
					return true
				}
				return false
			},
			cateId(){ //当前选中三级分类id
				if(this.cascaderValue.length == 3){
					return this.cascaderValue[2]
				}
				return null
			},
			dislogText(){ //动态计算是添加参数还是添加属性
				if(this.activeName === 'many'){
					return '动态参数'
				}else{
					return '静态属性'
				}
			}
		},
		methods:{
			getCateList(){ //获取商品分类数据列表
				this.$axios.get('categories').then(res=>{
					console.log(res.data);
					this.cateList = res.data.data
				})
			},
			getStateList(){ // 获取参数列表数据
				this.$axios.get(`categories/${this.cateId}/attributes`,{
					params:{
						sel:this.activeName
					}
				}).then(res=>{
					console.log(res.data);
					
					res.data.data.forEach(item=>{
						item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
						item.inputVisible = false
						item.inputValue = ''
					})
					
					if(this.activeName === 'many'){
						this.manyTabData = res.data.data
					}else{
						this.onlyTabData = res.data.data
					}
				})
			},
			handleChange(){ //级联选择框改变时触发
				console.log(this.cascaderValue);
				if(this.cascaderValue.length != 3){
					this.cascaderValue = []
					this.manyTabData = []
					this.onlyTabData = []
					return
				}
				
				this.getStateList()
			},
			handleTabClick(){ //tab 被选中时触发
				// console.log(this.cascaderValue);
				this.getStateList()
			},
			addParams(){ //点击添加参数或属性的按钮
				this.dialogAddParams = true
			},
			addParamsClose(){ //关闭对话框后重置表单
				this.$refs.addParamsRef.resetFields()
			},
			sureParams(){ //点击对话框内确定按钮
				this.$refs.addParamsRef.validate(valid=>{
					if(!valid) return
					
					// 请求添加动态参数或者静态属性接口
					this.$axios.post(`categories/${this.cateId}/attributes`,{
						attr_name:this.addParamsForm.attr_name,
						attr_sel:this.activeName
					}).then(res=>{
						console.log(res.data);
						
						if(res.data.meta.status != 201) return this.$message.error(res.data.meta.msg)
						this.$message.success('添加参数成功')
						this.getStateList()
						this.dialogAddParams = false
					})
				})
			},
			onModi(row){ //点击编辑按钮
				// console.log(row);
				this.dialogModiParams = true
				
				// 根据 ID 查询参数
				this.$axios.get(`categories/${this.cateId}/attributes/${row.attr_id}`,{
					params:{
						attr_sel:this.activeName
					}
				}).then(res=>{
					console.log(res.data);
					this.modiParamsForm = res.data.data
				})
			},
			modiParamsClose(){ //关闭修改参数对话框后重置表单
				this.$refs.modiParamsRef.resetFields()
			},
			sureModiParams(){ //点击修改参数对话框内确定按钮触发
				this.$refs.modiParamsRef.validate(valid=>{
					if(!valid) return
					
					// 请求编辑提交参数接口
					this.$axios.put(`categories/${this.cateId}/attributes/${this.modiParamsForm.attr_id}`,{
						attr_name:this.modiParamsForm.attr_name,
						attr_sel:this.activeName
					}).then(res=>{
						// console.log(res.data);
						if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
						this.$message.success('修改参数成功')
						this.dialogModiParams = false
						this.getStateList()
					})
				})
			},
			delParams(row){ //点击删除按钮删除对应参数
				this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
				}).then(() => {
						// 删除参数接口
						this.$axios.delete(`categories/${this.cateId}/attributes/${row.attr_id}`).then(res=>{
							console.log(res.data);
							if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
							this.$message.success('删除成功')
							this.getStateList()
						})
				}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
				});
			},
			handleInputConfirm(row){ //tag标签 文本框失去焦点或按下enter件键都会触发
				if(row.inputValue.trim().length === 0){
					row.inputValue = ''
					row.inputVisible = false
					return
				}
				
				row.attr_vals.push(row.inputValue.trim())
				row.inputVisible = false
				row.inputValue = ''
				
				this.saveModiParams(row)
			},
			saveModiParams(row){
				//请求编辑提交参数接口
				this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
					attr_name:row.attr_name,
					attr_sel:row.attr_sel,
					attr_vals:row.attr_vals.join(' ')
				}).then(res=>{
					console.log(res.data);
					if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
					this.$message.success('修改参数项成功')
					this.getStateList()
				})
			},
			showInput(row){ //点击动态编辑按钮
				row.inputVisible = true
				
				// $nextTick 当页面重新渲染之后再调用回调函数中的代码
				// 文本框自动获取焦点
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			delClose(row,index){ //点击删除标签参数
				row.attr_vals.splice(index,1)
				
				this.saveModiParams(row)
				
			}
		}
	}
</script>

<style scoped="scoped">
	.el-breadcrumb{
		margin-bottom: 15px;
	}
	.params-cascader{
		margin: 15px 0;
	}
	.el-table{
		margin-top: 15px;
	}
	.el-tag{
		margin: 0 5px;
	}
	.input-new-tag{
		width: 100px;
	}
</style>
