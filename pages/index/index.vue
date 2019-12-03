<template>
	<view class="user-box" :style="{'height':screenHeight+'px'}">
		<view class="sign-main">
			<view class="send-box">
				<img src="../../static/logo.png" id="Logo" alt="">
				<block v-if="signType=='Sign'">
					<view class="sigin-form">
						<view class="sigin-block" :style="{'padding-top':siginBlockTop+'%'}">
							<block v-if="siginSucc">
								<view class="sigin-info sigin-info-succ">
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
				<block v-else>
					<view class="circleProgress_wrapper">
						<view class="pro-img">
							<image class="pImg" :src="'../../static/pro-'+proImg+'.png'" mode="aspectFit"></image>
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
					<view class="shake-info" @click="shakeEventDidOccur">
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
				siginSucc: false,
				signType: "Sign",
				proImg: 1,
				proSize: 7,
				rotateRight: -135,
				rotateLeft: -135
			}
		},
		onLoad(option) {
			var that = this;
			let sign = option.sign;
			if (sign == 'shake') {
				that.signType = sign;
			}
		},
		onShow() {
			var that = this;
			var signType = that.signType;
			that.$store.dispatch("getSystemInfo")
			var systemInfo = that.$store.state.systemInfo;
			var windowHeight = systemInfo.windowHeight;
			that.screenHeight = systemInfo.screenHeight;
			if (windowHeight >= 812) {
				that.siginBlockTop = 80;
			} else {
				that.siginBlockTop = 65;
			}
			console.log(systemInfo)
			if (signType == 'shake') {
				let myShake = new Shake({
					threshold: 10, // 默认摇动阈值
					timeout: 1000 // 默认两次事件间隔时间
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
				var defaultVal = -135;
				var maxVal = 45;
				if (that.proImg >= that.proSize && that.rotateLeft >= maxVal) {
					var assist = "感谢您完成所有助力！";
					console.log(assist)
					that.up = true;
					that.paused = "running";
					that.name = assist;
					setTimeout(() => {
						that.up = false;
						that.paused = "paused";
					}, 3000)
					return
				}
				var rRight = that.rotateRight + 90;
				var rRightMax = rRight <= maxVal ? false : true;
				that.rotateRight = rRight <= maxVal ? rRight : maxVal;
				if (rRightMax) {
					var rLeft = that.rotateLeft + 90;
					var rLeftMax = rLeft <= maxVal ? false : true;
					that.rotateLeft = rLeft <= maxVal ? rLeft : maxVal;
					if (rLeftMax) {
						that.rotateRight = defaultVal;
						that.rotateLeft = defaultVal;
						that.proImg = that.proImg + 1 <= that.proSize ? that.proImg + 1 : that.proSize;
					}
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
					that.up = true;
					that.siginSucc = true;
					that.paused = "running";
					setTimeout(() => {
						that.up = false;
						//that.siginSucc = false;
						that.paused = "paused";
					}, 3000)
				}
				console.log(_data);
				that.$store.dispatch("sendSocketMessage", _data)
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
		background: url(../../static/bg.jpg) 50% 50% no-repeat #193977;
		background-size: cover;
		position: relative;
		min-height: 100%;
	}

	.sign-main {
		padding: 20upx;
		height: 90%;
	}

	#Logo {
		width: 70%;
		display: block;
		margin: 50upx auto 25upx;
	}

	.send-box {
		z-index: 3;
		height: 100%;
	}

	.sigin-form {
		background: url(../../static/water.png) 50% 50% no-repeat;
		background-size: contain;
		height: 90%;
	}

	.sigin-block {
		width: 80%;
		padding: 68% 10% 0;
	}

	.sigin-info {
		text-align: center;
		color: #173171;
		font-size: 38upx;
	}

	.sigin-info-succ {
		font-size: 42upx;
		padding-top: 10upx;
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
</style>
