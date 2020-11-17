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
							123
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
	import Recorder from 'recorder-js';
	const audioContext = new(window.AudioContext || window.webkitAudioContext)();


	let isRecording = false;
	let blob = null;

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
				enterprise_id: "4", //指定后台账户ID号
				getDataType: 'api' //接受、发送数据方式api，socket
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
			/*recorder.js*/
			const recorder = new Recorder(audioContext, {
				onAnalysed: data => console.log(data),
				success: function(success) { //成功回调函数
					// start.disabled = false;
					console.log("recorder-js-success:", success)
				},
				error: function(msg) { //失败回调函数
					console.log("recorder-js-error:", msg);
				},
				fix: function(msg) { //不支持H5录音回调函数
					console.log("recorder-js-fix:", msg);
				}
			});
			/*recorder.js*/
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
				this.sendSocketMessage('space_close')
			}
		},
		onUnload() {
			var that = this;
			var that = this;
			var _getDataType = that.getDataType;
			if (_getDataType == 'socket') {
				this.sendSocketMessage('space_close')
			}
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
			}
		}
	}
</script>

<style>
	@import '../../common/progress.css';
	@import './index.css';
</style>
