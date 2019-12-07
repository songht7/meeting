<template>
	<view class="user-box" :class="signType=='assist'?'bg2':''" :style="{'height':screenHeight+'px'}">
		<view class="sign-main">
			<view class="send-box">
				<img src="../../static/logo.png" id="Logo" alt="">
				<block v-if="signType=='sign'">
					<view class="sigin-form">
						<image class="water" :style="{'animation-play-state':paused}" src="../../static/water.png" mode="aspectFit"></image>
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
									<input class="sign" type="text" v-model="name" />
									<view class="sendMsg" @click="sendSocketMessage('')">
										点击签到
									</view>
									<!-- <view class="sendMsg" @click="sendSocketMessage('space_close')">
								关闭
							</view> -->
								</view>
							</block>
						</view>
					</view>
				</block>
				<block v-else-if="signType=='assist'">
					<view class="circleProgress_wrapper">
						<view class="taiji-box ovHide" :class="{'ovHide':assistState}" @click="taijiOpen">
							<view class="spot-box" v-if="tjPlay=='paused'">
								<image class="spot" src="../../static/spot.png" mode="aspectFit"></image>
								<view class="spot-val">点击开启新品助力</view>
							</view>
							<img class="taiji taiji-left" src="../../static/taiji-left.png" :style="{'animation-play-state':tjPlay}" />
							<img class="taiji taiji-right" src="../../static/taiji-right.png" :style="{'animation-play-state':tjPlay}">
						</view>
						<view class="pro-img" :class="{'new-pro':assistState}">
							<image v-if="!assistState" class="pImg" :class="['pImg-'+proImg]" :src="'../../static/pro-'+proImg+'.png'" mode="aspectFit"></image>
							<!-- autoplay="autoplay" -->
							<swiper v-if="assistState" class="swiper-box" autoplay="autoplay" :indicator-dots="indicatorDots" circular="circular"
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
					</view>
					<view class="shake-info" v-if="tjPlay=='running'&&!assistState" @click="shakeEventDidOccur">
						<img src="../../static/shake.png" class="shake-img" alt="">
						<view class="shake-ovs">
							摇一摇，助力新品发布
						</view>
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
	export default {
		data() {
			return {
				siginBlockTop: 68,
				screenHeight: "",
				name: "",
				up: false,
				paused: "paused",
				tjPlay: "paused",
				siginSucc: false,
				signType: "", //sign：签到,assist：助力
				assistState: false,
				proImg: 1,
				proSize: 7,
				shakeNumb: 0,
				rotateRight: -135,
				rotateLeft: -135,
				indicatorDots: false
			}
		},
		onLoad(option) {
			var that = this;
			let sign = option.sign;
			if (sign == 'assist') {
				that.signType = sign;
				uni.setNavigationBarTitle({
					title: '新品助力'
				});
			} else {
				that.signType = 'sign';
				uni.setNavigationBarTitle({
					title: '恒洁-签到'
				});
			}
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
				let myShake = new Shake({
					threshold: 5, // 摇动阈值
					timeout: 500 // 默认两次事件间隔时间
				});
				myShake.start();
				window.addEventListener('shake', that.shakeEventDidOccur, false)
			} else {
				that.$store.dispatch("connectSocket")
			}
		},
		onReady() {
			uni.onSocketOpen(function(res) {
				console.log('WebSocket连接已打开！');
			});
		},
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
				if (that.tjPlay == 'paused' || that.shakeNumb >= that.proSize) {
					that.rotateRight = defaultVal;
					that.rotateLeft = defaultVal;
					return
				}
				var defaultVal = -135; //进度条默认值
				var maxVal = 45; //左右进度条最大值（右过度到左）
				var rotateSize = 48; //设置旋转大小
				that.shakeNumb = that.shakeNumb + 1;
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
				var _msg = val || that.name;
				console.log(_msg)
				let _data = {
					"msg": _msg
				};
				_data["fun"] = function() {
					// that.up = true;
					that.siginSucc = true;
					that.paused = "running";
					// setTimeout(() => {
					// 	that.up = false;
					// 	//that.siginSucc = false;
					// 	that.paused = "paused";
					// }, 3000)
				}
				console.log(_data);
				that.$store.dispatch("sendSocketMessage", _data)
			},
			taijiOpen() {
				var that = this;
				that.tjPlay = 'running';
			}
		}
	}
</script>

<style>
	@import '../../common/progress.css';

	page {
		height: 100%;
		width: 100%;
	}

	.user-box {
		background: url("../../static/bg.jpg") 50% bottom no-repeat #193977;
		background-size: cover;
		position: relative;
		min-height: 100%;
	}

	.bg2 {
		background-image: url("../../static/bg2.jpg");
	}

	.sign-main {
		padding: 20upx;
		height: 90%;
	}

	#Logo {
		width: 70%;
		display: block;
		margin: 50upx auto;
	}

	.send-box {
		z-index: 3;
		height: 100%;
	}

	.sigin-form {
		/* background: url(../../static/water.png) 50% 50% no-repeat;
		background-size: contain; */
		height: 90%;
		position: relative;
	}

	.water {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 1;
		animation-name: water-show;
		animation-duration: 2.5s;
		animation-timing-function: ease;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
	}

	@keyframes water-show {
		from {
			opacity: 0.5;
		}

		to {
			opacity: 1;
		}
	}

	.sigin-block {
		width: 80%;
		padding: 68% 10% 0;
		position: relative;
		z-index: 2;
	}

	.sigin-info {
		text-align: center;
		color: #173171;
		font-size: 38upx;
	}

	.sigin-info-succ {
		font-size: 42upx;
		padding-top: 10upx;
		animation-name: sigin-succ;
		animation-duration: 2s;
		animation-timing-function: ease;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
	}

	@keyframes sigin-succ {
		from {
			transform: scale(0.2)
		}

		to {
			transform: scale(1)
		}
	}

	.sign-ipt {
		width: 70%;
		padding: 0 15%;
	}

	.sign {
		background: #FFFFFF;
		line-height: 1.4;
		font-size: 38upx;
		border: 1upx solid #CCCCCC;
		padding: 5upx 10upx;
		color: #173171;
		text-align: center;
	}

	.sendMsg {
		font-size: 32upx;
		background: #1E3070;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		line-height: 1.4;
		padding: 15upx;
		margin: 10upx auto;
	}

	.user-bubble {
		position: absolute;
		width: 100%;
		bottom: 10%;
		opacity: 0;
		z-index: 1;
		animation-name: fadeUpOut;
		animation-duration: 3s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-fill-mode: none;
		/* forwards; */
	}

	@keyframes fadeUpOut {
		0% {
			bottom: 50%;
			opacity: 1;
		}

		5% {
			opacity: 0.5;
		}

		10% {
			opacity: 0.8;
		}

		30% {
			opacity: 1;
		}

		100% {
			opacity: 1;
			bottom: 120%;
		}
	}

	.uname {
		color: #DB9824;
		font-size: 50upx;
		line-height: 1;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;

		animation-name: flash;
		animation-duration: 1.5s;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
		animation-direction: alternate;
	}

	@keyframes flash {
		from {
			text-shadow: 0 0 5px #CBB281,
				0 0 10px #CBB281,
				0 0 35px #DB9824,
				0 0 40px #DB9824;
		}

		to {
			text-shadow: 0 0 10px #CBB281,
				0 0 20px #CBB281,
				0 0 40px #DB9824,
				0 0 70px #DB9824;
		}
	}

	.swiper-box {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		overflow: hidden;
		z-index: 5;
	}

	uni-swiper-item {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		align-items: center;
	}

	.shake-info {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-content: center;
		align-items: center;
		padding: 20upx 0;
	}

	.shake-img {
		width: 100upx;
		height: auto;
	}

	.shake-info {
		color: #FFFFFF;
		font-size: 32upx;
		line-height: 2;
		padding: 20upx 0;
	}

	.taiji-box {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		border-radius: 50%;
		box-shadow: 0 0 100upx 30upx #224386;
	}

	.ovHide {
		overflow: hidden;
	}

	.spot-box {
		position: absolute;
		z-index: 11;
		height: 120%;
		width: 120%;
		/* background: rgba(0, 0, 0, .2); */
		border-radius: 50%;
		left: -10%;
		top: -10%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		align-items: center;
	}

	.spot-val {
		color: #FFFFFF;
		font-size: 32upx;
		/* margin-left: 45%; */
	}

	.spot {
		width: 8%;
		height: 8%;
		margin: 0 10upx 0 45%;
		animation-name: spot-shine;
		animation-duration: 2s;
		animation-timing-function: ease;
		animation-iteration-count: infinite;
		animation-direction: alternate;
	}

	.taiji {
		height: 100%;
		position: absolute;
		top: -2%;
		animation-name: rotate-left;
		animation-duration: 2s;
		animation-timing-function: linear;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
	}

	.taiji-left {
		left: -1%;
	}

	.taiji-right {
		top: auto;
		right: -1%;
		bottom: -2%;
		animation-name: rotate-right;
	}

	@keyframes spot-shine {
		from {
			transform: none
		}

		to {
			transform: scale(2)
		}
	}

	@keyframes rotate-left {
		0% {
			left: -1%;
			top: -2%;
			opacity: 1;
		}

		50% {
			left: -50%;
			top: -50%;
			opacity: 0.5;
		}

		100% {
			left: -100%;
			top: -100%;
			opacity: 0;
		}
	}

	@keyframes rotate-right {
		0% {
			right: -1%;
			bottom: -2%;
			opacity: 1;
		}

		50% {
			right: -50%;
			bottom: -50%;
			opacity: 0.5;
		}

		100% {
			right: -100%;
			bottom: -100%;
			opacity: 0;
		}
	}
</style>
