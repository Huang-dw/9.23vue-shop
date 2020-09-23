<template>
	<div>
		
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片 -->
		<el-card>
			
			<!-- 添加分类 -->
			<el-button style="margin-bottom: 15px;" @click="addClassify" type="primary">添加分类</el-button>
			
			<!-- 表格 -->
			<zk-table border :selection-type="false" :data="cateList" :columns="columns" show-index index-text="#" :expand-type="false">
				<template slot="likes" slot-scope="scope">
					<i v-if="!scope.row.cat_deleted" style="color: #2D8CF0;" class="el-icon-success"></i>
					<i v-else style="color: red;" class="el-icon-error"></i>
				</template>
				
				<!-- 排序 -->
				<template slot="sort" slot-scope="scope">
					<el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
					<el-tag v-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
					<el-tag v-if="scope.row.cat_level === 2" size="mini" type="warning">三级</el-tag>
				</template>
				
				<!-- 操作 -->
				<template slot="opt" slot-scope="scope">
					<el-button  type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
					<el-button  type="danger" size="mini" icon="el-icon-delete">删除</el-button>
				</template>
			</zk-table>
			
			<!-- 分页 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="this.pagenum"
			      :page-sizes="[2, 5, 10, 20,30]"
			      :page-size="this.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			</el-pagination>
				
		</el-card>
		
		<!-- 添加分类对话框 -->
		<el-dialog
			title="添加分类"
			width="50%"
			@close="addClassifyClose"
			:visible.sync="dialogCateList">
			
			<!-- 分类对话框内表单验证 -->
			<el-form :model="addCateName" :rules="addNameRules" ref="addNameRef" label-width="80px">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="addCateName.cat_name"></el-input>
				</el-form-item>
				
				<el-form-item label="父级分类">
					<!-- 级联选择器 -->
					<el-cascader
						clearable
						v-model="value"
						:options="fuClassify"
						:props="cascaderProp"
						@change="cacsaderChange">
					</el-cascader>
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogCateList = false">取 消</el-button>
				<el-button type="primary" @click="sureAddClassify">确 定</el-button>
			</span>
		</el-dialog>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				type:3,
				pagenum:1,
				pagesize:5, //当前每页显示的条数
				cateList:[], //分类数据类表数据
				total:0, //总数据条数
				dialogCateList:false, //添加分类对话框显示或隐藏
				fuClassify:[], //父级分类数据
				value:[], //选择级联后添加到数组中的id
				columns:[
					{
						label: '分类名称',
						prop: 'cat_name',
					},
					{
						label: '是否有效',
						type: 'template',
						template: 'likes',
					},
					{
						label: '排序',
						type: 'template',
						template: 'sort',
					},
					{
						label: '操作',
						type: 'template',
						template: 'opt',
					},
				],
				// 添加分类表单数据对象
				addCateName:{
					cat_name:'',
					cat_pid:0,
					cat_level:0
				},
				addNameRules: { // 添加分类表单验证规则对象
					cat_name: [
						{ required: true, message: '请输入分类名称', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
				},
				// 指定级联选择器的配置对象
				cascaderProp:{
					expandTrigger:'hover',
					value:'cat_id',
					label:'cat_name',
					children:'children',
					checkStrictly: true
				}
			}
		},
		created() {
			this.getCateList()
		},
		methods:{
			getCateList(){ //请求商品分类数据列表接口
				this.$axios.get('categories',{
					params:{
						type:this.type,
						pagenum:this.pagenum,
						pagesize:this.pagesize
					}
				}).then(res=>{
					console.log(res.data);
					this.cateList = res.data.data.result
					this.total = res.data.data.total
				})
			},
			handleSizeChange(newSize){ //当前每页条数改变时触发
				this.pagesize = newSize
				this.getCateList()
			},
			handleCurrentChange(newPagenum){ //当前页数改变时触发
				this.pagenum = newPagenum
				this.getCateList()
			},
			addClassify(){ //点击添加分类按钮
				// 获取父级分类的数据
				this.$axios.get('categories',{params:{type:2}}).then(res=>{
					console.log(res.data);
					this.fuClassify = res.data.data
				})
				
				this.dialogCateList = true
			},
			cacsaderChange(){ //级联选择器发生变化时触发
				// console.log(this.value);
				//如果 value 数组中的 length 大于0，证明选中的父级分类，反之就没有选中任何父级分类
				if(this.value.length > 0){
					//父分类的id
					this.addCateName.cat_pid = this.value[this.value.length-1]
					//为当前分类的等级赋值
					this.addCateName.cat_level = this.value.length
				}else{
					//父级分类的id
					this.addCateName.cat_pid = 0
					//为当前分类的等级赋值
					this.addCateName.cat_level = 0
				}
			},
			addClassifyClose(){ //关闭添加分类对话框后重置表单
				this.$refs.addNameRef.resetFields()
				this.value = []
				//父级分类的id
				this.addCateName.cat_pid = 0
				//为当前分类的等级赋值
				this.addCateName.cat_level = 0
			},
			sureAddClassify(){ //点击表单内确定按钮
				this.$refs.addNameRef.validate(valid=>{
					if(!valid) return
					this.$axios.post('categories',this.addCateName).then(res=>{
						console.log(res.data);
						if(res.data.meta.status !=201) return this.$message.error(res.data.meta.msg)
						this.$message.success('添加分类成功')
						this.getCateList()
						this.dialogCateList = false
					})
				})
			}
		}
	}
</script>

<style>
	.el-breadcrumb{
		margin-bottom: 15px;
	}
	
	.el-pagination{
		margin-top: 15px;
	}
	.el-cascader{
		width: 100%;
	}
</style>
