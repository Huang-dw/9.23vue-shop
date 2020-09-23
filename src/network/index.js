import { request } from "./core";

import { METHOD,PATH } from "./config";

const netClient = {
	//登录验证接口
	getLogin(params) {
		return request(METHOD.POST, PATH.getLogin, params)
	},
	//左侧菜单权限
	getCnav(params) {
		return request(METHOD.GET, PATH.getCnav, params)
	},
	//用户数据列表
	getUser(params) {
		return request(METHOD.GET, PATH.getUser, params)
	},
	//修改用户状态
	getState(params) {
		return request(METHOD.PUT, PATH.getState, params)
	},
	//添加用户
	getaddUser(params) {
		return request(METHOD.POST, PATH.getaddUser, params)
	},
	//角色列表
	getRoles(params) {
		return request(METHOD.GET, PATH.getRoles, params)
	},
}

export default netClient;
