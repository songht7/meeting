$.post({});
wx.config({
	debug: false,
	appId: 'wx11eb371cd85adfd4',
	timestamp: 1422605955,
	nonceStr: 'Ashermed',
	signature: 'eq2e2',
	jsApiList: [
		'onMenuShareTimeline',
		'onMenuShareAppMessage',
		'onMenuShareQQ',
		'onMenuShareWeibo'
	]
});
wx.ready(function() {
	// 2. 分享接口
	// 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
	wx.onMenuShareAppMessage({
		title: "title",
		desc: "desc",
		link: "linklink",
		imgUrl: "imgUrl",
		trigger: function(res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回

		},
		success: function(res) {},
		cancel: function(res) {

		},
		fail: function(res) {
			//alert(JSON.stringify(res));
		}
	});
// 	// 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
// 	wx.onMenuShareTimeline({
// 		title: title,
// 		desc: dec,
// 		link: share_url,
// 		imgUrl: imgUrl,
// 		trigger: function(res) {
// 			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
// 		},
// 		success: function(res) {},
// 		cancel: function(res) {},
// 		fail: function(res) {
// 			//alert(JSON.stringify(res));
// 		}
// 	});
// 	// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
// 	wx.onMenuShareQQ({
// 		title: title,
// 		desc: dec,
// 		link: share_url,
// 		imgUrl: imgUrl,
// 		trigger: function(res) {
// 			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
// 		},
// 		success: function(res) {},
// 		cancel: function(res) {},
// 		fail: function(res) {
// 			//alert(JSON.stringify(res));
// 		}
// 	});
// 	// 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
// 	wx.onMenuShareWeibo({
// 		title: title,
// 		desc: dec,
// 		link: share_url,
// 		imgUrl: imgUrl,
// 		trigger: function(res) {
// 			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
// 		},
// 		success: function(res) {},
// 		cancel: function(res) {},
// 		fail: function(res) {
// 			//alert(JSON.stringify(res));
// 		}
// 	});

});
