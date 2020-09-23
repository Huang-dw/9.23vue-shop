<template>
	<div>
		
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片 -->
		<el-card>
			
			<!-- 搜索 -->
			<el-row :gutter="20" class="goods-row">
				<el-col :span="10">
					<el-input @clear="clearSearch" v-model="goodsParams.query" clearable placeholder="请输入内容">
						<el-button @click="onSearch" slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
			
				<el-col :span="4">
					<el-button @click="toAddGoods" type="primary">添加商品</el-button>
				</el-col>
			</el-row>
			
			<!-- 表格 -->
			<el-table border stripe :data="goodsList">
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="goods_name"  label="商品名称"></el-table-column>
				<el-table-column width="120px" prop="goods_price" label="商品价格(元)"></el-table-column>
				<el-table-column width="120px" prop="goods_weight" label="商品重量"></el-table-column>
				<el-table-column width="160px" prop="add_time" label="创建时间">
					<template slot-scope="scope">
						{{scope.row.add_time | filterTime}}
					</template>
				</el-table-column>
				
				<el-table-column width="130px" label="操作">
					<template slot-scope="scope">
						<el-button  type="primary" size="mini" icon="el-icon-edit"></el-button>
						<el-button @click="delGoods(scope.row)" type="danger" size="mini" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!-- 分页 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage4"
			      :page-sizes="[2, 5, 10, 15,20]"
			      :page-size="goodsParams.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total" background>
			</el-pagination>
			
		</el-card>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				// 商品列表参数
				goodsParams:{
					query:'',
					pagenum:1,
					pagesize:10
				},
				goodsList:[], //商品列表数据
				total:0, //商品数据总条数
				currentPage4:1, //默认选中的页数
			}
		},
		created() {
			this.getGoodsList()
		},
		methods:{
			// 请求商品列表数据接口
			getGoodsList(){
				this.$axios.get('goods',{
					params:this.goodsParams
				}).then(res=>{
					console.log(res.data);
					this.goodsList = res.data.data.goods
					this.total = res.data.data.total
				})
			},
			handleSizeChange(pageSize){ //pageSize 改变时会触发
				// console.log(pageSize);
				this.goodsParams.pagesize = pageSize
				this.getGoodsList()
			},
			handleCurrentChange(pageNum){ //currentPage 改变时会触发
				// console.log(pageNum);
				this.goodsParams.pagenum = pageNum
				this.getGoodsList()
			},
			onSearch(){ //点击搜索按钮
				this.getGoodsList()
			},
			clearSearch(){ //点击清空图标显示所有数据
				this.getGoodsList()
			},
			delGoods(row){ //点击按钮删除商品
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.delete(`goods/${row.goods_id}`).then(res=>{
						// console.log(res.data);
						if(res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
						this.$message.success('删除商品成功')
						this.getGoodsList()
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			toAddGoods(){ //点击添加用户按钮跳转到添加用户页面
				this.$router.push('/goods/addgoods')
			}
		}
	}
</script>

<style>
	.el-breadcrumb{
		margin-bottom: 15px;
	}
	.goods-row{
		margin-bottom: 15px;
	}
	.el-pagination{
		margin-top: 15px;
	}
</style>
