<template>
	<div>

		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片 -->
		<el-card>

			<el-alert :closable="false" title="添加商品信息" type="info" center show-icon></el-alert>

			<!-- 步骤条 -->
			<el-steps align-center :space="200" :active="activeIndex - 0" finish-status="success">
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>

			<!-- 表单验证 -->
			<el-form :model="addGoodsForm" :rules="addgoodsRules" ref="addGoodsRef" label-position="top" label-width="80px">

				<!-- 标签页 -->
				<el-tabs @tab-click="onTabClick" v-model="activeIndex" :before-leave="onBeforeLeave" tab-position="left">
					
					<el-tab-pane name="0" label="基本信息">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addGoodsForm.goods_name"></el-input>
						</el-form-item>
						
						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addGoodsForm.goods_price"></el-input>
						</el-form-item>
						
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addGoodsForm.goods_weight"></el-input>
						</el-form-item>
						
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
						</el-form-item>
						
						<el-form-item label="商品分类" prop="goods_cat">
							<!-- 级联选择器 -->
							<el-cascader
								v-model="addGoodsForm.goods_cat"
								:options="goodsClassify"
								:props="propsValue"
								@change="handleChange">
							</el-cascader>
						</el-form-item>
					</el-tab-pane>
					
					<el-tab-pane name="1" label="商品参数">
						<el-form-item v-for="item in manyTabsList" :key="item.attr_id" :label="item.attr_name">
							
							<!-- 复选框组 -->
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox border v-for="(item2,index2) in item.attr_vals" :key="index2" :label="item2"></el-checkbox>
							</el-checkbox-group>
							
						</el-form-item>
					</el-tab-pane>
					
					<el-tab-pane name="2" label="商品属性">
						<el-form-item v-for="item in onlyTabsList" :key="item.attr_id" :label="item.attr_name">
							
							<el-input v-model="item.attr_vals"></el-input>
							
						</el-form-item>
					</el-tab-pane>
					
					<el-tab-pane name="3" label="商品图片">
						
						<!-- 图片上传 action表示要上传到后台api的地址 -->
						<el-upload
						  :action="uploadURL"
						  :on-preview="handlePreview"
						  :on-remove="handleRemove"
						  list-type="picture"
						  :headers="headerObj"
						  :on-success="handleSuccess">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
						
					</el-tab-pane>
					
					<el-tab-pane name="4" label="商品内容">
						
						<!-- 富文本编辑器 -->
						<quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
						
						<el-button @click="addSaveGoods" class="goods-quill" type="primary">添加商品</el-button>
						
					</el-tab-pane>
				</el-tabs>
			</el-form>
			
		</el-card>
		
		<!-- 图片预览对话框 -->
		<el-dialog
		  title="图片预览"
		  :visible.sync="dialogPreview"
		  width="50%">
			<img :src="previewPath" width="100%">
		</el-dialog>

	</div>
</template>

<script>
	import _ from 'lodash'
	export default {
		data() {
			return {
				activeIndex: '0', //步骤条默认激活选中
				goodsClassify:[], //商品分类数据
				manyTabsList:[],//商品动态参数数据
				onlyTabsList:[],//商品静态属性数据
				uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
				headerObj:{ //设置上传的请求头部
					Authorization:window.sessionStorage.getItem('token')
				},
				previewPath:'',//保存图片路径
				dialogPreview:false,//控制图片预览对话框显示或隐藏
				// 级联选择框数据对象
				propsValue:{
					expandTrigger: 'hover',
					label:'cat_name',
					value:'cat_id',
					children:'children'
				},
				// 表单数据对象
				addGoodsForm: {
					goods_name:'',
					goods_price:0,
					goods_weight:0,
					goods_number:0,
					goods_cat:[],// 商品所属的分类数组
					pics:[],//添加的图片数据
					goods_introduce:'',//商品详情介绍
					attrs:[]
				},
				// 表单验证规则
				addgoodsRules: {
					goods_name: [
						{ required: true, message: '请输入商品名称', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
					],
					goods_price: [
						{ required: true, message: '请输入商品价格', trigger: 'blur' },
						{ min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
					],
					goods_weight: [
						{ required: true, message: '请输入商品重量', trigger: 'blur' },
						{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
					],
					goods_number: [
						{ required: true, message: '请输入商品数量', trigger: 'blur' },
						{ min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
					],
					goods_cat: [
						{ required: true, message: '请选择商品分类', trigger: 'blur' }
					],
				}
			}
		},
		created() {
			this.getGoodsClassify()
		},
		computed:{ 
			//三级分类id
			classifyId(){
				if(this.addGoodsForm.goods_cat.length === 3){
					return this.addGoodsForm.goods_cat[2]
				}
				return null
			}
		},
		methods: {
			getGoodsClassify(){ //请求商品分类接口
				this.$axios.get('categories').then(res=>{
					// console.log(res.data);
					this.goodsClassify = res.data.data
				})
			},
			handleChange(){ //级联选择器发生变化时触发
				console.log(this.addGoodsForm.goods_cat);
				if(this.addGoodsForm.goods_cat.length != 3){
					this.addGoodsForm.goods_cat = []
				}
			},
			onBeforeLeave(activeName,oldActiveName){ //切换标签时触发，返回两个参数
				// console.log('进入的标签页'+activeName,'离开的标签页'+oldActiveName);
				if(oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3){
					this.$message.warning('请选择商品分类')
					return false
				}
			},
			onTabClick(){ //tab 被选中时触发
				if(this.activeIndex === '1'){
					// 请求参数列表接口
					this.$axios.get(`categories/${this.classifyId}/attributes`,{
						params:{
							sel:'many'
						}
					}).then(res=>{
						console.log(res.data);
						res.data.data.forEach(item=>{
							item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
						})
						this.manyTabsList = res.data.data
					})
				}else if(this.activeIndex === '2'){
					// 请求参数列表接口
					this.$axios.get(`categories/${this.classifyId}/attributes`,{
						params:{
							sel:'only'
						}
					}).then(res=>{
						console.log(res.data);
						this.onlyTabsList = res.data.data
					})
				}
			},
			handlePreview(file){ //点击图片文字进行图片预览
				console.log(file);
				this.previewPath = file.response.data.url
				this.dialogPreview = true
			},
			handleRemove(file){ //点击移除图片
				console.log(file);
				// 1.获取到要删除的图片的临时路径
				const filePath = file.response.data.tmp_path
				// 2.从pics数组中，找到这个图片对应的索引值
				const index = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
				// 3.调用数组的splice方法，把图片信息对象从pics数组中移除
				this.addGoodsForm.pics.splice(index,1)
				console.log(this.addGoodsForm.pics);
			},
			handleSuccess(response){ //文件上传成功时的钩子
				// console.log(response);
				// 1.拼接得到一个图片信息对象
				const picInfo = {pic:response.data.tmp_path}
				// 2.将图片信息对象添加到pics数组中
				this.addGoodsForm.pics.push(picInfo)
				console.log(this.addGoodsForm.pics);
			},
			addSaveGoods(){ //添加商品
				this.$refs.addGoodsRef.validate(valid=>{
					if(!valid) return this.$message.error('请填写必要的表单项')
					
					// 深拷贝复制一份addGoodsForm
					const goodsForm = _.cloneDeep(this.addGoodsForm)
					goodsForm.goods_cat = goodsForm.goods_cat.join(',')
					
					// 处理动态参数
					this.manyTabsList.forEach(item=>{
						const manyData = {
							attr_id:item.attr_id,
							attr_value:item.attr_vals.join(' ')
						}
						this.addGoodsForm.attrs.push(manyData)
					})
					
					// 处理静态属性
					this.onlyTabsList.forEach(item=>{
						const onlyData = {
							attr_id:item.attr_id,
							attr_value:item.attr_vals
						}
						this.addGoodsForm.attrs.push(onlyData)
					})
					
					goodsForm.attrs = this.addGoodsForm.attrs
					console.log(goodsForm);
					
					// 请求添加商品接口
					this.$axios.post('goods',goodsForm).then(res=>{
						console.log(res.data);
						if(res.data.meta.status != 201) return this.$message.error(res.data.meta.msg)
						this.$message.success('添加商品成功')
						this.$router.push('/goods')
					})
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.el-breadcrumb {
		margin-bottom: 15px;
	}

	.el-steps {
		margin: 15px 0;
	}
	
	.el-checkbox{
		margin: 0 5px 0 0 !important;
	}
	
	.goods-quill{
		margin-top: 15px;
	}
</style>
