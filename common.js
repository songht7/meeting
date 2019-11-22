/*
 *	userType 1：management管理员		2：business商业	3：customer顾客
 *	A：普通用户 or 员工 
 *	B：企业管理员
 * */

var api = {
	"formal": {
		"wsUrl": "ws://socket.wsshanghai.com:12345", //服务器地址 
		"ajUrl": "//socket.wsshanghai.com", //服务器地址 开关
		"appName": "年会"
	},
	"dev": {
		"wsUrl": "ws://socket.wsshanghai.com:12345", //服务器地址
		"ajUrl": "//socket.wsshanghai.com", //服务器地址 开关
		"appName": "年会"
	}
}
var lks = "dev";
export default {
	Interface: {
		"site": lks,
		"wsUrl": api[lks]["wsUrl"],
		"ajUrl": api[lks]["ajUrl"],
		"appName": api[lks]["appName"],
		"addr": {}
	}
}
