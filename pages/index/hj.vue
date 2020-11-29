<template>
	<view class="user-box" :class="signType=='assist'?'bg2':''">
		<!-- :style="{'height':screenHeight+'px'}" -->
		<view class="sign-main">
			<view class="send-box">
				<!-- <view class="typeBtn socketErr" v-if="$store.state.socketErr" @click="$store.dispatch('connectSocket')">{{$store.state.socketErr}}</view> -->
				<!-- <img src="../../static/logo.png" id="Logo" alt=""> -->
				<block v-if="signType=='sign'">
					<view class="sigin-form">
						<image class="water" :class="paused == 'running'?'water-anim':''" :style="{'animation-play-state':paused}" src="../../static/water.png"
						 mode="aspectFit"></image>
						<view class="sigin-block" :style="{'padding-top':siginBlockTop+'%'}">
							<block v-if="siginSucc">
								<view class="sigin-info sigin-info-succ" :style="{'animation-play-state':paused}">
									<text>欢迎您参加</text><br />
									<text>恒洁2021年度经销商大会</text>
								</view>
							</block>
							<block v-else>
								<view class="sign-ipt">
									<view class="sigin-info">
										输入您的姓名
									</view>
									<input class="sign" type="text" @blur="pageRestore" v-model="name" />
									<view class="sendMsg" @click="sendSocketMessage('')">
										点击签到
									</view>
								</view>
							</block>
						</view>
					</view>
				</block>
				<block v-if="signType=='assist'">
					<block v-if="shakeSwitchState">
						<view class="open-box">
							<block v-if="!boxIsOpen">
								<image class="box" @click="openBox" src="../../static/2021/box.png" mode=""></image>
							</block>
							<block v-else>
								<view class="box-opend">
									<web-view :webview-styles="webviewStyles" src="http://box.bdmartech.com"></web-view>
								</view>
							</block>
						</view>
					</block>
					<block v-else>
						<img src="../../static/commingsoon.png" id="AssistComming" alt="">
					</block>
				</block>
				<block v-if="signType=='danmu'">
					<view class="danmu-box">
						<view class="active-main">
							<view class="recorder-box">
								<!-- <audio style="text-align: left" :src="blob" controls></audio> -->
								<block v-if="blessingState!='on'">
									<view class="recorder-row block-40 row-column">
										<input class="recorder-input" type="text" v-model="name" placeholder="输入您的姓名" placeholder-class="placeholder-style" />
										<view class="line"></view>
									</view>
									<view :class="['sign-box','rec-box',isRecording?'rec-clicked':'']">
										<view class="sign-status">
											<view class="mark" @click="recorderPlay" @longpress="startRecording" @touchend="stopRecording"></view>
											<image :class="['sign-bg2']" src="/static/2021/mac2.png" mode="aspectFit"></image>
											<!-- <image :class="['sign-loading',isRecording?'animate__rotate':'']" src="/static/2021/rotate.png" mode="aspectFit"></image>
											<image class="sign-bg" src="/static/2021/mac-bg.png" mode="aspectFit"></image>
											<view class="sing-label">
												<image class="sign-db" :src="`/static/2021/db${dbType}.png`" mode="aspectFit"></image>
												<image class="sign-mac" src="/static/2021/mac.png" mode="aspectFit"></image>
											</view> -->
										</view>
									</view>
									<!-- <view class="recorder-info">
										{{Recordingbtn}}
									</view> -->
									<sunui-upimg-tencent :upImgConfig="upImgCos" @onUpImg="upCosData" @onImgDel="delImgInfo" ref="uImage"></sunui-upimg-tencent>
									<!-- <button type="primary" @tap="uAudioTap">发送</button> -->

								</block>
								<view class="recorder-row">
									<block v-if="blessingState!='on'">
										<view style="color:#fff;">
											{{brow}} - {{System}}
										</view>
										<view class="form-btn" @click="sendSocketMessage('blessing')">
											<image class="sign-btn" src="/static/2021/submit-btn.png" mode="aspectFit"></image>
											<view class="txts">
												点击发送
											</view>
										</view>
									</block>
									<block v-else>
										<view class="form-btn">
											<image class="sign-btn" src="/static/2021/success.png" mode="aspectFit"></image>
											<view class="txts">
												发送成功
											</view>
										</view>
										<!-- <view class="blessingOn">
											已收到您的祝福
										</view> -->
									</block>
								</view>
								<!-- 	<block v-if="0">
										<view class="recorder-btn" @click="recorderPlay">
											播放
										</view>
										<view class="recorder-row">
											<view class="form-btn" @click="sendSocketMessage('blessing')">
												发送
											</view>
										</view>
										<view class="recorder-btn" @click="recorderDestroy">
											取消
										</view>
										<view class="recorder-btn" @click="download">
											下载
										</view>
									</block> -->
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import TcVod from 'vod-js-sdk-v6'
	let tcVod = "";

	import Shake from 'shake.js'
	import Recorder from 'js-audio-recorder'; //https://blog.csdn.net/weixin_43088706/article/details/104000600
	let recorder = null,
		dbSwitch = null;
	// import Recorder from 'recorder-js';
	/*recorder.js*/
	// const audioContext = new(window.AudioContext || window.webkitAudioContext)();
	// const recorder = new Recorder(audioContext, {
	// 	onAnalysed: data => {
	// 		// console.log("recorder data",data)
	// 	}
	// });
	// navigator.mediaDevices.getUserMedia({
	// 		audio: true
	// 	})
	// 	.then(stream => {
	// 		recorder.init(stream);
	// 		console.log('初始化完成');
	// 	})
	// 	.catch(err => console.log('Uh oh... unable to get stream...', err));
	// console.log("recorder:", recorder)
	/*recorder.js*/


	import sunuiUpimgTencent from '@/components/sunui-upimg/sunui-upimg-tencent.vue'
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				active: "", //测试用活动是否开启 ac：on off，正式需为空 
				mp3: "/static/shake.mp3",
				shakeMp3: "",
				siginBlockTop: 68,
				screenHeight: "",
				name: "", //签到姓名
				city: "", //所属城市
				up: false,
				paused: "paused",
				tjPlay: "paused", //太极运动状态
				siginSucc: false,
				signType: "", //sign：签到,assist：助力,danmu:祝福
				assistState: false,
				proImg: 1, //当前图片index
				proSize: 7, //图片总数
				shakeNumb: 0,
				taijiBox: '', //摇一摇背景样式
				rotateRight: -135,
				rotateLeft: -135,
				indicatorDots: false,
				ovHide: false,
				shakeSwitchState: false, //助力摇一摇是否开启
				blessingState: "",
				enterprise_id: "3", //指定后台账户ID号
				sub_type: "link", //指定后台sub_type:link
				getDataType: 'api', //接受、发送数据方式api，socket
				boxIsOpen: false,
				webviewStyles: {
					progress: {
						color: '#010e31'
					}
				},
				dbType: 1, //点播图片1,2,3
				isRecording: false,
				blob: null,
				Recordingbtn: "长按发送您的祝福", //音频状态
				recorderDuration: 0, //音频时长
				audio: null, //录完的音频
				cosFlag: true,
				cosArr: [],
				upImgCos: {
					cosConfig: this.$store.state.cosConfig,
					// 是否开启notli(开启的话就是选择完直接上传，关闭的话当count满足数量时才上传)
					notli: false,
					// 图片数量
					count: 1,
					// 上传图片背景修改 
					upBgColor: '#E8A400',
					// 上传icon图标颜色修改(仅限于iconfont)
					upIconColor: '#eee',
					// 上传svg图标名称
					upSvgIconName: 'icon-certificate',
					//是否压缩上传照片(仅小程序生效)
					sizeType: true,
					//相机来源(相机->camera,相册->album,两者都有->all,默认all)
					sourceType: "all",
					path: `user_path/hengjie/`,
					audioKey: "user_path/hegii/",
					photoType: "hj-"
				},
				brow: ""
			}
		},
		onLoad(option) {
			/*
			 * /pages/index/hj
			 * /pages/index/hj?sign=danmu
			 */
			var that = this;
			let sign = option.sign ? option.sign : 'assist'; //'sign'
			that.signType = sign;
			let ac = option.ac ? option.ac : 'on'; //测试用活动是否开启 ac：on off
			that.active = ac;
			var _title = '恒洁';
			switch (sign) {
				case 'assist':
					_title = '新品助力'
					break;
				case 'danmu':
					that.blessingState = 'off';
					_title = '给恒洁2021的寄语'
					break;
				default:
					_title = '恒洁-签到'
					break;
			}
			uni.setNavigationBarTitle({
				title: _title
			});
			tcVod = new TcVod({
				getSignature: function(res) {
					return that.$store.state.cosConfig
				}
			})
			uni.getSystemInfo({
				success(res) {
					console.log(res)
				}
			})
			let brow = that.getBrow();
			that.brow = "Safari：" + brow.Safari;
			that.System = "ios:" + brow.ios + "  android:" + brow.android;;
			console.log("brow:brow:", brow)
		},
		onShow() {
			var that = this;
			var signType = that.signType;
			that.$store.dispatch("getSystemInfo")
			var systemInfo = that.$store.state.systemInfo;
			var windowHeight = systemInfo.windowHeight;
			that.screenHeight = systemInfo.screenHeight - 80;
			if (windowHeight >= 812) {
				that.siginBlockTop = 80;
			} else {
				that.siginBlockTop = 65;
			}
			console.log(systemInfo)

			if (signType == 'assist') {
				that.shakeSwitch('activityCheck');
				/* Recorder实例化*/
				/* Recorder实例化*/
			} else if (signType == 'danmu') {
				recorder = new Recorder({
					type: "mp3", //此处的type类型是可修改的
					// bitRate: 16,
					// sampleRate: 16000,
					// bufferSize: 8192,
				});
				// navigator.mediaDevices.getUserMedia({
				// 		audio: true
				// 	})
				// 	.then(stream => recorder.init(stream))
				// 	.catch(err => console.log('Uh oh... unable to get stream...', err));
			} else {
				var _getDataType = that.getDataType;
				if (_getDataType == 'socket') {
					that.$store.dispatch("connectSocket")
					uni.onSocketOpen(function(res) {
						console.log('WebSocket连接已打开！');
						that.$store.state.socketErr = "";
					});
				}
			}
		},
		onReady() {},
		onHide() {
			var that = this;
			var _getDataType = that.getDataType;
			that.recorderDestroy()
		},
		onUnload() {
			var that = this;
			var _getDataType = that.getDataType;
			that.recorderDestroy()
		},
		components: {
			sunuiUpimgTencent
		},
		computed: {},
		methods: {
			openBox() {
				var that = this;
				that.boxIsOpen = true;
			},
			sendSocketMessage(val) {
				var that = this;
				var _getDataType = that.getDataType;
				let _formData = {
					"name": that.name
				};
				var rule = [];
				if (that.signType == 'sign' || that.signType == 'danmu') {
					var r = [{
						name: "name",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请填写您的姓名~"
					}];
					rule = [...rule, ...r];
				}
				//进行表单检查
				var checkRes = val == 'space_close' ? true : graceChecker.check(_formData, rule);
				if (that.signType == 'danmu' && that.$store.state.audio == '') {
					uni.showToast({
						title: "您还没有录制祝福哦~",
						icon: "none"
					});
					return false
				}
				if (checkRes) {
					var _data = {};
					var fun = "sendSocketMessage";
					if (val == 'blessing') { //寄语
						//var socketBlessing = `blessing,${that.name},${that.city},${that.blessing}`;
						fun = "getData";
						_data = {
							"intUrl": "apiUrl",
							"inter": "SiteInfomation",
							"method": "POST",
							"data": {
								"name": that.name,
								"value": that.$store.state.audio,
								"enterprise_id": that.enterprise_id,
								"sub_type": that.sub_type
							}
						}
					} else { //签到
						if (_getDataType == 'socket') { //socket 传送
							_data = {
								"msg": that.name
							};
						} else { //api 传送
							fun = "getData";
							_data = {
								"intUrl": "apiUrl",
								"inter": "SiteSign",
								"method": "POST",
								"data": {
									"name": that.name,
									"enterprise_id": that.enterprise_id,
								}
							}
						}
					}
					_data["fun"] = function(res) {
						// that.up = true;
						console.log(res);
						if (res.type && res.type == 'socket') {
							if (res.result) {
								that.siginSucc = true;
							} else {
								uni.showToast({
									title: "签到异常，请尝试刷新页面",
									icon: "none"
								});
							}
						} else if (res.success) {
							var _signType = that.signType;
							console.log(_signType)
							if (_signType == 'sign') {
								that.siginSucc = true;
								uni.setStorage({
									key: 'hj-user',
									data: that.name,
									success: function() {}
								});
							} else if (_signType == 'danmu') {
								if (that.blessingState == 'off') {
									that.blessingState = 'on';
								}
							}
						} else {
							uni.showToast({
								title: "提交失败",
								icon: "none"
							});
						}
						that.paused = "running";
						// setTimeout(() => {
						// 	that.up = false;
						// 	//that.siginSucc = false;
						// 	that.paused = "paused";
						// }, 3000)
					}
					console.log(_data);
					that.$store.dispatch(fun, _data)
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}

			},
			shakeSwitch(type) {
				var that = this;
				if (that.active != "") { //测试用活动是否开启
					that.shakeSwitchState = that.active == 'on' ? true : false;
				} else {
					var shakeSwitchState = that.shakeSwitchState;
					var _inter = type ? type : (shakeSwitchState ? 'activityStop' : 'activityStart');
					let _data = {
						"intUrl": 'ajUrlb',
						"inter": _inter
					};
					_data["fun"] = function(res) {
						if (res) {
							that.shakeSwitchState = res == 'on' ? true : false;
						}
					}
					that.$store.dispatch("getData", _data)
				}

			},
			pageRestore() {
				//console.log("pageRestore")
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
			},
			startRecording() {
				var that = this;
				recorder.start();
				that.isRecording = true;
				that.Recordingbtn = "松开保存";
				dbSwitch = setInterval(() => {
					that.dbType = that.dbType + 1 > 3 ? 1 : that.dbType + 1;
				}, 500)
				// recorder.start().then(() => {
				// 	console.log("startRecording")
				// 	that.isRecording = true;
				// 	that.Recordingbtn = "保存录音";
				// 	// that.stopRecording()
				// });
			},
			stopRecording() {
				var that = this;
				recorder.stop();
				clearInterval(dbSwitch);
				dbSwitch = null;
				that.isRecording = false;
				that.Recordingbtn = "长按发送您的祝福";
				let duration = recorder.duration;

				console.log(recorder.duration);
				if (duration > 0) {
					that.recorderDuration = recorder.duration;
					let Blob = recorder.getWAVBlob(); //recorder.getPCMBlob();
					that.audio = Blob;
					console.log("Blob:", Blob)
					/****Blob转base64***/
					// that.blobToDataURL(Blob, function(e) {//
					// 	console.log("blobToDataURL:", e)
					// 	// let ccc = that.dataURLtoBlob(e);
					// 	// console.log("ccc:", ccc)
					// });
					/****Blob转base64***/

					/****tcVod***/
					that.blobToFile(Blob);
					/****tcVod***/


				} else {
					uni.showToast({
						title: `录音失败`,
						icon: 'none'
					});
				}

				/**测试blob**/
				// var audio = document.createElement("audio");
				// audio.controls = true;
				// document.body.appendChild(audio);audio 
				// //非常简单的就能拿到blob音频url
				// audio.src = URL.createObjectURL(that.audio);
				// audio.play();
				/**测试blob**/

				// recorder.stop().then(({
				// 	blob,
				// 	buffer
				// }) => {
				// 	console.log("stopRecording")
				// 	that.Recordingbtn = "开始录音";
				// 	that.isRecording = false;
				// 	that.blob = blob;
				// 	console.log("blob:", blob)
				// 	// buffer is an AudioBuffer
				// });
			},
			blobToDataURL(blob, callback) { //Blob转base64
				let a = new FileReader();
				a.onload = function(e) {
					callback(e.target.result);
				}
				a.readAsDataURL(blob);
			},
			dataURLtoBlob(dataurl) { //base64转Blob
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: mime
				});
			},
			blobToFile(blob) {
				var that = this;
				let blobURL = URL.createObjectURL(blob)
				// Recorder.download(blob, 'my-audio-file'); // downloads a .wav file

				var file = {};
				var xhr = new XMLHttpRequest();
				xhr.open('GET', blobURL, true);
				xhr.responseType = 'blob';
				xhr.onload = function(e) {
					if (this.status == 200) {

						// var fd = new FormData();
						// fd.append('fname', 'hj.wav');
						// fd.append('data', blob);

						file.file = this.response;
						file.name = "audio.mp3";
						file.size = this.response.size; //getYourBlobSize();
						file.type = this.response.type;
						// console.log("eeee:", file);
						that.$refs.uImage.setData(this.response);
						that.uAudioTap();
						// uploadAudioBlobs(file);
					}
				};
				xhr.send();

				// const uploader = tcVod.upload({
				// 	mediaFile: file, // 媒体文件（视频或音频或图片），类型为 File
				// });
				// uploader.on('media_progress', function(info) {
				// 	console.log(info.percent) // 进度
				// });
				// uploader.done().then(function(doneResult) {
				// 	console.log("doneResult:", doneResult)
				// 	// deal with doneResult
				// }).catch(function(err) {
				// 	console.log("doneErr:", err)
				// 	// deal with error
				// })
			},
			recorderPlay() {
				recorder.play();
			},
			uploadRecorder() {
				var that = this;
				console.log("audio:", that.audio)
				if (that.recorderDuration) {
					// var form = new FormData();
					// let user = that.user ? that.user : 'HEGII';
					// form.append("upfile", that.audio, "HEGII.mp3");
					// console.log("form:", form)
					// uni.uploadFile({
					// 	url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
					// 	filePath: that.audio,
					// 	name: 'file',
					// 	formData: {
					// 		'user': user
					// 	},
					// 	success: (uploadFileRes) => {
					// 		console.log(uploadFileRes.data);
					// 	}
					// });
				}
			},
			download() {
				var that = this;
				// recorder.downloadWAV();
				recorder.download(that.audio, 'hj', 'mp3');
			},
			recorderDestroy() {
				if (recorder) {
					let fn = function(e) {
						console.log("recorderDestroy")
					}
					recorder.destroy(fn);
					recorder = null;
				}
			},
			// 手动上传图片(适用于表单等上传) -2019/05/10增加
			uAudioTap() {
				this.$refs.uImage.uploadAudio(this.upImgCos);
			},
			// 删除图片 -2019/05/12(本地图片进行删除)
			async delImgInfo(e) {
				console.log('你删除的图片地址为:', e);
			},
			// 腾讯云
			async upCosData(e) {
				if (this.cosFlag) {
					this.cosArr = await e;
					// 可以根据长度来判断图片是否上传成功. 2019/4/11新增
					if (this.cosArr) {
						uni.showToast({
							title: `上传成功`,
							icon: 'none'
						});
					}
				}
				this.cosFlag = false;

			},
			// 获取上传图片腾讯云
			async getUpImgInfoCos() {
				let arrImg = [];
				for (let i = 0, len = this.cosArr.length; i < len; i++) {
					try {
						if (this.cosArr[i].path_server != "") {
							await arrImg.push(this.cosArr[i].path_server.split(','));
						}
					} catch (err) {
						console.log('上传失败...');
					}
				}
				console.log('腾讯云转成一维数组:', arrImg.join().split(','));
			},
			getBrow() {
				var u = navigator.userAgent;
				var ua = navigator.userAgent.toLocaleLowerCase();
				var app = navigator.appVersion;
				return {
					trident: u.indexOf('Trident') > -1,
					/*IE内核*/
					presto: u.indexOf('Presto') > -1,
					/*opera内核*/
					webKit: u.indexOf('AppleWebKit') > -1,
					/*苹果、谷歌内核*/
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
					/*火狐内核*/
					mobile: !!u.match(/AppleWebKit.*Mobile.*/),
					/*是否为移动终端*/
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
					/*ios终端*/
					android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
					/*android终端或者uc浏览器*/
					iPhone: u.indexOf('iPhone') > -1,
					/*是否为iPhone或者QQHD浏览器*/
					iPad: u.indexOf('iPad') > -1,
					/*是否iPad*/
					webApp: u.indexOf('Safari') == -1,
					/*是否web应该程序，没有头部与底部*/
					souyue: u.indexOf('souyue') > -1,
					superapp: u.indexOf('superapp') > -1,
					weixin: u.toLowerCase().indexOf('micromessenger') > -1,
					qq: ua.match(/QQ/i) == "qq", // QQ
					weiBo: ua.match(/WeiBo/i) == "weibo", // 微博
					Safari: u.indexOf('Safari') > -1,
					QQbrw: u.indexOf('MQQBrowser') > -1, // QQ浏览器
					webview: !(u.match(/Chrome\/([\d.]+)/) || u.match(/CriOS\/([\d.]+)/)) && u.match(
						/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
					ucweb: function() {
						try {
							return parseFloat(u.match(/ucweb\d+\.\d+/gi).toString().match(/\d+\.\d+/).toString()) >= 8.2
						} catch (e) {
							if (u.indexOf('UC') > -1) {
								return true;
							}
							return false;
						}
					}(),

					Symbian: u.indexOf('Symbian') > -1,
					ucSB: u.indexOf('Firofox/1.') > -1,
				};
			},
		}
	}
</script>

<style>
	@import '../../common/progress.css';
	@import './index.css';
	@import './rotate.css';
</style>
