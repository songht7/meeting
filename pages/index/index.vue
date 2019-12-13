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
									<text>恒洁2020年度经销商大会</text>
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
				<block v-else-if="signType=='assist'">
					<block v-if="shakeSwitchState">
						<view class="circleProgress_wrapper">
							<view class="taiji-box" :class="[assistState||ovHide?'ovHide':'',taijiBox]" @click="taijiOpen">
								<view class="spot-box" v-if="tjPlay=='paused'">
									<image class="spot" src="../../static/spot.png" mode="aspectFit"></image>
									<view class="spot-val">{{shakeSwitchState?'点击开启新品助力':'新品发布,敬请期待'}}</view>
								</view>
								<view class="taiji taiji-left" :style="{'animation-play-state':tjPlay}">
									<img class="taiji-img taiji-img-left" src="../../static/taiji-left.png" />
								</view>
								<view class="taiji taiji-right" :style="{'animation-play-state':tjPlay}">
									<img class="taiji-img taiji-img-right" src="../../static/taiji-right.png" />
								</view>
							</view>
							<block v-if="shakeSwitchState">
								<view class="pro-img" :class="{'new-pro':assistState}">
									<image v-show="!assistState" class="pImg" :class="['pImg-'+proImg]" :src="'../../static/pro-'+proImg+'.png'"
									 mode="aspectFit"></image>
									<!-- autoplay="autoplay" -->
									<swiper v-show="assistState" class="swiper-box" autoplay="autoplay" :indicator-dots="indicatorDots" circular="circular"
									 interval="1000" duration="500">
										<swiper-item v-for="pro in proSize" :key="pro">
											<image class="pImg swiper-img" :src="'../../static/pros-'+pro+'.png'" mode="aspectFit"></image>
										</swiper-item>
									</swiper>
								</view>
								<view class="wrapper right">
									<view class="circleProgress rightcircle" :style="{'transform':' rotate('+rotateRight+'deg)'}">
									</view>
								</view>
								<view class="wrapper left">
									<view class="circleProgress leftcircle" :style="{'transform':' rotate('+rotateLeft+'deg)'}">
									</view>
								</view>
							</block>
						</view>
						<view class="shake-info" v-if="tjPlay=='running'&&!assistState" @click="shakeEventDidOccur">
							<img src="../../static/shake.png" class="shake-img" alt="">
							<view class="shake-ovs">
								摇一摇，助力新品发布
							</view>
						</view>
					</block>
					<block v-else>
						<img src="../../static/commingsoon.png" id="AssistComming" alt="">
					</block>
				</block>
				<block v-else-if="signType=='danmu'">
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
								<view class="danmu-title">
									我对恒洁2020的祝福
								</view>
								<textarea class="danmu-ipt danmu-area" @blur="pageRestore" v-model="blessing" auto-height maxlength="-1" />
								</view>
							<view class="danmu-row">
								<view class="sendMsg danmu-btn" @click="sendSocketMessage('blessing')">
									点击提交
								</view>
							</view>
						</block>
						<block v-else>
							<view class="blessingOn">
								祝福已提交，感谢您的参与
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
	var graceChecker = require("@/common/graceChecker.js");
	export default {
		data() {
			return {
				siginBlockTop: 68,
				screenHeight: "",
				name: "", //签到姓名
				city: "", //所属城市
				blessing: "", //祝福语
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
				blessingState: ""
			}
		},
		onLoad(option) {
			var that = this;
			let sign = option.sign ? option.sign : 'sign';
			that.signType = sign;
			var _title = '恒洁';
			switch (sign) {
				case 'assist':
					_title = '新品助力'
					break;
				case 'danmu':
					that.blessingState = 'off';
					_title = '祝福'
					break;
				default:
					_title = '恒洁-签到'
					break;
			}
			uni.setNavigationBarTitle({
				title: _title
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
				setTimeout(() => {
					let myShake = new Shake({
						threshold: 5, // 摇动阈值
						timeout: 500 // 默认两次事件间隔时间
					});
					myShake.start();
					window.addEventListener('shake', that.shakeEventDidOccur, false)
				}, 1000)
			} else {
				that.$store.dispatch("connectSocket")
				uni.onSocketOpen(function(res) {
					console.log('WebSocket连接已打开！');
					that.$store.state.socketErr = "";
				});
			}
		},
		onReady() {},
		onHide() {
			this.sendSocketMessage('space_close')
		},
		onUnload() {
			this.sendSocketMessage('space_close')
		},
		components: {},
		computed: {},
		methods: {
			shakeEventDidOccur() {
				var that = this;
				that.shakeSwitch('activityCheck');
				if (!that.shakeSwitchState) {
					return
				}
				if (that.tjPlay == 'paused' || that.shakeNumb >= that.proSize) {
					that.rotateRight = defaultVal;
					that.rotateLeft = defaultVal;
					return
				}
				var defaultVal = -135; //进度条默认值
				var maxVal = 45; //左右进度条最大值（右过度到左）
				var rotateSize = 48; //设置旋转大小
				that.shakeNumb = that.shakeNumb + 1;
				that.taijiBox = 'taiji-box-' + that.shakeNumb;
				//console.log(that.shakeNumb, that.proSize)
				var rRight = that.rotateRight + rotateSize;
				var rRightMax = rRight <= maxVal ? false : true;
				that.rotateRight = rRight <= maxVal ? rRight : maxVal;
				if (rRightMax) {
					var rLeft = that.rotateLeft + rotateSize;
					var rLeftMax = rLeft <= maxVal ? false : true;
					that.rotateLeft = rLeft <= maxVal ? rLeft : maxVal;
				}
				if (that.shakeNumb > 1) {
					that.proImg = that.proImg + 1 <= that.proSize ? that.proImg + 1 : that.proSize;
				}
				if (that.shakeNumb >= that.proSize) {
					setTimeout(function() {
						that.assistState = true;
					}, 1500);
				}
			},
			sendSocketMessage(val) {
				var that = this;
				let _formData = {
					"name": that.name,
					"city": that.city,
					"blessing": that.blessing
				};
				var rule = [{
					name: "name",
					checkType: "notnull",
					checkRule: "",
					errorMsg: "啊呀，您信息还未填写完整~"
				}];
				if (that.signType == 'danmu') {
					var r = [{
							name: "city",
							checkType: "notnull",
							checkRule: "",
							errorMsg: "啊呀，您信息还未填写完整~"
						},
						{
							name: "blessing",
							checkType: "notnull",
							checkRule: "",
							errorMsg: "啊呀，您信息还未填写完整~"
						}
					];
					rule=[...rule,...r];
				}
				//进行表单检查
				var checkRes = graceChecker.check(_formData, rule);
				if (checkRes) {
					if (val == 'blessing') {
						val = `blessing,${that.name},${that.city},${that.blessing}`;
					}
					var _msg = val || that.name;
					console.log(_msg)
					let _data = {
						"msg": _msg
					};
					_data["fun"] = function() {
						// that.up = true;
						that.siginSucc = true;
						that.paused = "running";
						if (that.blessingState == 'off') {
							that.blessingState = 'on';
						}
						// setTimeout(() => {
						// 	that.up = false;
						// 	//that.siginSucc = false;
						// 	that.paused = "paused";
						// }, 3000)
					}
					console.log(_data);
					that.$store.dispatch("sendSocketMessage", _data)
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
