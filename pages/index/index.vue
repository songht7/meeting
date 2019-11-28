<template>
	<view class="user-box">
		<view class="send-box">
			<input class="sign" type="text" v-model="name" />
			<view class="sendMsg" @click="sendSocketMessage('')">
				签到
			</view>
			<!-- <view class="sendMsg" @click="sendSocketMessage('space_close')">
				关闭
			</view> -->
		</view>
		<view class="user-bubble" v-if="up" :style="{'animation-play-state':paused}">
			<view class="uname">{{name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: "",
				up: false,
				paused: "paused"
			}
		},
		onLoad() {},
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
				that.up = true;
				that.paused = "running";
				var _msg = val || that.name;
				console.log(_msg)
				let _data = {
					"msg": _msg
				};
				_data["fun"] = function() {
					setTimeout(() => {
						that.up = false;
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
		background: #000;
	}

	.user-box {
		position: relative;
		padding: 20upx;
		height: 100%;
	}

	.send-box {
		z-index: 3;
	}

	.sendMsg {
		font-size: 32upx;
		background: #007AFF;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		line-height: 2;
		padding: 10upx;
		border-radius: 10upx;
		margin: 10upx auto;
	}

	.sign {
		background: #FFFFFF;
		line-height: 2;
		font-size: 48upx;
		border: 2upx solid #CCCCCC;
		padding: 10upx 20upx;
		border-radius: 25upx;
	}

	.user-bubble {
		position: absolute;
		width: 100%;
		bottom: 50%;
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
		color: #FFF;
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
			text-shadow: 0 0 10px #fff,
				0 0 20px #fff,
				0 0 30px #fff,
				0 0 40px #228DFF,
				0 0 70px #228DFF,
				0 0 80px #228DFF,
				0 0 100px #228DFF,
				0 0 150px #228DFF;
		}

		to {
			text-shadow: 0 0 5px #fff,
				0 0 10px #fff,
				0 0 15px #fff,
				0 0 20px #228DFF,
				0 0 35px #228DFF,
				0 0 40px #228DFF,
				0 0 50px #228DFF,
				0 0 75px #228DFF;
		}
	}
</style>
