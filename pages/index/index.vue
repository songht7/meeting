<template>
	<view class="user-box">
		<view class="sign-main">
			<view class="send-box">
				<img src="../../static/logo.png" id="Logo" alt="">
				<block v-if="userSign=='Sign'">
					<view class="user-bubble" v-if="up" :style="{'animation-play-state':paused}">
						<view class="uname">{{name}}</view>
					</view>
					<view class="sigin-form">
						<view class="sigin-block">
							<block v-if="siginSucc">
								<view class="sigin-info sigin-info-succ">
									<text>欢迎您参加</text><br />
									<text>恒洁2020年度经销商大会</text>
								</view>
							</block>
							<block v-else>x
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
					
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import Shake from 'shake.js'
	export default {
		data() {
			return {
				name: "",
				up: false,
				paused: "paused",
				siginSucc: false,
				userSign: "Sign"
			}
		},
		onLoad(option) {
			var that = this;
			let sign = option.sign;
			if (sign == 'shake') {
				that.userSign = sign;
			}
		},
		onShow() {
			this.$store.dispatch("connectSocket")
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
	page {
		height: 100%;
		width: 100%;
	}

	.user-box {
		background: url(../../static/bg.jpg) 50% 50% no-repeat #193977;
		background-size: cover;
		position: relative;
		height: 100%;
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
		padding: 550upx 10% 0;
	}

	.sigin-info {
		text-align: center;
		color: #173171;
		font-size: 38upx;
	}

	.sigin-info-succ {
		font-size: 42upx;
		padding-top: 50upx;
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
</style>
