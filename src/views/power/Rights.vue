<template>
	<div>
		
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片 -->
		<el-card>
			
			<!-- 表格 -->
			<el-table border stripe :data="rightList">
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="authName"  label="权限名称"></el-table-column>
				<el-table-column prop="path" label="路径"></el-table-column>
				<el-table-column prop="level" label="权限等级">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.level == '0'">一级</el-tag>
						<el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
						<el-tag v-else type="warning">三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
			
		</el-card>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				rightList:[]
			}
		},
		created() {
			this.rightsList()
		},
		methods:{
			rightsList(){
				this.$axios.get('rights/list').then(res=>{
					console.log(res);
					this.rightList = res.data.data
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.el-breadcrumb {
		margin-bottom: 15px;
		font-size: 14px;
	}
</style>
