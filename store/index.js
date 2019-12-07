import Vue from 'vue'
import Vuex from 'vuex'
import common from "../common.js"
Vue.use(Vuex)


/*
 *	dispatch.actions
 * 	commit.mutations
 * */
const store = new Vuex.Store({
	state: {
		loading: "0",
		user: {},
		data: {},
		interface: common.Interface,
		systemInfo: {},
		socketOpen: false
	},
	mutations: {
		setSystemInfo(state, data) {
			state.systemInfo = data
		}
	},
	actions: {
		getData(ctx, parm) {
			let _parm = parm.parm || '';
			let _url = ctx.state.interface.ajUrl + ctx.state.interface.addr[parm.inter] + _parm
			console.log("getData-url-", parm.inter, "：", _url)
			console.log("getData-parm-", parm.inter, "：", parm)
			var result = [];
			uni.request({
				url: _url,
				data: parm.data || {},
				method: parm.method || "GET",
				header: parm.header || {},
				success(res) {
					console.log("getData-success-", parm.inter, "：", res)
					//console.log(res)
					if (res.success) {
						//ctx.commit("update_data", res.data.data)
					}
					result = res.data
				},
				fail(err) {
					console.log("getData-err-", parm.inter, "：", err)
					result = {
						"success": false,
						"msg": "接口请求失败",
						"err": err
					}
				},
				complete() {
					if (parm.fun) {
						new parm.fun(result)
					}
				}
			})
		},
		connectSocket(ctx) {
			let _url = ctx.state.interface.wsUrl;
			console.log("connectSocket-url：", _url)
			var result = [];
			uni.connectSocket({
				url: _url,
				data() {
					return {};
				},
				header: {
					'content-type': 'application/json'
				},
				method: 'GET',
				success(res) {
					console.log("connectSocket-success：", res)
					result = res;
					ctx.state.socketOpen = true;
				},
				fail(err) {
					console.log("connectSocket-fail：", err)
					result = {
						"success": false,
						"msg": "connectSocket-fail",
						"err": err
					}
				}
			});
		},
		onSocketMessage(ctx, parm) {
			console.log(parm)
			uni.onSocketMessage(function(res) {
				console.log('收到服务器内容：' + res);
				if (parm.fun) {
					new parm.fun(res)
				}
			});
		},
		sendSocketMessage(ctx, parm) {
			if (ctx.state.socketOpen) {
				if (parm.fun) {
					new parm.fun()
				}
				uni.sendSocketMessage({
					data: parm.msg
				});
			} else {
				console.log("服务器链接异常")
			}
		},
		closeSocket(ctx) {
			uni.closeSocket({
				code: 1000,
				reason: "关闭",
				success(res) {
					console.log("closeSocket-success:", res)
				},
				fail(err) {
					console.log("closeSocket-fail:", err)
				}
			});
		},
		getSystemInfo(ctx) {
			var systemInfo = {}
			uni.getSystemInfo({
				success(res) {
					systemInfo = res
					console.log(systemInfo);
				},
				complete() {
					ctx.commit("setSystemInfo", systemInfo)
				}
			});
		}
	},
	modules: {}
})
export default store
