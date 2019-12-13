/*
 *	userType 1：management管理员		2：business商业	3：customer顾客
 *	A：普通用户 or 员工 
 *	B：企业管理员
 * */

var api = {
	"formal": {
		"wsUrl": "ws://socket.wsshanghai.com:12345", //服务器地址 
		"ajUrl": "http://socket.wsshanghai.com", //服务器地址 开关
		"ajUrlb": "https://socketb.wsshanghai.com", //服务器地址 开关
		"apiUrl": "http://api-head.wsshanghai.com",
		"appName": "年会"
	},
	"dev": {
		"wsUrl": "ws://socket.wsshanghai.com:12345", //服务器地址
		"ajUrl": "http://socket.wsshanghai.com", //服务器地址 开关
		"ajUrlb": "https://socketb.wsshanghai.com", //服务器地址 开关 https的话用socketb
		"apiUrl": "http://api-head.wsshanghai.com",
		"appName": "年会"
	}
}
var lks = "dev";
export default {
	Interface: {
		"site": lks,
		"wsUrl": api[lks]["wsUrl"],
		"ajUrl": api[lks]["ajUrl"],
		"ajUrlb": api[lks]["ajUrlb"],
		"appName": api[lks]["appName"],
		"apiUrl": api[lks]["apiUrl"],
		"addr": {
			"activityCheck": '/activityCheck.htm',
			"activityStart": '/activityStart.htm',
			"activityStop": '/activityStop.htm',

			"SiteInfomation": "/v5/SiteInfomation-add.htm"//数据接口->apiUrl
		}
	}
}
