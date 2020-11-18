<template>
	<view class="user-box" :class="signType=='assist'?'bg2':''" :style="{'height':screenHeight+'px'}">
		<view class="sign-main">
			<view class="send-box">
				<view class="typeBtn socketErr" v-if="$store.state.socketErr" @click="$store.dispatch('connectSocket')">{{$store.state.socketErr}}</view>
				<img src="../../static/logo.png" id="Logo" alt="">
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
						<view class="active-main">
							<view class="recorder-box">
								<!-- <audio style="text-align: left" :src="blob" controls></audio> -->
								<view class="recorder-btn" @click="recorderPlay" @longpress="startRecording" @touchend="stopRecording">
									{{Recordingbtn}}
								</view>
								<block v-if="recorderDuration>0">
									<!-- <view class="recorder-btn" @click="recorderPlay">
										播放
									</view> -->
									<view class="recorder-btn" @click="uploadRecorder">
										发送
									</view>
									<view class="recorder-btn" @click="recorderDestroy">
										取消
									</view>
									<!-- <view class="recorder-btn" @click="download">
										下载
									</view> -->
								</block>
							</view>
						</view>
					</block>
					<block v-else>
						<img src="../../static/commingsoon.png" id="AssistComming" alt="">
					</block>
				</block>
				<block v-if="signType=='danmu'">
					<view class="danmu-box">
						<block v-if="blessingState!='on'">
							<view class="danmu-row row-helf">
								<view class="danmu-title">
									城市
								</view>
								<input class="danmu-ipt" type="text" @blur="pageRestore" v-model="city" placeholder="" />
							</view>
							<view class="danmu-row row-helf">
								<view class="danmu-title">
									姓名
								</view>
								<input class="danmu-ipt" type="text" @blur="pageRestore" v-model="name" placeholder="" />
							</view>
							<view class="danmu-row">
								<view class="sendMsg danmu-btn" @click="sendSocketMessage('blessing')">
									点击提交
								</view>
							</view>
						</block>
						<block v-else>
							<view class="blessingOn">
								寄语已送达，感谢您的参与
							</view>
						</block>
					</view>
				</block>
				<view class="user-bubble" v-if="up" :style="{'animation-play-state':paused}">
					<view class="uname">{{name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Shake from 'shake.js'
	import Recorder from 'js-audio-recorder'; //https://blog.csdn.net/weixin_43088706/article/details/104000600
	let recorder = null;
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


	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				active: "", //测试用活动是否开启 ac：on off，正式需为空
				mp3: "/static/shake.mp3",
				shakeMp3: "",
				siginBlockTop: 68,
				screenHeight: "",
				user: "",
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
				enterprise_id: "4", //指定后台账户ID号
				getDataType: 'api', //接受、发送数据方式api，socket
				isRecording: false,
				blob: null,
				Recordingbtn: "长按录音", //音频状态
				recorderDuration: 0, //音频时长
				audio: null //录完的音频
			}
		},
		onLoad(option) {
			var that = this;
			let sign = option.sign ? option.sign : 'sign';
			that.signType = sign;
			let ac = option.ac ? option.ac : ''; //测试用活动是否开启 ac：on off
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
			uni.getStorage({
				key: 'hj-user',
				success: function(res) {
					that.user = res.data;
				}
			});
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
				recorder = new Recorder({
					type: "mp3", //此处的type类型是可修改的
					// bitRate: 16,
					// sampleRate: 16000,
					// bufferSize: 8192,
				});

			} else if (signType == 'danmu') {
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
			if (_getDataType == 'socket') {
				that.sendSocketMessage('space_close')
			}
			that.recorderDestroy()
		},
		onUnload() {
			var that = this;
			var _getDataType = that.getDataType;
			if (_getDataType == 'socket') {
				that.sendSocketMessage('space_close')
			}
			that.recorderDestroy()
		},
		components: {},
		computed: {},
		methods: {
			sendSocketMessage(val) {
				var that = this;
				var _getDataType = that.getDataType;
				let _formData = {
					"name": that.name
				};
				var rule = [];
				if (that.signType == 'sign') {
					var r = [{
						name: "name",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "啊呀，您信息还未填写完整~"
					}];
					rule = [...rule, ...r];
				}
				//进行表单检查
				var checkRes = val == 'space_close' ? true : graceChecker.check(_formData, rule);
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
								"city": that.city,
								"enterprise_id": that.enterprise_id,
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
			taijiOpen() {
				var that = this;
				if (!that.shakeSwitchState) {
					return
				}
				that.ovHide = true;
				that.tjPlay = 'running';
			},
			shakeSwitch(type) {
				var that = this;
				if (that.active != "") { //测试用活动是否开启
					that.shakeSwitchState = that.active == 'on' ? true : false;
				} else {
					var shakeSwitchState = that.shakeSwitchState;
					var _inter = type ? type : (shakeSwitchState ? 'activityStop' : 'activityStart');
					console.log(shakeSwitchState, _inter)
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
				that.isRecording = false;
				that.Recordingbtn = "长按录音";
				that.recorderDuration = recorder.duration;
				that.audio = recorder.getWAVBlob(); //recorder.getPCMBlob();

				console.log(recorder.duration);

				/**测试blob**/
				// var audio = document.createElement("audio");
				// audio.controls = true;
				// document.body.appendChild(audio);
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
			recorderPlay() {
				recorder.play();
			},
			uploadRecorder() {
				var that = this;
				console.log("audio:", that.audio)
				if (that.recorderDuration) {
					var form = new FormData();
					let user = that.user ? that.user : 'HEGII';
					form.append("upfile", that.audio, "HEGII.mp3");
					console.log("form:", form)
					uni.uploadFile({
						url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
						filePath: that.audio,
						name: 'file',
						formData: {
							'user': user
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes.data);
						}
					});
				}
			},
			download() {
				recorder.downloadWAV();
				// let formData = new FormData();
				// formData.append("type", "20");
				// formData.append("file", blob, "file.wav");
				// console.log("download", formData)
				// Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
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
		}
	}
</script>

<style>
	@import '../../common/progress.css';
	@import './index.css';
</style>
