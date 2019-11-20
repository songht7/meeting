/*
 *	userType 1：management管理员		2：business商业	3：customer顾客
 *	A：普通用户 or 员工 
 *	B：企业管理员
 * */

var api = {
	"formal": {
		"interface": "https://api.bdmartech.com", //接口
		"domain": "http://m.bdmartech.com",
		"appName": "年会"
	},
	"dev": {
		"interface": "https://api-test.wsshanghai.com", //接口
		"domain": "http://train.wsshanghai.com",
		"appName": "年会"
	}
}
var lks = "wuxi";
export default {
	Interface: {
		"site": lks,
		"apiurl": api[lks]["interface"], //space111111
		"domain": api[lks]["domain"]
		"addr": {
			"slideShow": "/v2/ApiHome-slideShow.htm", //首页列表
			"checkSystem": "/v4/ApiBase-checkSystem.htm", //检测机遇是否开启
		}
	}
}
