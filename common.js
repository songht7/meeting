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
		"apiUrl": "http://api-head.wsshanghai.com",//数据接口->apiUrl
		"appName": "年会",
		"cosConfig": { //`https://plbs-test-1257286922.cos.ap-shanghai.myqcloud.com/...`
			"Bucket": 'plbs-test-1257286922',
			"Region": 'ap-shanghai',
			"SecretId": '',
			"SecretKey": ''
		},
	},
	"dev": {
		"wsUrl": "ws://socket.wsshanghai.com:12345", //服务器地址
		"ajUrl": "http://socket.wsshanghai.com", //服务器地址 开关
		"ajUrlb": "https://socketb.wsshanghai.com", //服务器地址 开关 https的话用socketb
		"apiUrl": "http://api-head.wsshanghai.com",//数据接口->apiUrl
		"appName": "年会",
		"cosConfig": { //`http://plbs-test-1257286922.cos.ap-shanghai.myqcloud.com/...`
			"Bucket": 'plbs-test-1257286922',
			"Region": 'ap-shanghai',
			"SecretId": 'AKIDXt0yjgKr41jBMK7YrunRpztscbJe4W2J',
			"SKey": 'RUJzSjJXbW5iZ1c2WDNLTDVacXJjOWo0OUc4b05na2s='
		},
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
		"cosConfig": api[lks]["cosConfig"],
		"addr": {
			"activityCheck": '/activityCheck.htm',
			"activityStart": '/activityStart.htm',
			"activityStop": '/activityStop.htm',

			"SiteInfomation": "/v5/SiteInfomation-add.htm",//寄语 数据接口->apiUrl name value
			"SiteSign": "/v5/Sign-add.htm"//签到 数据接口->apiUrl
		}
	}
}
