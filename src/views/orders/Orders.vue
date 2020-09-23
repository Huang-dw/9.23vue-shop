<template>
	<div>

		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片 -->
		<el-card>

			<!-- 搜索 -->
			<el-input style="width: 30%;margin-bottom: 15px;" clearable placeholder="请输入内容">
				<el-button slot="append" icon="el-icon-search"></el-button>
			</el-input>

			<!-- 表格 -->
			<el-table border stripe :data="ordersList">
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="order_id" label="订单编号"></el-table-column>
				<el-table-column prop="order_price" label="订单价格"></el-table-column>

				<el-table-column prop="pay_status" label="是否付款">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.pay_status==1" type="success">已付款</el-tag>
						<el-tag v-else type="danger">未付款</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="is_send" label="是否发货"></el-table-column>

				<el-table-column width="160px" prop="create_time" label="下单时间">
					<template slot-scope="scope">
						{{scope.row.create_time | filterTime}}
					</template>
				</el-table-column>

				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button @click="onModi" type="primary" size="mini" icon="el-icon-edit"></el-button>
						<el-button @click="onLogistics" type="success" size="mini" icon="el-icon-location-outline"></el-button>
					</template>
				</el-table-column>

			</el-table>

			<!-- 分页 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="ordersParams.pagenum"
			 :page-sizes="[2, 5, 10, 15,20]" :page-size="ordersParams.pagesize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			</el-pagination>

		</el-card>

		<!-- 修改地址对话框 -->
		<el-dialog width="50%" title="修改地址" @close="modiClose" :visible.sync="dialogModi">

			<!-- 修改地址内表单对话框 -->
			<el-form :model="ModiForm" :rules="modiRules" ref="modiRef" label-width="90px">
				<el-form-item label="省市区/县" prop="address1">
					<!-- 级联选择器 -->
					<el-cascader style="width: 100%;" v-model="ModiForm.address1" :options="cityData" :props="{ expandTrigger: 'hover' }">
					</el-cascader>
				</el-form-item>

				<el-form-item label="详细地址" prop="address2">
					<el-input v-model="ModiForm.address2"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogModi = false">取 消</el-button>
				<el-button type="primary" @click="dialogModi = false">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 物流进度对话框 -->
		<el-dialog width="50%" title="物流进度" :visible.sync="islogModi">
			
			<!-- 时间线 -->
			<el-timeline>
				<el-timeline-item v-for="(activity, index) in logisticsData" :key="index" :timestamp="activity.time">
					{{activity.context}}
				</el-timeline-item>
			</el-timeline>

		</el-dialog>

	</div>
</template>

<script>
	import cityData from './citydata.js'
	export default {
		data() {
			return {
				// 订单数据列表参数
				ordersParams: {
					query: '',
					pagenum: 1,
					pagesize: 10
				},
				ordersList: [], //订单数据列表数据
				total: 0, //订单数据列表总条数
				dialogModi: false, //控制修改地址对话框显示或隐藏
				islogModi: false, //控制物流进度对话框显示或隐藏
				logisticsData: [], //物流进度数据
				ModiForm: {
					address1: [],
					address2: ''
				},
				modiRules: {
					address1: [{
						required: true,
						message: '请选择省市区/县',
						trigger: 'blur'
					}],
					address2: [{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur'
					}],
				},
				cityData,
			}
		},
		created() {
			this.getOrdersList()
		},
		methods: {
			getOrdersList() { //请求订单数据列表
				this.$axios.get('orders', {
					params: this.ordersParams
				}).then(res => {
					console.log(res.data);
					this.ordersList = res.data.data.goods
					this.total = res.data.data.total
				})
			},
			handleSizeChange(pageSize) { //pageSize 改变时会触发
				// console.log(pageSize);
				this.ordersParams.pagesize = pageSize
				this.getOrdersList()
			},
			handleCurrentChange(currentPage) { //currentPage 改变时会触发
				// console.log(currentPage);
				this.ordersParams.pagenum = currentPage
				this.getOrdersList()
			},
			onModi() { //点击修改按钮
				this.dialogModi = true
			},
			modiClose() { //关闭对话框重置表单
				this.$refs.modiRef.resetFields()
			},
			onLogistics() { //点击物流按钮

				// 查看物流信息接口
				this.$axios.get('/kuaidi/1106975712662').then(res => {
					console.log(res.data);
					this.logisticsData = res.data.data
				})

				this.islogModi = true
			}
		}
	}
</script>

<style>
	.el-breadcrumb {
		margin-bottom: 15px;
	}

	.el-pagination {
		margin-top: 15px;
	}
</style>
