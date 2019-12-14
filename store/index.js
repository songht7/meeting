import Vue from 'vue'
import Vuex from 'vuex'
import common from "../common.js"
Vue.use(Vuex)
const wx = require('jweixin-module')

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
		socketOpen: false,
		socketErr: ""
	},
	mutations: {
		setSystemInfo(state, data) {
			state.systemInfo = data
		}
	},
	actions: {
		getData(ctx, parm) {
			let _parm = parm.parm || '';
			let intUrl = parm.intUrl || 'ajUrlb';
			let _url = ctx.state.interface[intUrl] + ctx.state.interface.addr[parm.inter] + _parm
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
					ctx.state.socketErr = "同步连接异常，请刷新页面...";
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
			uni.onSocketError(function(res) {
				ctx.state.socketErr = "同步连接异常，请刷新页面...";
				console.log('WebSocket连接打开失败，请检查！');
			});
			uni.onSocketMessage(function(res) {
				console.log('收到服务器内容：' + res);
				if (parm.fun) {
					new parm.fun(res)
				}
			});
		},
		sendSocketMessage(ctx, parm) {
			uni.onSocketError(function(res) {
				ctx.state.socketErr = "同步连接异常，请刷新页面...";
				console.log('WebSocket连接打开失败，请检查！');
			});
			if (ctx.state.socketOpen) {
				var res = {
					"result": "",
					"type": "socket"
				}
				uni.sendSocketMessage({
					data: parm.msg,
					success() {
						res["result"] = 1;
					},
					fail() {
						res["result"] = 0;
					},
					complete() {
						if (parm.fun) {
							new parm.fun(res)
						}
					}
				});
			} else {
				ctx.state.socketErr = "同步连接异常，请刷新页面...";
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
		wxShare(ctx, parm) {
			var that = this;
			var share_url = parm.share_url,
				title = parm.title,
				imgUrl = parm.imgUrl,
				dec = parm.dec;
			//console.log(share_url, title, dec)
			var funTicket = function(res) {
				// 			console.log("=======getTicket======")
				// 			console.log(res)
				uni.setStorage({
					key: 'wx_ticket',
					data: {
						"access_token": res.access_token,
						"jsapi_ticket": res.ticket,
						"noncestr": res.noncestr,
						"signature": res.signature,
						"expires_in": res.expires_in
					},
					success: function() {}
				});
				var _config = {
					debug: false,
					appId: Interface.wx.appid,
					timestamp: res.timestamp,
					nonceStr: res.noncestr,
					signature: res.signature,
					jsApiList: [
						'updateAppMessageShareData',
						'updateTimelineShareData',
						'onMenuShareAppMessage',
						'onMenuShareTimeline',
						'onMenuShareQQ'
					]
				}
				wx.config(_config);
			}
			var getTicketUrl = location.origin + "/#/";
			if (that.isIOS()) {
				getTicketUrl = location.origin + "/";
			}
			let url_ticket = Interface.apiurl + Interface.addr.getJsApiTicket + "?url=" + getTicketUrl;
			let _head = {};
			let channel_code = that.queryString("channel_code");
			if (channel_code) {
				_head = {
					"channel_code": channel_code
				};
			}
			let wx_ticket = that.getData(url_ticket, funTicket, "GET", "", _head)

			var storFun = function(res) {
				if (res == "") {}
			}
			//that.getMyStorage("wx_ticket", "", storFun);


			let _href = location.origin + "/" + location.hash;
			// 		console.log("======share_url=====")
			// 		console.log(_href)
			_href = "http://main.meetji.com:3001?wxr=" + encodeURIComponent(_href)
			var share_url = share_url ? share_url : _href;
			imgUrl = imgUrl ? imgUrl : Interface.domain + "/static/share.jpg";
			var wxSet = {
				title: title || "英语免费试听",
				desc: dec || "英语免费试听课，在这里找到你想要的",
				link: share_url,
				imgUrl: imgUrl,
				success: function() {
					let fun = function(storageRes) {
						let openid = storageRes.openid ? storageRes.openid : "";
						let test_openid = Interface.wx.test_openid;
						let _head = {
							"openid": openid || test_openid
						};
						console.log("-----share succ----")
						console.log(_head)
						let funSave = function(res) {
							if (res.point) {
								uni.getStorage({
									key: 'uWXInfo',
									success: function(ress) {
										let _uWXInfo = ress.data;
										_uWXInfo["point"] = res.point;
										uni.setStorage({
											key: 'uWXInfo',
											data: _uWXInfo,
											success: function() {}
										})
									},
								})
							}
						}
						let url_savePoint = Interface.apiurl + Interface.addr.savePoint;
						/*分享获得积分*/
						let _savePoint = that.getData(url_savePoint, funSave, "POST", "", _head);
					}
					that.getMyStorage("uWXInfo", "", fun)
				}
			};
			wx.ready(function() {
				//wx.updateAppMessageShareData(wxSet);
				//wx.updateTimelineShareData(wxSet);
				// 2. 分享接口
				// 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
				wx.onMenuShareAppMessage(wxSet);
				// 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
				wx.onMenuShareTimeline(wxSet);
				// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
				wx.onMenuShareQQ(wxSet);
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
